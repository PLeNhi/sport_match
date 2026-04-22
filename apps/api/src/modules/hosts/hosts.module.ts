import { Module } from '@nestjs/common';
import { HostsService } from './hosts.service';
import { HostsController } from './hosts.controller';
import { PrismaService } from '@common/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [HostsController],
  providers: [HostsService, PrismaService],
  exports: [HostsService],
})
export class HostsModule {}
