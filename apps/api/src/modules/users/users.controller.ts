import {
  Controller,
  Get,
  Patch,
  Body,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthService } from "../auth/auth.service";
import { AuthenticatedRequest } from "@common/types";

@Controller("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get("me")
  async getMe(@Request() req: AuthenticatedRequest) {
    const token =
      (req as any).token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    return { user };
  }

  @Patch("me")
  async updateMe(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateUserDto,
  ) {
    const token =
      (req as any).token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    const updated = await this.usersService.updateUser(user.id, dto);
    return { user: updated };
  }
}
