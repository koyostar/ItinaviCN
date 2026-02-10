import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTripRequestSchema,
  ListTripsResponseSchema,
  TripIdParamSchema,
  TripResponseSchema,
  UpdateTripRequestSchema,
  AddTripMemberRequestSchema,
  UpdateTripMemberRequestSchema,
} from '@itinavi/schema';
import { validate } from '../../common/validate';
import { TripsService } from './trips.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly trips: TripsService) {}

  /**
   * GET /api/trips
   * Retrieves all trips for the authenticated user.
   *
   * @param user - The authenticated user
   * @returns List of trips user has access to
   */
  @Get()
  async list(@CurrentUser() user: any) {
    const rows = await this.trips.listTripsForUser(user.id);
    const payload = { items: rows.map(toTripResponse) };
    return ListTripsResponseSchema.parse(payload);
  }

  /**
   * GET /api/trips/:tripId
   * Retrieves a single trip by ID.
   *
   * @param params - Route parameters containing tripId
   * @param user - The authenticated user
   * @returns Trip details
   * @throws {NotFoundException} If trip is not found
   * @throws {ForbiddenException} If user doesn't have access
   */
  @Get(':tripId')
  async get(@Param() params: unknown, @CurrentUser() user: any) {
    const { tripId } = validate(TripIdParamSchema, params);
    await this.trips.requireTripAccess(tripId, user.id);
    const trip = await this.trips.getTrip(tripId);
    return toTripResponse(trip);
  }

  /**
   * POST /api/trips
   * Creates a new trip.
   *
   * @param body - Trip creation data
   * @param user - The authenticated user (becomes the owner)
   * @returns The newly created trip
   * @throws {BadRequestException} If request body is invalid
   */
  @Post()
  async create(@Body() body: unknown, @CurrentUser() user: any) {
    const input = validate(CreateTripRequestSchema, body);

    const trip = await this.trips.createTrip({
      title: input.title,
      destinations: input.destinations
        ? (input.destinations as object)
        : undefined,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      destinationCurrency: input.destinationCurrency,
      originCurrency: input.originCurrency,
      notes: input.notes ?? null,
      owner: {
        connect: { id: user.id },
      },
    });

    return toTripResponse(trip);
  }

  /**
   * PATCH /api/trips/:tripId
   * Updates an existing trip with partial data.
   *
   * @param params - Route parameters containing tripId
   * @param body - Trip update data (partial)
   * @param user - The authenticated user
   * @returns The updated trip
   * @throws {NotFoundException} If trip is not found
   * @throws {ForbiddenException} If user doesn't have edit access
   */
  @Patch(':tripId')
  async update(@Param() params: unknown, @Body() body: unknown, @CurrentUser() user: any) {
    const { tripId } = validate(TripIdParamSchema, params);
    await this.trips.requireTripEditAccess(tripId, user.id);
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
   * Deletes a trip by ID. Only the owner can delete.
   *
   * @param params - Route parameters containing tripId
   * @param user - The authenticated user
   * @returns Success confirmation
   * @throws {NotFoundException} If trip is not found
   * @throws {ForbiddenException} If user is not the owner
   */
  @Delete(':tripId')
  async delete(@Param() params: unknown, @CurrentUser() user: any) {
    const { tripId } = validate(TripIdParamSchema, params);
    await this.trips.requireTripOwnership(tripId, user.id);
    await this.trips.deleteTrip(tripId);
    return { success: true };
  }

  /**
   * GET /api/trips/:tripId/members
   * Lists all members of a trip.
   *
   * @param params - Route parameters containing tripId
   * @param user - The authenticated user
   * @returns List of trip members
   */
  @Get(':tripId/members')
  async listMembers(@Param() params: unknown, @CurrentUser() user: any) {
    const { tripId } = validate(TripIdParamSchema, params);
    await this.trips.requireTripAccess(tripId, user.id);
    return this.trips.listTripMembers(tripId);
  }

  /**
   * POST /api/trips/:tripId/members
   * Adds a member to a trip. Only the owner can add members.
   *
   * @param params - Route parameters containing tripId
   * @param body - Member details (userId, role)
   * @param user - The authenticated user
   * @returns The created trip member
   */
  @Post(':tripId/members')
  async addMember(
    @Param() params: unknown,
    @Body() body: unknown,
    @CurrentUser() user: any,
  ) {
    const { tripId } = validate(TripIdParamSchema, params);
    const input = validate(AddTripMemberRequestSchema, body);
    await this.trips.requireTripOwnership(tripId, user.id);
    return this.trips.addTripMember(tripId, input.userId, input.role);
  }

  /**
   * PATCH /api/trips/:tripId/members/:userId
   * Updates a member's role. Only the owner can update roles.
   *
   * @param params - Route parameters
   * @param body - Updated role
   * @param user - The authenticated user
   * @returns The updated trip member
   */
  @Patch(':tripId/members/:userId')
  async updateMemberRole(
    @Param('tripId') tripId: string,
    @Param('userId') userId: string,
    @Body() body: unknown,
    @CurrentUser() user: any,
  ) {
    const input = validate(UpdateTripMemberRequestSchema, body);
    await this.trips.requireTripOwnership(tripId, user.id);
    return this.trips.updateTripMemberRole(tripId, userId, input.role);
  }

  /**
   * DELETE /api/trips/:tripId/members/:userId
   * Removes a member from a trip. Only the owner can remove members.
   *
   * @param params - Route parameters
   * @param user - The authenticated user
   * @returns Success confirmation
   */
  @Delete(':tripId/members/:userId')
  async removeMember(
    @Param('tripId') tripId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    await this.trips.requireTripOwnership(tripId, user.id);
    await this.trips.removeTripMember(tripId, userId);
    return { success: true };
  }
}
