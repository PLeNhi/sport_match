import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { HostsService } from './hosts.service';
import { CreateHostProfileDto, UpdateHostProfileDto } from './dto/create-host-profile.dto';
import { AuthService } from '../auth/auth.service';
import { AuthenticatedRequest } from '@common/types';

@Controller('hosts')
export class HostsController {
  constructor(
    private hostsService: HostsService,
    private authService: AuthService,
  ) {}

  private async extractUserId(req: AuthenticatedRequest): Promise<string> {
    const token = (req as any).token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user.id;
  }

  @Get('me')
  async getProfile(@Request() req: AuthenticatedRequest) {
    const userId = await this.extractUserId(req);
    const profile = await this.hostsService.getProfile(userId);

    if (!profile) {
      throw new NotFoundException('Host profile not found');
    }

    return { profile };
  }

  @Post('me/create-profile')
  async createProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateHostProfileDto,
  ) {
    const userId = await this.extractUserId(req);
    const profile = await this.hostsService.createProfile(userId, dto);
    return { profile };
  }

  @Patch('me')
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateHostProfileDto,
  ) {
    const userId = await this.extractUserId(req);
    const profile = await this.hostsService.updateProfile(userId, dto);
    return { profile };
  }
}
