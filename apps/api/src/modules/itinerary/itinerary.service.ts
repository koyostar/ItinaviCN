import { Injectable, NotFoundException } from '@nestjs/common';
import type { LocationCategory, Prisma } from '@prisma/client';
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
   * Automatically creates a location if the item has an address.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @param {Omit<Prisma.ItineraryItemCreateInput, 'trip'>} input - Itinerary item creation data
   * @returns {Promise} The newly created itinerary item
   */
  async createItem(
    tripId: string,
    input: Omit<Prisma.ItineraryItemCreateInput, 'trip'>,
  ) {
    // Extract details to check for address
    const details = input.details as Record<
      string,
      string | number | undefined
    >;
    const type = input.type as string;

    // Auto-create location for items with addresses (only if no manual locationId provided)
    if (
      !input.location &&
      details.address &&
      (type === 'Accommodation' || type === 'Place' || type === 'Food')
    ) {
      const categoryMap: Record<string, LocationCategory> = {
        Accommodation: 'Accommodation',
        Place: 'Place',
        Food: 'Restaurant',
      };

      const locationName =
        type === 'Accommodation' && details.hotelName
          ? String(details.hotelName)
          : input.title;

      const location = await this.prisma.location.create({
        data: {
          tripId,
          name: locationName,
          category: categoryMap[type],
          address: String(details.address),
        },
      });

      return this.prisma.itineraryItem.create({
        data: {
          ...input,
          location: { connect: { id: location.id } },
          trip: { connect: { id: tripId } },
        },
      });
    }

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

  /**
   * Syncs existing itinerary items with locations.
   * Creates locations for items that have addresses but no linked location.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @returns {Promise} Count of locations created
   */
  async syncLocations(tripId: string) {
    const items = await this.prisma.itineraryItem.findMany({
      where: {
        tripId,
        locationId: null,
        type: { in: ['Accommodation', 'Place', 'Food'] },
      },
    });

    const categoryMap: Record<string, LocationCategory> = {
      Accommodation: 'Accommodation',
      Place: 'Place',
      Food: 'Restaurant',
    };

    let createdCount = 0;

    for (const item of items) {
      const details = item.details as Record<
        string,
        string | number | undefined
      >;

      if (details.address) {
        const locationName =
          item.type === 'Accommodation' && details.hotelName
            ? String(details.hotelName)
            : item.title;

        const locationData = {
          tripId,
          name: locationName,
          category: categoryMap[item.type],
          ...(details.city && { city: String(details.city) }),
          ...(details.district && { district: String(details.district) }),
          ...(details.province && { province: String(details.province) }),
          address: String(details.address),
          ...(details.latitude !== undefined &&
            details.longitude !== undefined && {
              latitude: Number(details.latitude),
              longitude: Number(details.longitude),
            }),
          ...(details.adcode && { adcode: String(details.adcode) }),
          ...(details.citycode && { citycode: String(details.citycode) }),
          ...(details.amapPoiId && { amapPoiId: String(details.amapPoiId) }),
        };

        const location = await this.prisma.location.create({
          data: locationData,
        });

        await this.prisma.itineraryItem.update({
          where: { id: item.id },
          data: { locationId: location.id },
        });

        createdCount++;
      }
    }

    return { created: createdCount };
  }
}
