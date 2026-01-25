import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ItineraryService {
  constructor(private readonly prisma: PrismaService) {}

  async listItems(tripId: string) {
    return this.prisma.itineraryItem.findMany({
      where: { tripId },
      orderBy: { startDateTime: 'asc' },
    });
  }

  async getItem(itemId: string) {
    const item = await this.prisma.itineraryItem.findUnique({
      where: { id: itemId },
    });
    if (!item) throw new NotFoundException('Itinerary item not found');
    return item;
  }

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

  async updateItem(itemId: string, input: Prisma.ItineraryItemUpdateInput) {
    await this.getItem(itemId);
    return this.prisma.itineraryItem.update({
      where: { id: itemId },
      data: input,
    });
  }

  async deleteItem(itemId: string) {
    await this.getItem(itemId);
    await this.prisma.itineraryItem.delete({
      where: { id: itemId },
    });
  }
}
