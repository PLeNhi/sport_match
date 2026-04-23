import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from "@nestjs/common";
import { VenuesService } from "./venues.service";

@Controller("venues")
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  @Get()
  async findAll(
    @Query("city") city?: string,
    @Query("district") district?: string,
  ) {
    const venues = await this.venuesService.findAll({
      city,
      district,
    });

    return { venues };
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    const venue = await this.venuesService.findById(id);

    if (!venue) {
      throw new NotFoundException("Venue not found");
    }

    return { venue };
  }
}
