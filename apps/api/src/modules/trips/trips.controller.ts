import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  CreateTripRequestSchema,
  ListTripsResponseSchema,
  TripIdParamSchema,
  TripResponseSchema,
  UpdateTripRequestSchema,
} from '@itinavi/schema';
import { validate } from '../../common/validate';
import { TripsService } from './trips.service';

/**
 * Transforms a database trip record to API response format.
 * Converts Date objects to ISO strings and validates response schema.
 * 
 * @param trip - Raw trip data from database
 * @returns Validated trip response conforming to TripResponseSchema
 */
function toTripResponse(trip: {
  id: string;
  title: string;
  destinations: unknown;
  startDate: Date;
  endDate: Date;
  destinationCurrency: string;
  originCurrency: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return TripResponseSchema.parse({
    id: trip.id,
    title: trip.title,
    destinations: trip.destinations,

    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),

    destinationCurrency: trip.destinationCurrency,
    originCurrency: trip.originCurrency,

    notes: trip.notes,

    createdAt: trip.createdAt.toISOString(),
    updatedAt: trip.updatedAt.toISOString(),
  });
}

/**
 * REST controller for trip management endpoints.
 * Handles HTTP requests for CRUD operations on trips.
 * 
 * Base path: /api/trips
 */
@Controller('api/trips')
export class TripsController {
  constructor(private readonly trips: TripsService) {}

  /**
   * GET /api/trips
   * Retrieves all trips sorted by start date.
   * 
   * @returns List of trips with their details
   */
  @Get()
  async list() {
    const rows = await this.trips.listTrips();
    const payload = { items: rows.map(toTripResponse) };
    return ListTripsResponseSchema.parse(payload);
  }

  /**
   * GET /api/trips/:tripId
   * Retrieves a single trip by ID.
   * 
   * @param params - Route parameters containing tripId
   * @returns Trip details
   * @throws {NotFoundException} If trip is not found
   * @throws {BadRequestException} If tripId is invalid
   */
  @Get(':tripId')
  async get(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const trip = await this.trips.getTrip(tripId);
    return toTripResponse(trip);
  }

  /**
   * POST /api/trips
   * Creates a new trip.
   * 
   * @param body - Trip creation data
   * @returns The newly created trip
   * @throws {BadRequestException} If request body is invalid
   */
  @Post()
  async create(@Body() body: unknown) {
    const input = validate(CreateTripRequestSchema, body);

    const trip = await this.trips.createTrip({
      title: input.title,
      destinations: input.destinations ? (input.destinations as object) : undefined,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      destinationCurrency: input.destinationCurrency,
      originCurrency: input.originCurrency,
      notes: input.notes ?? null,
    });

    return toTripResponse(trip);
  }

  /**
   * PATCH /api/trips/:tripId
   * Updates an existing trip with partial data.
   * 
   * @param params - Route parameters containing tripId
   * @param body - Trip update data (partial)
   * @returns The updated trip
   * @throws {NotFoundException} If trip is not found
   * @throws {BadRequestException} If request is invalid
   */
  @Patch(':tripId')
  async update(@Param() params: unknown, @Body() body: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const input = validate(UpdateTripRequestSchema, body);

    const trip = await this.trips.updateTrip(tripId, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.destinations !== undefined
        ? { destinations: input.destinations as object }
        : {}),
      ...(input.startDate !== undefined
        ? { startDate: new Date(input.startDate) }
        : {}),
      ...(input.endDate !== undefined
        ? { endDate: new Date(input.endDate) }
        : {}),
      ...(input.destinationCurrency !== undefined
        ? { destinationCurrency: input.destinationCurrency }
        : {}),
      ...(input.originCurrency !== undefined
        ? { originCurrency: input.originCurrency }
        : {}),
      ...(input.notes !== undefined ? { notes: input.notes ?? null } : {}),
    });

    return toTripResponse(trip);
  }

  /**
   * DELETE /api/trips/:tripId
   * Deletes a trip by ID.
   * 
   * @param params - Route parameters containing tripId
   * @returns Success confirmation
   * @throws {NotFoundException} If trip is not found
   * @throws {BadRequestException} If tripId is invalid
   */
  @Delete(':tripId')
  async delete(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    await this.trips.deleteTrip(tripId);
    return { success: true };
  }
}
