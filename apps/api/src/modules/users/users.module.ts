import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DrizzleService } from "@common/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, DrizzleService],
  exports: [UsersService],
})
export class UsersModule {}
