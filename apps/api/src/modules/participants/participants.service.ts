import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { SessionParticipantDTO } from '@sport-match/shared';

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) {}

  async create(sessionId: string, userId: string): Promise<SessionParticipantDTO> {
    const participant = await this.prisma.sessionParticipant.create({
      data: {
        sessionId,
        userId,
        attendanceStatus: 'joined',
      },
    });

    return this.mapToDTO(participant);
  }

  async findBySessionAndUser(
    sessionId: string,
    userId: string,
  ): Promise<SessionParticipantDTO | null> {
    const participant = await this.prisma.sessionParticipant.findUnique({
      where: {
        sessionId_userId: { sessionId, userId },
      },
    });

    if (!participant) {
      return null;
    }

    return this.mapToDTO(participant);
  }

  async findBySession(sessionId: string): Promise<SessionParticipantDTO[]> {
    const participants = await this.prisma.sessionParticipant.findMany({
      where: { sessionId },
      orderBy: { joinedAt: 'asc' },
    });

    return participants.map((p) => this.mapToDTO(p));
  }

  async findById(id: string): Promise<SessionParticipantDTO | null> {
    const participant = await this.prisma.sessionParticipant.findUnique({
      where: { id },
    });

    if (!participant) {
      return null;
    }

    return this.mapToDTO(participant);
  }

  async updateStatus(id: string, attendanceStatus: string): Promise<SessionParticipantDTO> {
    const participant = await this.prisma.sessionParticipant.update({
      where: { id },
      data: { attendanceStatus },
    });

    return this.mapToDTO(participant);
  }

  async remove(id: string): Promise<SessionParticipantDTO> {
    const participant = await this.prisma.sessionParticipant.update({
      where: { id },
      data: { attendanceStatus: 'removed' },
    });

    return this.mapToDTO(participant);
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
