import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Request,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto, UpdateSessionDto } from "./dto/create-session.dto";
import { ParticipantsService } from "../participants/participants.service";
import { AuthService } from "../auth/auth.service";
import { AuthenticatedRequest } from "@common/types";
import { SKILL_LEVELS } from "@sport-match/shared";

@Controller("sessions")
export class SessionsController {
  constructor(
    private sessionsService: SessionsService,
    private participantsService: ParticipantsService,
    private authService: AuthService,
  ) {}

  private async extractUserId(req: AuthenticatedRequest): Promise<string> {
    const token =
      (req as any).token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    return user.id;
  }

  @Get()
  async findAll(
    @Query("city") city?: string,
    @Query("district") district?: string,
    @Query("date") date?: string,
    @Query("skillLevel") skillLevel?: string,
    @Query("hostId") hostId?: string,
    @Query("onlyOpen") onlyOpen?: string | boolean,
  ) {
    const sessions = await this.sessionsService.findAll({
      city,
      district,
      date,
      skillLevel:
        skillLevel && Object.values(SKILL_LEVELS).includes(skillLevel as any)
          ? (skillLevel as any)
          : undefined,
      hostId,
      onlyOpen: onlyOpen === true || onlyOpen === "true",
    });

    return { sessions };
  }

  @Get("host/me")
  async getHostSessions(@Request() req: AuthenticatedRequest) {
    const userId = await this.extractUserId(req);
    const sessions = await this.sessionsService.getHostSessions(userId);
    return { sessions };
  }

  @Get(":id")
  async findById(
    @Param("id") id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    // Try to extract user for personalization, but don't fail if not authenticated
    let userId: string | undefined;
    try {
      userId = await this.extractUserId(req);
    } catch {
      // Not authenticated is OK for viewing sessions
    }

    const session = await this.sessionsService.findById(id, userId);

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    return { session };
  }

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateSessionDto,
  ) {
    const userId = await this.extractUserId(req);
    const session = await this.sessionsService.create(userId, dto);
    return { session };
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateSessionDto,
  ) {
    const userId = await this.extractUserId(req);
    const session = await this.sessionsService.update(id, userId, dto);
    return { session };
  }

  @Post(":id/join")
  async joinSession(
    @Param("id") id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = await this.extractUserId(req);

    const session = await this.sessionsService.findById(id);
    if (!session) {
      throw new NotFoundException("Session not found");
    }

    if (session.status !== "open" && session.status !== "full") {
      throw new BadRequestException(
        `Cannot join session with status ${session.status}`,
      );
    }

    if (session.isJoinedByCurrentUser) {
      throw new BadRequestException("Already joined this session");
    }

    if ((session.joinedCount ?? 0) >= session.maxPlayers) {
      throw new BadRequestException("Session is full");
    }

    const participant = await this.participantsService.create(id, userId);

    // Check if session should be marked as full
    const updated = await this.sessionsService.findById(id, userId);
    if (
      updated &&
      (updated.joinedCount ?? 0) >= updated.maxPlayers &&
      updated.status !== "full"
    ) {
      await this.sessionsService.updateStatus(id, "full");
    }

    return { participant };
  }

  @Post(":id/leave")
  async leaveSession(
    @Param("id") id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = await this.extractUserId(req);

    const participant = await this.participantsService.findBySessionAndUser(
      id,
      userId,
    );
    if (!participant) {
      throw new NotFoundException("Not joined this session");
    }

    await this.participantsService.remove(participant.id);

    // Check if session should be marked back to open
    const session = await this.sessionsService.findById(id);
    if (
      session &&
      session.status === "full" &&
      (session.joinedCount ?? 0) < session.maxPlayers
    ) {
      await this.sessionsService.updateStatus(id, "open");
    }

    return { message: "Left session" };
  }

  @Post(":id/confirm-attendance")
  async confirmAttendance(
    @Param("id") id: string,
    @Body() body: { attendanceStatus: "confirmed" | "declined" },
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = await this.extractUserId(req);

    const participant = await this.participantsService.findBySessionAndUser(
      id,
      userId,
    );
    if (!participant) {
      throw new NotFoundException("Not joined this session");
    }

    const updated = await this.participantsService.updateStatus(
      participant.id,
      body.attendanceStatus,
    );

    return { participant: updated };
  }
}
