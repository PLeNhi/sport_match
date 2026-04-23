import { Injectable, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DrizzleService } from "@common/prisma.service";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { MockLoginDto } from "./dto/mock-login.dto";
import { UserDTO } from "@sport-match/shared";

@Injectable()
export class AuthService {
  constructor(
    private drizzle: DrizzleService,
    private jwtService: JwtService,
  ) {}

  async mockLogin(dto: MockLoginDto) {
    const normalized = dto.phone.replace(/\D/g, "");

    if (!normalized || normalized.length < 9) {
      throw new BadRequestException("Invalid phone number");
    }

    // Find or create user
    let userResult = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.phone, normalized))
      .limit(1);

    let user;
    if (userResult.length === 0) {
      const newUserResult = await this.drizzle.db
        .insert(users)
        .values({
          phone: normalized,
          name: dto.name || `User ${normalized.slice(-4)}`,
          role: "player",
        })
        .returning();
      user = newUserResult[0];
    } else {
      user = userResult[0];
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
        phone: user.phone,
        role: user.role,
      },
      { expiresIn: "30d" },
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
      const userResult = await this.drizzle.db
        .select()
        .from(users)
        .where(eq(users.id, payload.id))
        .limit(1);

      if (userResult.length === 0) {
        return null;
      }

      return this.mapToDTO(userResult[0]);
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
      location: user.city
        ? { city: user.city, district: user.district || "" }
        : null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
