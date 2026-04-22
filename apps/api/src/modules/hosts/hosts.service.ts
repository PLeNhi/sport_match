import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { CreateHostProfileDto, UpdateHostProfileDto } from './dto/create-host-profile.dto';
import { HostProfileDTO } from '@sport-match/shared';

@Injectable()
export class HostsService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: string, dto: CreateHostProfileDto): Promise<HostProfileDTO> {
    // Check if user already has a host profile
    const existing = await this.prisma.hostProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('User already has a host profile');
    }

    // Update user role to host
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'host' },
    });

    const profile = await this.prisma.hostProfile.create({
      data: {
        userId,
        displayName: dto.displayName,
        bio: dto.bio,
      },
    });

    return this.mapToDTO(profile);
  }

  async getProfile(userId: string): Promise<HostProfileDTO | null> {
    const profile = await this.prisma.hostProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return null;
    }

    return this.mapToDTO(profile);
  }

  async updateProfile(userId: string, dto: UpdateHostProfileDto): Promise<HostProfileDTO> {
    const profile = await this.prisma.hostProfile.update({
      where: { userId },
      data: {
        displayName: dto.displayName,
        bio: dto.bio,
      },
    });

    return this.mapToDTO(profile);
  }

  private mapToDTO(profile: any): HostProfileDTO {
    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      bio: profile.bio,
      isActive: profile.isActive,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
