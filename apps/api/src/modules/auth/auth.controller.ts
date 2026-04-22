import {
  Controller,
  Post,
  Get,
  Request,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MockLoginDto } from './dto/mock-login.dto';
import { AuthenticatedRequest } from '@common/types';

// TODO: Implement JWT guard when needed
// @UseGuards(JwtAuthGuard)
export class JwtAuthGuard {
  canActivate(context: any) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    
    if (!token) {
      return false;
    }

    request.token = token;
    return true;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('mock-login')
  async mockLogin(@Body() dto: MockLoginDto) {
    return this.authService.mockLogin(dto);
  }

  @Get('me')
  async getMe(@Request() req: AuthenticatedRequest) {
    const token = (req as any).token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return { user };
  }
}
