import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/create-session.dto';
import { GameSessionDTO, SessionFilterParams } from '@sport-match/shared';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(hostId: string, dto: CreateSessionDto): Promise<GameSessionDTO> {
    // Validate venue exists
    const venue = await this.prisma.venue.findUnique({
      where: { id: dto.venueId },
    });

    if (!venue) {
      throw new BadRequestException('Venue not found');
    }

    const session = await this.prisma.gameSession.create({
      data: {
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
      },
      include: {
        venue: true,
        host: {
          include: {
            hostProfile: true,
          },
        },
        participants: true,
      },
    });

    return this.mapToDTO(session);
  }

  async findAll(filters: SessionFilterParams = {}): Promise<GameSessionDTO[]> {
    const sessions = await this.prisma.gameSession.findMany({
      where: {
        ...(filters.city && { venue: { city: filters.city } }),
        ...(filters.district && { venue: { district: filters.district } }),
        ...(filters.date && { date: filters.date }),
        ...(filters.skillLevel && { skillLevel: filters.skillLevel }),
        ...(filters.hostId && { hostId: filters.hostId }),
        ...(filters.onlyOpen && { status: 'open' }),
      },
      include: {
        venue: true,
        host: {
          include: {
            hostProfile: true,
          },
        },
        participants: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    return sessions.map((s) => this.mapToDTO(s));
  }

  async findById(id: string, userId?: string): Promise<GameSessionDTO | null> {
    const session = await this.prisma.gameSession.findUnique({
      where: { id },
      include: {
        venue: true,
        host: {
          include: {
            hostProfile: true,
          },
        },
        participants: true,
      },
    });

    if (!session) {
      return null;
    }

    return this.mapToDTO(session, userId);
  }

  async getHostSessions(hostId: string): Promise<GameSessionDTO[]> {
    const sessions = await this.prisma.gameSession.findMany({
      where: { hostId },
      include: {
        venue: true,
        host: {
          include: {
            hostProfile: true,
          },
        },
        participants: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    return sessions.map((s) => this.mapToDTO(s));
  }

  async update(id: string, hostId: string, dto: UpdateSessionDto): Promise<GameSessionDTO> {
    const session = await this.prisma.gameSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.hostId !== hostId) {
      throw new BadRequestException('Only host can update this session');
    }

    const updated = await this.prisma.gameSession.update({
      where: { id },
      data: {
        title: dto.title,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        description: dto.description,
        priceLabel: dto.priceLabel,
        status: dto.status,
      },
      include: {
        venue: true,
        host: {
          include: {
            hostProfile: true,
          },
        },
        participants: true,
      },
    });

    return this.mapToDTO(updated);
  }

  async updateStatus(
    id: string,
    status: string,
    sessionData?: any,
  ): Promise<GameSessionDTO | null> {
    const session = await this.prisma.gameSession.findUnique({
      where: { id },
    });

    if (!session) {
      return null;
    }

    const updated = await this.prisma.gameSession.update({
      where: { id },
      data: {
        status,
        ...sessionData,
      },
      include: {
        venue: true,
        host: {
          include: {
            hostProfile: true,
          },
        },
        participants: true,
      },
    });

    return this.mapToDTO(updated);
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
