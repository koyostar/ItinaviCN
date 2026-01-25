import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listLocations(tripId: string) {
    return this.prisma.location.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getLocation(locationId: string) {
    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async createLocation(tripId: string, input: Omit<Prisma.LocationCreateInput, 'trip'>) {
    return this.prisma.location.create({
      data: {
        ...input,
        trip: { connect: { id: tripId } },
      },
    });
  }

  async updateLocation(locationId: string, input: Prisma.LocationUpdateInput) {
    await this.getLocation(locationId);
    return this.prisma.location.update({
      where: { id: locationId },
      data: input,
    });
  }

  async deleteLocation(locationId: string) {
    await this.getLocation(locationId);
    await this.prisma.location.delete({
      where: { id: locationId },
    });
  }
}
