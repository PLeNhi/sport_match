import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaService } from '@common/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, PrismaService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
