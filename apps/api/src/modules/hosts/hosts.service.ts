import { Injectable, BadRequestException } from '@nestjs/common';
import { DrizzleService } from '@common/prisma.service';
import { hostProfiles, users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { CreateHostProfileDto, UpdateHostProfileDto } from './dto/create-host-profile.dto';
import { HostProfileDTO } from '@sport-match/shared';

@Injectable()
export class HostsService {
  constructor(private drizzle: DrizzleService) {}

  async createProfile(userId: string, dto: CreateHostProfileDto): Promise<HostProfileDTO> {
    // Check if user already has a host profile
    const existing = await this.drizzle.db
      .select()
      .from(hostProfiles)
      .where(eq(hostProfiles.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      throw new BadRequestException('User already has a host profile');
    }

    // Update user role to host
    await this.drizzle.db
      .update(users)
      .set({ role: 'host', updatedAt: new Date() })
      .where(eq(users.id, userId));

    const result = await this.drizzle.db
      .insert(hostProfiles)
      .values({
        userId,
        displayName: dto.displayName,
        bio: dto.bio,
      })
      .returning();

    return this.mapToDTO(result[0]);
  }

  async getProfile(userId: string): Promise<HostProfileDTO | null> {
    const result = await this.drizzle.db
      .select()
      .from(hostProfiles)
      .where(eq(hostProfiles.userId, userId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.mapToDTO(result[0]);
  }

  async updateProfile(userId: string, dto: UpdateHostProfileDto): Promise<HostProfileDTO> {
    const result = await this.drizzle.db
      .update(hostProfiles)
      .set({
        displayName: dto.displayName,
        bio: dto.bio,
        updatedAt: new Date(),
      })
      .where(eq(hostProfiles.userId, userId))
      .returning();

    return this.mapToDTO(result[0]);
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
