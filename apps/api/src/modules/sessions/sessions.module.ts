import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { PrismaService } from '@common/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ParticipantsModule } from '../participants/participants.module';

@Module({
  imports: [AuthModule, ParticipantsModule],
  controllers: [SessionsController],
  providers: [SessionsService, PrismaService],
  exports: [SessionsService],
})
export class SessionsModule {}
