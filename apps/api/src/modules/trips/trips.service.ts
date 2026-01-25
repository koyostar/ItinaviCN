import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  async listTrips() {
    return this.prisma.trip.findMany({
      orderBy: { startDate: 'asc' },
    });
  }

  async getTrip(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async createTrip(input: Prisma.TripCreateInput) {
    return this.prisma.trip.create({ data: input });
  }

  async updateTrip(tripId: string, input: Prisma.TripUpdateInput) {
    await this.getTrip(tripId);
    return this.prisma.trip.update({
      where: { id: tripId },
      data: input,
    });
  }

  async deleteTrip(tripId: string) {
    await this.getTrip(tripId);
    await this.prisma.trip.delete({ where: { id: tripId } });
  }
}
