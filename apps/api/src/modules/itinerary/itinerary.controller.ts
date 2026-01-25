import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  CreateItineraryItemRequestSchema,
  ItineraryItemIdParamSchema,
  ItineraryItemResponseSchema,
  ListItineraryItemsResponseSchema,
  TripIdParamSchema,
  UpdateItineraryItemRequestSchema,
} from '@itinavi/schema';
import { validate } from '../../common/validate';
import { ItineraryService } from './itinerary.service';

function toItineraryItemResponse(item: {
  id: string;
  tripId: string;
  type: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date | null;
  timezone: string;
  status: string;
  locationId: string | null;
  bookingRef: string | null;
  url: string | null;
  notes: string | null;
  details: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  return ItineraryItemResponseSchema.parse({
    id: item.id,
    tripId: item.tripId,
    type: item.type,
    title: item.title,
    startDateTime: item.startDateTime.toISOString(),
    endDateTime: item.endDateTime?.toISOString() ?? null,
    timezone: item.timezone,
    status: item.status,
    locationId: item.locationId,
    bookingRef: item.bookingRef,
    url: item.url,
    notes: item.notes,
    details: item.details,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  });
}

@Controller('api/trips/:tripId/itinerary')
export class ItineraryController {
  constructor(private readonly itinerary: ItineraryService) {}

  @Get()
  async list(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const rows = await this.itinerary.listItems(tripId);
    const payload = { items: rows.map(toItineraryItemResponse) };
    return ListItineraryItemsResponseSchema.parse(payload);
  }

  @Get(':itemId')
  async get(@Param() params: unknown) {
    const { itemId } = validate(ItineraryItemIdParamSchema, params);
    const item = await this.itinerary.getItem(itemId);
    return toItineraryItemResponse(item);
  }

  @Post()
  async create(@Param() params: unknown, @Body() body: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const input = validate(CreateItineraryItemRequestSchema, body);

    const item = await this.itinerary.createItem(tripId, {
      type: input.type,
      title: input.title,
      startDateTime: new Date(input.startDateTime),
      endDateTime: input.endDateTime ? new Date(input.endDateTime) : null,
      timezone: input.timezone,
      status: input.status,
      ...(input.locationId ? { location: { connect: { id: input.locationId } } } : {}),
      bookingRef: input.bookingRef ?? null,
      url: input.url ?? null,
      notes: input.notes ?? null,
      details: input.details ? (input.details as object) : undefined,
    });

    return toItineraryItemResponse(item);
  }

  @Patch(':itemId')
  async update(@Param() params: unknown, @Body() body: unknown) {
    const { itemId } = validate(ItineraryItemIdParamSchema, params);
    const input = validate(UpdateItineraryItemRequestSchema, body);

    const item = await this.itinerary.updateItem(itemId, {
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.startDateTime !== undefined
        ? { startDateTime: new Date(input.startDateTime) }
        : {}),
      ...(input.endDateTime !== undefined
        ? { endDateTime: input.endDateTime ? new Date(input.endDateTime) : null }
        : {}),
      ...(input.timezone !== undefined ? { timezone: input.timezone } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.locationId !== undefined
        ? input.locationId
          ? { location: { connect: { id: input.locationId } } }
          : { location: { disconnect: true } }
        : {}),
      ...(input.bookingRef !== undefined
        ? { bookingRef: input.bookingRef ?? null }
        : {}),
      ...(input.url !== undefined ? { url: input.url ?? null } : {}),
      ...(input.notes !== undefined ? { notes: input.notes ?? null } : {}),
      ...(input.details !== undefined ? { details: input.details as object } : {}),
    });

    return toItineraryItemResponse(item);
  }

  @Delete(':itemId')
  async delete(@Param() params: unknown) {
    const { itemId } = validate(ItineraryItemIdParamSchema, params);
    await this.itinerary.deleteItem(itemId);
    return { success: true };
  }
}
