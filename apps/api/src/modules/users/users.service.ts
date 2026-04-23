import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@common/prisma.service';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDTO } from '@sport-match/shared';

@Injectable()
export class UsersService {
  constructor(private drizzle: DrizzleService) {}

  async findById(id: string): Promise<UserDTO | null> {
    const result = await this.drizzle.db.select().from(users).where(eq(users.id, id)).limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.mapToDTO(result[0]);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDTO> {
    const result = await this.drizzle.db
      .update(users)
      .set({
        name: dto.name,
        avatarUrl: dto.avatarUrl,
        city: dto.city,
        district: dto.district,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return this.mapToDTO(result[0]);
  }

  private mapToDTO(user: any): UserDTO {
    return {
      id: user.id,
      phone: user.phone,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      location: user.city ? { city: user.city, district: user.district || '' } : null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
