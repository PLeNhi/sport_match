import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@common/prisma.service';
import { venues } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { VenueDTO } from '@sport-match/shared';

@Injectable()
export class VenuesService {
  constructor(private drizzle: DrizzleService) {}

  async findAll(filters?: { city?: string; district?: string }): Promise<VenueDTO[]> {
    const conditions = [];
    if (filters?.city) conditions.push(eq(venues.city, filters.city));
    if (filters?.district) conditions.push(eq(venues.district, filters.district));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await this.drizzle.db
      .select()
      .from(venues)
      .where(whereClause)
      .orderBy(venues.name);

    return result.map((v) => this.mapToDTO(v));
  }

  async findById(id: string): Promise<VenueDTO | null> {
    const result = await this.drizzle.db
      .select()
      .from(venues)
      .where(eq(venues.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.mapToDTO(result[0]);
  }

  private mapToDTO(venue: any): VenueDTO {
    return {
      id: venue.id,
      name: venue.name,
      city: venue.city,
      district: venue.district,
      address: venue.address,
      createdAt: venue.createdAt.toISOString(),
      updatedAt: venue.updatedAt.toISOString(),
    };
  }
}
