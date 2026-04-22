import {
  Controller,
  Get,
  Patch,
  Param,
  Request,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { SessionsService } from '../sessions/sessions.service';
import { AuthService } from '../auth/auth.service';
import { AuthenticatedRequest } from '@common/types';

@Controller('participants')
export class ParticipantsController {
  constructor(
    private participantsService: ParticipantsService,
    private sessionsService: SessionsService,
    private authService: AuthService,
  ) {}

  private async extractUserId(req: AuthenticatedRequest): Promise<string> {
    const token = (req as any).token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user.id;
  }

  @Get('session/:sessionId')
  async getSessionParticipants(@Param('sessionId') sessionId: string) {
    const participants = await this.participantsService.findBySession(sessionId);
    return { participants };
  }

  @Patch(':id/remove')
  async removeParticipant(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = await this.extractUserId(req);

    const participant = await this.participantsService.findById(id);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    // Verify the requester is the host of the session
    const session = await this.sessionsService.findById(participant.sessionId);
    if (!session || session.hostId !== userId) {
      throw new BadRequestException('Only session host can remove participants');
    }

    const updated = await this.participantsService.remove(id);

    // Check if session should be marked back to open
    const refreshed = await this.sessionsService.findById(participant.sessionId);
    if (refreshed && refreshed.status === 'full' && (refreshed.joinedCount ?? 0) < refreshed.maxPlayers) {
      await this.sessionsService.updateStatus(participant.sessionId, 'open');
    }

    return { participant: updated };
  }
}
