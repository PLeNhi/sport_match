import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@common/prisma.service';
import { MockLoginDto } from './dto/mock-login.dto';
import { UserDTO } from '@sport-match/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async mockLogin(dto: MockLoginDto) {
    const normalized = dto.phone.replace(/\D/g, '');
    
    if (!normalized || normalized.length < 9) {
      throw new BadRequestException('Invalid phone number');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone: normalized },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: normalized,
          name: dto.name || `User ${normalized.slice(-4)}`,
          role: 'player',
        },
      });
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
      { expiresIn: '30d' },
    );

    const userDTO = this.mapToDTO(user);

    return {
      user: userDTO,
      token,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });
      
      if (!user) {
        return null;
      }

      return this.mapToDTO(user);
    } catch {
      return null;
    }
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
