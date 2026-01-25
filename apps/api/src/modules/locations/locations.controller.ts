import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  CreateLocationRequestSchema,
  ListLocationsResponseSchema,
  LocationIdParamSchema,
  LocationResponseSchema,
  TripIdParamSchema,
  UpdateLocationRequestSchema,
} from '@itinavi/schema';
import { validate } from '../../common/validate';
import { LocationsService } from './locations.service';

function toLocationResponse(location: {
  id: string;
  tripId: string;
  name: string;
  category: string;
  address: string | null;
  latitude: { toNumber(): number } | null;
  longitude: { toNumber(): number } | null;
  baiduPlaceId: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return LocationResponseSchema.parse({
    id: location.id,
    tripId: location.tripId,
    name: location.name,
    category: location.category,
    address: location.address,
    latitude: location.latitude === null ? null : location.latitude.toNumber(),
    longitude: location.longitude === null ? null : location.longitude.toNumber(),
    baiduPlaceId: location.baiduPlaceId,
    notes: location.notes,
    createdAt: location.createdAt.toISOString(),
    updatedAt: location.updatedAt.toISOString(),
  });
}

@Controller('api/trips/:tripId/locations')
export class LocationsController {
  constructor(private readonly locations: LocationsService) {}

  @Get()
  async list(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const rows = await this.locations.listLocations(tripId);
    const payload = { items: rows.map(toLocationResponse) };
    return ListLocationsResponseSchema.parse(payload);
  }

  @Get(':locationId')
  async get(@Param() params: unknown) {
    const { locationId } = validate(LocationIdParamSchema, params);
    const location = await this.locations.getLocation(locationId);
    return toLocationResponse(location);
  }

  @Post()
  async create(@Param() params: unknown, @Body() body: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const input = validate(CreateLocationRequestSchema, body);

    const location = await this.locations.createLocation(tripId, {
      name: input.name,
      category: input.category,
      address: input.address ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      baiduPlaceId: input.baiduPlaceId ?? null,
      notes: input.notes ?? null,
    });

    return toLocationResponse(location);
  }

  @Patch(':locationId')
  async update(@Param() params: unknown, @Body() body: unknown) {
    const { locationId } = validate(LocationIdParamSchema, params);
    const input = validate(UpdateLocationRequestSchema, body);

    const location = await this.locations.updateLocation(locationId, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.address !== undefined ? { address: input.address ?? null } : {}),
      ...(input.latitude !== undefined ? { latitude: input.latitude ?? null } : {}),
      ...(input.longitude !== undefined ? { longitude: input.longitude ?? null } : {}),
      ...(input.baiduPlaceId !== undefined ? { baiduPlaceId: input.baiduPlaceId ?? null } : {}),
      ...(input.notes !== undefined ? { notes: input.notes ?? null } : {}),
    });

    return toLocationResponse(location);
  }

  @Delete(':locationId')
  async delete(@Param() params: unknown) {
    const { locationId } = validate(LocationIdParamSchema, params);
    await this.locations.deleteLocation(locationId);
    return { success: true };
  }
}
