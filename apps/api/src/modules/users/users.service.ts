import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDTO } from '@sport-match/shared';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UserDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return this.mapToDTO(user);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDTO> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        avatarUrl: dto.avatarUrl,
        city: dto.city,
        district: dto.district,
      },
    });

    return this.mapToDTO(user);
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
