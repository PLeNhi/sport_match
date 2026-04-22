import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { HostsModule } from '@modules/hosts/hosts.module';
import { VenuesModule } from '@modules/venues/venues.module';
import { SessionsModule } from '@modules/sessions/sessions.module';
import { ParticipantsModule } from '@modules/participants/participants.module';
import { HealthModule } from '@modules/health/health.module';
import { PrismaService } from '@common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    HostsModule,
    VenuesModule,
    SessionsModule,
    ParticipantsModule,
    HealthModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
