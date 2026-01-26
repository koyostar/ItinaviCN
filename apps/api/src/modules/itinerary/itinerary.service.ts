import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Service responsible for managing itinerary items.
 * Handles CRUD operations for flights, accommodations, transport, place visits, and food entries.
 */
@Injectable()
export class ItineraryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all itinerary items for a specific trip.
   * Items are ordered chronologically by start date/time.
   * 
   * @param {string} tripId - The unique identifier of the trip
   * @returns {Promise} List of itinerary items for the trip
   */
  async listItems(tripId: string) {
    return this.prisma.itineraryItem.findMany({
      where: { tripId },
      orderBy: { startDateTime: 'asc' },
    });
  }

  /**
   * Retrieves a single itinerary item by ID.
   * 
   * @param {string} itemId - The unique identifier of the itinerary item
   * @returns {Promise} The itinerary item data
   * @throws {NotFoundException} If item with given ID is not found
   */
  async getItem(itemId: string) {
    const item = await this.prisma.itineraryItem.findUnique({
      where: { id: itemId },
    });
    if (!item) throw new NotFoundException('Itinerary item not found');
    return item;
  }

  /**
   * Creates a new itinerary item for a trip.
   * 
   * @param {string} tripId - The unique identifier of the trip
   * @param {Omit<Prisma.ItineraryItemCreateInput, 'trip'>} input - Itinerary item creation data
   * @returns {Promise} The newly created itinerary item
   */
  async createItem(
    tripId: string,
    input: Omit<Prisma.ItineraryItemCreateInput, 'trip'>,
  ) {
    return this.prisma.itineraryItem.create({
      data: {
        ...input,
        trip: { connect: { id: tripId } },
      },
    });
  }

  /**
   * Updates an existing itinerary item.
   * 
   * @param {string} itemId - The unique identifier of the item to update
   * @param {Prisma.ItineraryItemUpdateInput} input - Itinerary item update data
   * @returns {Promise} The updated itinerary item
   * @throws {NotFoundException} If item with given ID is not found
   */
  async updateItem(itemId: string, input: Prisma.ItineraryItemUpdateInput) {
    await this.getItem(itemId);
    return this.prisma.itineraryItem.update({
      where: { id: itemId },
      data: input,
    });
  }

  /**
   * Deletes an itinerary item by ID.
   * 
   * @param {string} itemId - The unique identifier of the item to delete
   * @returns {Promise<void>}
   * @throws {NotFoundException} If item with given ID is not found
   */
  async deleteItem(itemId: string) {
    await this.getItem(itemId);
    await this.prisma.itineraryItem.delete({
      where: { id: itemId },
    });
  }
}
