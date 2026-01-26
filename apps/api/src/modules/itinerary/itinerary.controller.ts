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

/**
 * Transforms a database itinerary item record to API response format.
 * Converts Date objects to ISO strings and validates response schema.
 * 
 * @param item - Raw itinerary item data from database
 * @returns Validated itinerary item response conforming to schema
 */
function toItineraryItemResponse(item: {
  id: string;
  tripId: string;
  type: string;
  title: string;
  startDateTime: Date;
  endDateTime: Date | null;
  timezone: string;
  startTimezone: string | null;
  endTimezone: string | null;
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
    startTimezone: item.startTimezone,
    endTimezone: item.endTimezone,
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

/**
 * REST controller for itinerary item management.
 * Handles HTTP requests for CRUD operations on itinerary items
 * (flights, accommodations, transport, place visits, food).
 * 
 * Base path: /api/trips/:tripId/itinerary
 */
@Controller('api/trips/:tripId/itinerary')
export class ItineraryController {
  constructor(private readonly itinerary: ItineraryService) {}

  /**
   * GET /api/trips/:tripId/itinerary
   * Retrieves all itinerary items for a trip, sorted chronologically.
   * 
   * @param params - Route parameters containing tripId
   * @returns List of itinerary items for the trip
   * @throws {BadRequestException} If tripId is invalid
   */
  @Get()
  async list(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const rows = await this.itinerary.listItems(tripId);
    const payload = { items: rows.map(toItineraryItemResponse) };
    return ListItineraryItemsResponseSchema.parse(payload);
  }

  /**
   * GET /api/trips/:tripId/itinerary/:itemId
   * Retrieves a single itinerary item by ID.
   * 
   * @param params - Route parameters containing itemId
   * @returns Itinerary item details
   * @throws {NotFoundException} If item is not found
   * @throws {BadRequestException} If itemId is invalid
   */
  @Get(':itemId')
  async get(@Param() params: unknown) {
    const { itemId } = validate(ItineraryItemIdParamSchema, params);
    const item = await this.itinerary.getItem(itemId);
    return toItineraryItemResponse(item);
  }

  /**
   * POST /api/trips/:tripId/itinerary
   * Creates a new itinerary item for a trip.
   * 
   * @param params - Route parameters containing tripId
   * @param body - Itinerary item creation data
   * @returns The newly created itinerary item
   * @throws {BadRequestException} If request is invalid
   */
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
      startTimezone: input.startTimezone ?? null,
      endTimezone: input.endTimezone ?? null,
      status: input.status,
      ...(input.locationId ? { location: { connect: { id: input.locationId } } } : {}),
      bookingRef: input.bookingRef ?? null,
      url: input.url ?? null,
      notes: input.notes ?? null,
      details: input.details ? (input.details as object) : undefined,
    });

    return toItineraryItemResponse(item);
  }

  /**
   * PATCH /api/trips/:tripId/itinerary/:itemId
   * Updates an existing itinerary item with partial data.
   * 
   * @param params - Route parameters containing itemId
   * @param body - Itinerary item update data (partial)
   * @returns The updated itinerary item
   * @throws {NotFoundException} If item is not found
   * @throws {BadRequestException} If request is invalid
   */
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
      ...(input.startTimezone !== undefined ? { startTimezone: input.startTimezone ?? null } : {}),
      ...(input.endTimezone !== undefined ? { endTimezone: input.endTimezone ?? null } : {}),
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

  /**
   * DELETE /api/trips/:tripId/itinerary/:itemId
   * Deletes an itinerary item by ID.
   * 
   * @param params - Route parameters containing itemId
   * @returns Success confirmation
   * @throws {NotFoundException} If item is not found
   * @throws {BadRequestException} If itemId is invalid
   */
  @Delete(':itemId')
  async delete(@Param() params: unknown) {
    const { itemId } = validate(ItineraryItemIdParamSchema, params);
    await this.itinerary.deleteItem(itemId);
    return { success: true };
  }
}
