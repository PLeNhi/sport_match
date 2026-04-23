import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@common/prisma.service';
import { sessionParticipants } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { SessionParticipantDTO } from '@sport-match/shared';

@Injectable()
export class ParticipantsService {
  constructor(private drizzle: DrizzleService) {}

  async create(sessionId: string, userId: string): Promise<SessionParticipantDTO> {
    const result = await this.drizzle.db
      .insert(sessionParticipants)
      .values({
        sessionId,
        userId,
        attendanceStatus: 'joined',
      })
      .returning();

    return this.mapToDTO(result[0]);
  }

  async findBySessionAndUser(
    sessionId: string,
    userId: string,
  ): Promise<SessionParticipantDTO | null> {
    const result = await this.drizzle.db
      .select()
      .from(sessionParticipants)
      .where(and(eq(sessionParticipants.sessionId, sessionId), eq(sessionParticipants.userId, userId)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.mapToDTO(result[0]);
  }

  async findBySession(sessionId: string): Promise<SessionParticipantDTO[]> {
    const result = await this.drizzle.db
      .select()
      .from(sessionParticipants)
      .where(eq(sessionParticipants.sessionId, sessionId))
      .orderBy(sessionParticipants.joinedAt);

    return result.map((p) => this.mapToDTO(p));
  }

  async findById(id: string): Promise<SessionParticipantDTO | null> {
    const result = await this.drizzle.db
      .select()
      .from(sessionParticipants)
      .where(eq(sessionParticipants.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.mapToDTO(result[0]);
  }

  async updateStatus(id: string, attendanceStatus: string): Promise<SessionParticipantDTO> {
    const result = await this.drizzle.db
      .update(sessionParticipants)
      .set({ attendanceStatus, updatedAt: new Date() })
      .where(eq(sessionParticipants.id, id))
      .returning();

    return this.mapToDTO(result[0]);
  }

  async remove(id: string): Promise<SessionParticipantDTO> {
    const result = await this.drizzle.db
      .update(sessionParticipants)
      .set({ attendanceStatus: 'removed', updatedAt: new Date() })
      .where(eq(sessionParticipants.id, id))
      .returning();

    return this.mapToDTO(result[0]);
  }

  private mapToDTO(participant: any): SessionParticipantDTO {
    return {
      id: participant.id,
      sessionId: participant.sessionId,
      userId: participant.userId,
      attendanceStatus: participant.attendanceStatus,
      joinedAt: participant.joinedAt.toISOString(),
      updatedAt: participant.updatedAt.toISOString(),
    };
  }
}
