import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { Prisma, TripRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Service responsible for managing trip-related business logic.
 * Handles CRUD operations for trips using Prisma ORM.
 */
@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all trips for a specific user (owned or member).
   *
   * @param {string} userId - The ID of the user
   * @returns {Promise} List of trips sorted chronologically
   */
  async listTripsForUser(userId: string) {
    return this.prisma.trip.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      orderBy: { startDate: 'asc' },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Retrieves all trips ordered by start date.
   *
   * @returns {Promise} List of all trips sorted chronologically
   */
  async listTrips() {
    return this.prisma.trip.findMany({
      orderBy: { startDate: 'asc' },
    });
  }

  /**
   * Retrieves a single trip by ID.
   *
   * @param {string} tripId - The unique identifier of the trip
   * @returns {Promise} The trip data
   * @throws {NotFoundException} If trip with given ID is not found
   */
  async getTrip(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  /**
   * Creates a new trip.
   * Automatically adds the creator as a trip member with OWNER role.
   *
   * @param {Prisma.TripCreateInput} input - Trip creation data
   * @returns {Promise} The newly created trip
   */
  async createTrip(input: Prisma.TripCreateInput) {
    return this.prisma.trip.create({
      data: {
        ...input,
        members: {
          create: {
            userId: (input.owner as any).connect.id,
            role: 'OWNER',
          },
        },
      },
    });
  }

  /**
   * Updates an existing trip.
   *
   * @param {string} tripId - The unique identifier of the trip to update
   * @param {Prisma.TripUpdateInput} input - Trip update data
   * @returns {Promise} The updated trip
   * @throws {NotFoundException} If trip with given ID is not found
   */
  async updateTrip(tripId: string, input: Prisma.TripUpdateInput) {
    await this.getTrip(tripId);
    return this.prisma.trip.update({
      where: { id: tripId },
      data: input,
    });
  }

  /**
   * Deletes a trip by ID.
   *
   * @param {string} tripId - The unique identifier of the trip to delete
   * @returns {Promise<void>}
   * @throws {NotFoundException} If trip with given ID is not found
   */
  async deleteTrip(tripId: string) {
    await this.getTrip(tripId);
    await this.prisma.trip.delete({ where: { id: tripId } });
  }

  /**
   * Checks if a user has access to a trip and their role.
   *
   * @param {string} tripId - The trip ID
   * @param {string} userId - The user ID
   * @returns {Promise<{ hasAccess: boolean; role: TripRole | null; isOwner: boolean }>}
   */
  async getUserTripAccess(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!trip) {
      return { hasAccess: false, role: null, isOwner: false };
    }

    const isOwner = trip.ownerId === userId;
    const member = trip.members[0];

    return {
      hasAccess: isOwner || !!member,
      role: isOwner ? 'OWNER' as TripRole : (member?.role || null),
      isOwner,
    };
  }

  /**
   * Requires that a user has at least viewer access to a trip.
   *
   * @param {string} tripId - The trip ID
   * @param {string} userId - The user ID
   * @throws {ForbiddenException} If user doesn't have access
   */
  async requireTripAccess(tripId: string, userId: string) {
    const access = await this.getUserTripAccess(tripId, userId);
    if (!access.hasAccess) {
      throw new ForbiddenException('You do not have access to this trip');
    }
    return access;
  }

  /**
   * Requires that a user has editor or owner access to a trip.
   *
   * @param {string} tripId - The trip ID
   * @param {string} userId - The user ID
   * @throws {ForbiddenException} If user doesn't have edit access
   */
  async requireTripEditAccess(tripId: string, userId: string) {
    const access = await this.requireTripAccess(tripId, userId);
    if (access.role === 'VIEWER') {
      throw new ForbiddenException('You do not have permission to edit this trip');
    }
    return access;
  }

  /**
   * Requires that a user is the owner of a trip.
   *
   * @param {string} tripId - The trip ID
   * @param {string} userId - The user ID
   * @throws {ForbiddenException} If user is not the owner
   */
  async requireTripOwnership(tripId: string, userId: string) {
    const access = await this.requireTripAccess(tripId, userId);
    if (!access.isOwner) {
      throw new ForbiddenException('Only the trip owner can perform this action');
    }
    return access;
  }

  /**
   * Adds a member to a trip.
   *
   * @param {string} tripId - The trip ID
   * @param {string} userId - The user ID to add
   * @param {TripRole} role - The role to assign
   * @returns {Promise} The created trip member
   */
  async addTripMember(tripId: string, userId: string, role: TripRole) {
    await this.getTrip(tripId);

    return this.prisma.tripMember.create({
      data: {
        tripId,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });
  }

  /**
   * Updates a trip member's role.
   *
   * @param {string} tripId - The trip ID
   * @param {string} userId - The user ID
   * @param {TripRole} role - The new role
   * @returns {Promise} The updated trip member
   */
  async updateTripMemberRole(tripId: string, userId: string, role: TripRole) {
    const member = await this.prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Trip member not found');
    }

    return this.prisma.tripMember.update({
      where: {
        tripId_userId: {
          tripId,
          userId,
        },
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });
  }

  /**
   * Removes a member from a trip.
   *
   * @param {string} tripId - The trip ID
   * @param {string} userId - The user ID to remove
   * @returns {Promise<void>}
   */
  async removeTripMember(tripId: string, userId: string) {
    const member = await this.prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Trip member not found');
    }

    await this.prisma.tripMember.delete({
      where: {
        tripId_userId: {
          tripId,
          userId,
        },
      },
    });
  }

  /**
   * Lists all members of a trip.
   *
   * @param {string} tripId - The trip ID
   * @returns {Promise} List of trip members
   */
  async listTripMembers(tripId: string) {
    await this.getTrip(tripId);

    return this.prisma.tripMember.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }
}
