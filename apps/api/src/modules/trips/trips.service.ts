import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Service responsible for managing trip-related business logic.
 * Handles CRUD operations for trips using Prisma ORM.
 */
@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all trips ordered by start date.
   *
   * @returns {Promise} List of all trips sorted chronologically
   */
  async listTrips() {
    return this.prisma.trip.findMany({
      orderBy: { startDate: 'asc' },
    });
  }

  /**
   * Retrieves a single trip by ID.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @returns {Promise} The trip data
   * @throws {NotFoundException} If trip with given ID is not found
   */
  async getTrip(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  /**
   * Creates a new trip.
   *
   * @param {Prisma.TripCreateInput} input - Trip creation data
   * @returns {Promise} The newly created trip
   */
  async createTrip(input: Prisma.TripCreateInput) {
    return this.prisma.trip.create({ data: input });
  }

  /**
   * Updates an existing trip.
   *
   * @param {string} tripId - The unique identifier of the trip to update
   * @param {Prisma.TripUpdateInput} input - Trip update data
   * @returns {Promise} The updated trip
   * @throws {NotFoundException} If trip with given ID is not found
   */
  async updateTrip(tripId: string, input: Prisma.TripUpdateInput) {
    await this.getTrip(tripId);
    return this.prisma.trip.update({
      where: { id: tripId },
      data: input,
    });
  }

  /**
   * Deletes a trip by ID.
   *
   * @param {string} tripId - The unique identifier of the trip to delete
   * @returns {Promise<void>}
   * @throws {NotFoundException} If trip with given ID is not found
   */
  async deleteTrip(tripId: string) {
    await this.getTrip(tripId);
    await this.prisma.trip.delete({ where: { id: tripId } });
  }
}
