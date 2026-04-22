import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { VenueDTO } from '@sport-match/shared';

@Injectable()
export class VenuesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { city?: string; district?: string }): Promise<VenueDTO[]> {
    const venues = await this.prisma.venue.findMany({
      where: {
        ...(filters?.city && { city: filters.city }),
        ...(filters?.district && { district: filters.district }),
      },
      orderBy: { name: 'asc' },
    });

    return venues.map((v) => this.mapToDTO(v));
  }

  async findById(id: string): Promise<VenueDTO | null> {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
    });

    if (!venue) {
      return null;
    }

    return this.mapToDTO(venue);
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
