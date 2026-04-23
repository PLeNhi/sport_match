import { Module, forwardRef } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { DrizzleService } from "@common/prisma.service";
import { AuthModule } from "../auth/auth.module";
import { ParticipantsModule } from "../participants/participants.module";

@Module({
  imports: [AuthModule, forwardRef(() => ParticipantsModule)],
  controllers: [SessionsController],
  providers: [SessionsService, DrizzleService],
  exports: [SessionsService],
})
export class SessionsModule {}
