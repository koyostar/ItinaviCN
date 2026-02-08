import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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

/**
 * Transforms a Prisma location object into a validated API response.
 * Converts Prisma Decimal latitude/longitude to numbers and Date objects to ISO strings.
 *
 * @param location - The location object from Prisma database
 * @returns Validated LocationResponse object
 */
function toLocationResponse(location: {
  id: string;
  tripId: string;
  name: string;
  category: string;
  city: string | null;
  district: string | null;
  province: string | null;
  address: string | null;
  latitude: { toNumber(): number } | null;
  longitude: { toNumber(): number } | null;
  adcode: string | null;
  citycode: string | null;
  amapPoiId: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return LocationResponseSchema.parse({
    id: location.id,
    tripId: location.tripId,
    name: location.name,
    category: location.category,
    city: location.city,
    district: location.district,
    province: location.province,
    address: location.address,
    latitude: location.latitude === null ? null : location.latitude.toNumber(),
    longitude:
      location.longitude === null ? null : location.longitude.toNumber(),
    adcode: location.adcode,
    citycode: location.citycode,
    amapPoiId: location.amapPoiId,
    notes: location.notes,
    createdAt: location.createdAt.toISOString(),
    updatedAt: location.updatedAt.toISOString(),
  });
}

/**
 * REST controller for location management.
 * Handles HTTP requests for CRUD operations on locations associated with trips.
 * Supports categories like airports, attractions, restaurants, and accommodations
 * with optional geolocation data (latitude/longitude) and Amap integration.
 *
 * Base path: /api/trips/:tripId/locations
 */
@Controller('api/trips/:tripId/locations')
export class LocationsController {
  constructor(private readonly locations: LocationsService) {}

  /**
   * GET /api/trips/:tripId/locations
   * Retrieves all locations for a specific trip.
   *
   * @param params - Route parameters containing tripId
   * @returns List of locations with their details
   * @throws {BadRequestException} If tripId is invalid
   */
  @Get()
  async list(@Param() params: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const rows = await this.locations.listLocations(tripId);
    const payload = { items: rows.map(toLocationResponse) };
    return ListLocationsResponseSchema.parse(payload);
  }

  /**
   * GET /api/trips/:tripId/locations/:locationId
   * Retrieves a single location by ID.
   *
   * @param params - Route parameters containing locationId
   * @returns Location details
   * @throws {BadRequestException} If locationId is invalid
   * @throws {NotFoundException} If location does not exist
   */
  @Get(':locationId')
  async get(@Param() params: unknown) {
    const { locationId } = validate(LocationIdParamSchema, params);
    const location = await this.locations.getLocation(locationId);
    return toLocationResponse(location);
  }

  /**
   * POST /api/trips/:tripId/locations
   * Creates a new location for a trip.
   *
   * @param params - Route parameters containing tripId
   * @param body - Request body with location details (name, category, optional address/coordinates)
   * @returns Newly created location
   * @throws {BadRequestException} If tripId or request body is invalid
   * @throws {NotFoundException} If trip does not exist
   */
  @Post()
  async create(@Param() params: unknown, @Body() body: unknown) {
    const { tripId } = validate(TripIdParamSchema, params);
    const input = validate(CreateLocationRequestSchema, body);

    const location = await this.locations.createLocation(tripId, {
      name: input.name,
      category: input.category,
      city: input.city ?? null,
      district: input.district ?? null,
      province: input.province ?? null,
      address: input.address ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      adcode: input.adcode ?? null,
      citycode: input.citycode ?? null,
      amapPoiId: input.amapPoiId ?? null,
      notes: input.notes ?? null,
    });

    return toLocationResponse(location);
  }

  /**
   * PATCH /api/trips/:tripId/locations/:locationId
   * Updates an existing location with partial data.
   * Only provided fields will be updated.
   *
   * @param params - Route parameters containing locationId
   * @param body - Request body with partial location updates
   * @returns Updated location
   * @throws {BadRequestException} If locationId or request body is invalid
   * @throws {NotFoundException} If location does not exist
   */
  @Patch(':locationId')
  async update(@Param() params: unknown, @Body() body: unknown) {
    const { locationId } = validate(LocationIdParamSchema, params);
    const input = validate(UpdateLocationRequestSchema, body);

    const location = await this.locations.updateLocation(locationId, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.city !== undefined ? { city: input.city ?? null } : {}),
      ...(input.district !== undefined
        ? { district: input.district ?? null }
        : {}),
      ...(input.province !== undefined
        ? { province: input.province ?? null }
        : {}),
      ...(input.address !== undefined
        ? { address: input.address ?? null }
        : {}),
      ...(input.latitude !== undefined
        ? { latitude: input.latitude ?? null }
        : {}),
      ...(input.longitude !== undefined
        ? { longitude: input.longitude ?? null }
        : {}),
      ...(input.adcode !== undefined ? { adcode: input.adcode ?? null } : {}),
      ...(input.citycode !== undefined
        ? { citycode: input.citycode ?? null }
        : {}),
      ...(input.amapPoiId !== undefined
        ? { amapPoiId: input.amapPoiId ?? null }
        : {}),
      ...(input.notes !== undefined ? { notes: input.notes ?? null } : {}),
    });

    return toLocationResponse(location);
  }

  /**
   * DELETE /api/trips/:tripId/locations/:locationId
   * Deletes a location by ID.
   *
   * @param params - Route parameters containing locationId
   * @returns Success confirmation object
   * @throws {BadRequestException} If locationId is invalid
   * @throws {NotFoundException} If location does not exist
   */
  @Delete(':locationId')
  async delete(@Param() params: unknown) {
    const { locationId } = validate(LocationIdParamSchema, params);
    await this.locations.deleteLocation(locationId);
    return { success: true };
  }
}
