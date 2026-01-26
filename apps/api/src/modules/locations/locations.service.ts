import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Service responsible for managing saved locations (places of interest).
 * Handles CRUD operations for locations associated with trips.
 */
@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all locations for a specific trip.
   * Locations are ordered by creation date.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @returns {Promise} List of locations for the trip
   */
  async listLocations(tripId: string) {
    return this.prisma.location.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Retrieves a single location by ID.
   *
   * @param {string} locationId - The unique identifier of the location
   * @returns {Promise} The location data
   * @throws {NotFoundException} If location with given ID is not found
   */
  async getLocation(locationId: string) {
    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  /**
   * Creates a new location for a trip.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @param {Omit<Prisma.LocationCreateInput, 'trip'>} input - Location creation data
   * @returns {Promise} The newly created location
   */
  async createLocation(
    tripId: string,
    input: Omit<Prisma.LocationCreateInput, 'trip'>,
  ) {
    return this.prisma.location.create({
      data: {
        ...input,
        trip: { connect: { id: tripId } },
      },
    });
  }

  /**
   * Updates an existing location.
   *
   * @param {string} locationId - The unique identifier of the location to update
   * @param {Prisma.LocationUpdateInput} input - Location update data
   * @returns {Promise} The updated location
   * @throws {NotFoundException} If location with given ID is not found
   */
  async updateLocation(locationId: string, input: Prisma.LocationUpdateInput) {
    await this.getLocation(locationId);
    return this.prisma.location.update({
      where: { id: locationId },
      data: input,
    });
  }

  /**
   * Deletes a location by ID.
   *
   * @param {string} locationId - The unique identifier of the location to delete
   * @returns {Promise<void>}
   * @throws {NotFoundException} If location with given ID is not found
   */
  async deleteLocation(locationId: string) {
    await this.getLocation(locationId);
    await this.prisma.location.delete({
      where: { id: locationId },
    });
  }
}
