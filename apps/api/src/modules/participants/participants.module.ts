import { Module, forwardRef } from "@nestjs/common";
import { ParticipantsService } from "./participants.service";
import { ParticipantsController } from "./participants.controller";
import { DrizzleService } from "@common/prisma.service";
import { AuthModule } from "../auth/auth.module";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [AuthModule, forwardRef(() => SessionsModule)],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, DrizzleService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
