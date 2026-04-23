import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DrizzleService } from '@common/prisma.service';
import { gameSessions, venues, users, hostProfiles, sessionParticipants } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { CreateSessionDto, UpdateSessionDto } from './dto/create-session.dto';
import { GameSessionDTO, SessionFilterParams } from '@sport-match/shared';

@Injectable()
export class SessionsService {
  constructor(private drizzle: DrizzleService) {}

  async create(hostId: string, dto: CreateSessionDto): Promise<GameSessionDTO> {
    // Validate venue exists
    const venueResult = await this.drizzle.db.select().from(venues).where(eq(venues.id, dto.venueId)).limit(1);

    if (venueResult.length === 0) {
      throw new BadRequestException('Venue not found');
    }

    const sessionResult = await this.drizzle.db
      .insert(gameSessions)
      .values({
        hostId,
        venueId: dto.venueId,
        title: dto.title,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        skillLevel: dto.skillLevel,
        maxPlayers: dto.maxPlayers,
        description: dto.description,
        priceLabel: dto.priceLabel,
        status: 'open',
        sportType: 'badminton',
      })
      .returning();

    const session = sessionResult[0];
    const fullSession = await this.getSessionWithRelations(session.id);
    return this.mapToDTO(fullSession!);
  }

  async findAll(filters: SessionFilterParams = {}): Promise<GameSessionDTO[]> {
    const conditions = [];
    if (filters.date) conditions.push(eq(gameSessions.date, filters.date));
    if (filters.skillLevel) conditions.push(eq(gameSessions.skillLevel, filters.skillLevel));
    if (filters.hostId) conditions.push(eq(gameSessions.hostId, filters.hostId));
    if (filters.onlyOpen) conditions.push(eq(gameSessions.status, 'open'));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sessionsResult = await this.drizzle.db
      .select()
      .from(gameSessions)
      .where(whereClause)
      .orderBy(gameSessions.date, gameSessions.startTime);

    const sessions = [];
    for (const session of sessionsResult) {
      const fullSession = await this.getSessionWithRelations(session.id);
      if (fullSession) {
        // Apply venue filters
        if (filters.city && fullSession.venue?.city !== filters.city) continue;
        if (filters.district && fullSession.venue?.district !== filters.district) continue;
        sessions.push(fullSession);
      }
    }

    return sessions.map((s) => this.mapToDTO(s));
  }

  async findById(id: string, userId?: string): Promise<GameSessionDTO | null> {
    const sessionResult = await this.drizzle.db.select().from(gameSessions).where(eq(gameSessions.id, id)).limit(1);

    if (sessionResult.length === 0) {
      return null;
    }

    const session = await this.getSessionWithRelations(id);
    return this.mapToDTO(session, userId);
  }

  async getHostSessions(hostId: string): Promise<GameSessionDTO[]> {
    const sessionsResult = await this.drizzle.db
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.hostId, hostId))
      .orderBy(gameSessions.date, gameSessions.startTime);

    const sessions = [];
    for (const session of sessionsResult) {
      const fullSession = await this.getSessionWithRelations(session.id);
      if (fullSession) {
        sessions.push(fullSession);
      }
    }

    return sessions.map((s) => this.mapToDTO(s));
  }

  async update(id: string, hostId: string, dto: UpdateSessionDto): Promise<GameSessionDTO> {
    const sessionResult = await this.drizzle.db.select().from(gameSessions).where(eq(gameSessions.id, id)).limit(1);

    if (sessionResult.length === 0) {
      throw new NotFoundException('Session not found');
    }

    const session = sessionResult[0];
    if (session.hostId !== hostId) {
      throw new BadRequestException('Only host can update this session');
    }

    await this.drizzle.db
      .update(gameSessions)
      .set({
        title: dto.title,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        description: dto.description,
        priceLabel: dto.priceLabel,
        status: dto.status,
        updatedAt: new Date(),
      })
      .where(eq(gameSessions.id, id));

    const updated = await this.getSessionWithRelations(id);
    return this.mapToDTO(updated!);
  }

  private async getSessionWithRelations(sessionId: string) {
    const sessionResult = await this.drizzle.db.select().from(gameSessions).where(eq(gameSessions.id, sessionId)).limit(1);
    if (sessionResult.length === 0) return null;

    const session = sessionResult[0];

    // Get venue
    const venueResult = await this.drizzle.db.select().from(venues).where(eq(venues.id, session.venueId)).limit(1);
    const venue = venueResult[0] || null;

    // Get host with profile
    const hostResult = await this.drizzle.db
      .select({
        user: users,
        profile: hostProfiles,
      })
      .from(users)
      .leftJoin(hostProfiles, eq(users.id, hostProfiles.userId))
      .where(eq(users.id, session.hostId))
      .limit(1);

    const host = hostResult[0] ? { ...hostResult[0].user, hostProfile: hostResult[0].profile } : null;

    // Get participants
    const participantsResult = await this.drizzle.db.select().from(sessionParticipants).where(eq(sessionParticipants.sessionId, sessionId));

    return {
      ...session,
      venue,
      host,
      participants: participantsResult,
    };
  }

  async updateStatus(
    id: string,
    status: string,
    sessionData?: any,
  ): Promise<GameSessionDTO | null> {
    const sessionResult = await this.drizzle.db.select().from(gameSessions).where(eq(gameSessions.id, id)).limit(1);

    if (sessionResult.length === 0) {
      return null;
    }

    const updateData: any = { status, updatedAt: new Date() };
    if (sessionData) {
      Object.assign(updateData, sessionData);
    }

    await this.drizzle.db.update(gameSessions).set(updateData).where(eq(gameSessions.id, id));

    const updated = await this.getSessionWithRelations(id);
    return this.mapToDTO(updated!);
  }

  private mapToDTO(session: any, userId?: string): GameSessionDTO {
    const joinedCount = session.participants.length;
    const isFull = joinedCount >= session.maxPlayers;
    const status = isFull ? 'full' : session.status;

    return {
      id: session.id,
      hostId: session.hostId,
      venueId: session.venueId,
      title: session.title,
      description: session.description,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      skillLevel: session.skillLevel,
      maxPlayers: session.maxPlayers,
      priceLabel: session.priceLabel,
      status,
      sportType: session.sportType,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      joinedCount,
      availableSlots: Math.max(0, session.maxPlayers - joinedCount),
      isJoinedByCurrentUser: userId
        ? session.participants.some((p: any) => p.userId === userId)
        : false,
      venue: session.venue ? this.mapVenueToDTO(session.venue) : undefined,
      host: session.host
        ? {
            id: session.host.id,
            phone: session.host.phone,
            name: session.host.name,
            avatarUrl: session.host.avatarUrl,
            role: session.host.role,
            location: session.host.city
              ? { city: session.host.city, district: session.host.district || '' }
              : null,
            createdAt: session.host.createdAt.toISOString(),
            updatedAt: session.host.updatedAt.toISOString(),
            ...session.host.hostProfile,
          }
        : undefined,
      participants: session.participants.map((p: any) => ({
        id: p.id,
        sessionId: p.sessionId,
        userId: p.userId,
        attendanceStatus: p.attendanceStatus,
        joinedAt: p.joinedAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    };
  }

  private mapVenueToDTO(venue: any) {
    return {
      id: venue.id,
      name: venue.name,
      city: venue.city,
      district: venue.district,
      address: venue.address,
      createdAt: venue.createdAt.toISOString(),
      updatedAt: venue.updatedAt.toISOString(),
    };
  }
}
