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

@Controller('api/trips')
export class TripsController {
  constructor(private readonly trips: TripsService) {}

  @Get()
  async list() {
    const rows = await this.trips.listTrips();
    const payload = { items: rows.map(toTripResponse) };
    return ListTripsResponseSchema.parse(payload);
  }

  @Get(':tripId')
  async get(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const trip = await this.trips.getTrip(tripId);
    return toTripResponse(trip);
  }

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

  @Delete(':tripId')
  async delete(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    await this.trips.deleteTrip(tripId);
    return { success: true };
  }
}
