import { Module } from "@nestjs/common";
import { VenuesService } from "./venues.service";
import { VenuesController } from "./venues.controller";
import { DrizzleService } from "@common/prisma.service";

@Module({
  controllers: [VenuesController],
  providers: [VenuesService, DrizzleService],
  exports: [VenuesService],
})
export class VenuesModule {}
