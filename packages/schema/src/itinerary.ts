import { z } from "zod";

// Enums
export const ItineraryItemTypeSchema = z.enum([
  "Flight",
  "Transport",
  "Accommodation",
  "Place",
  "Food",
]);

export type ItineraryItemType = z.infer<typeof ItineraryItemTypeSchema>;

export const ItineraryStatusSchema = z.enum([
  "Planned",
  "Booked",
  "Done",
  "Skipped",
]);

export type ItineraryStatus = z.infer<typeof ItineraryStatusSchema>;

export const TransportModeSchema = z.enum([
  "Metro",
  "Bus",
  "Taxi",
  "Didi",
  "Train",
  "Walk",
  "Other",
]);

export type TransportMode = z.infer<typeof TransportModeSchema>;

// Type-specific details schemas
export const FlightDetailsSchema = z.object({
  airline: z.string().optional(),
  flightNo: z.string().optional(),
  departureAirport: z.string().optional(),
  arrivalAirport: z.string().optional(),
  departureAirportAddress: z.string().optional(),
  arrivalAirportAddress: z.string().optional(),
});

export type FlightDetails = z.infer<typeof FlightDetailsSchema>;

export const TransportDetailsSchema = z.object({
  mode: TransportModeSchema,
  fromLocationId: z.string().uuid().optional(),
  toLocationId: z.string().uuid().optional(),
});

export type TransportDetails = z.infer<typeof TransportDetailsSchema>;

export const AccommodationDetailsSchema = z.object({
  hotelName: z.string().optional(),
  address: z.string().optional(),
  checkInDateTime: z.string().datetime().optional(),
  checkOutDateTime: z.string().datetime().optional(),
  guests: z.number().int().positive().optional(),
});

export type AccommodationDetails = z.infer<typeof AccommodationDetailsSchema>;

export const PlaceDetailsSchema = z.object({
  ticketInfo: z.string().optional(),
  openingHours: z.string().optional(),
});

export type PlaceDetails = z.infer<typeof PlaceDetailsSchema>;

export const FoodDetailsSchema = z.object({
  cuisine: z.string().optional(),
  reservationInfo: z.string().optional(),
});

export type FoodDetails = z.infer<typeof FoodDetailsSchema>;

// Common base schema
const BaseItineraryItemSchema = z.object({
  title: z.string().min(1).max(200),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime().optional(),
  timezone: z.string().default("Asia/Shanghai"),
  startTimezone: z.string().optional(),
  endTimezone: z.string().optional(),
  status: ItineraryStatusSchema.default("Planned"),
  locationId: z.string().uuid().optional(),
  bookingRef: z.string().max(100).optional(),
  url: z.string().url().optional(),
  notes: z.string().max(2000).optional(),
});

// Request schemas for creating items
export const CreateFlightRequestSchema = BaseItineraryItemSchema.extend({
  type: z.literal("Flight"),
  details: FlightDetailsSchema.optional(),
});

export const CreateTransportRequestSchema = BaseItineraryItemSchema.extend({
  type: z.literal("Transport"),
  details: TransportDetailsSchema.optional(),
});

export const CreateAccommodationRequestSchema = BaseItineraryItemSchema.extend({
  type: z.literal("Accommodation"),
  details: AccommodationDetailsSchema.optional(),
});

export const CreatePlaceRequestSchema = BaseItineraryItemSchema.extend({
  type: z.literal("Place"),
  details: PlaceDetailsSchema.optional(),
});

export const CreateFoodRequestSchema = BaseItineraryItemSchema.extend({
  type: z.literal("Food"),
  details: FoodDetailsSchema.optional(),
});

export const CreateItineraryItemRequestSchema = z.discriminatedUnion("type", [
  CreateFlightRequestSchema,
  CreateTransportRequestSchema,
  CreateAccommodationRequestSchema,
  CreatePlaceRequestSchema,
  CreateFoodRequestSchema,
]);

export type CreateItineraryItemRequest = z.infer<
  typeof CreateItineraryItemRequestSchema
>;

export const UpdateItineraryItemRequestSchema =
  BaseItineraryItemSchema.partial()
    .extend({
      type: ItineraryItemTypeSchema.optional(),
      details: z.record(z.unknown()).optional(),
    })
    .refine((v) => Object.keys(v).length > 0, {
      message: "At least one field is required",
    });

export type UpdateItineraryItemRequest = z.infer<
  typeof UpdateItineraryItemRequestSchema
>;

// Response schemas
const BaseItineraryItemResponseSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  title: z.string(),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime().nullable(),
  timezone: z.string(),
  startTimezone: z.string().nullable(),
  endTimezone: z.string().nullable(),
  status: ItineraryStatusSchema,
  locationId: z.string().uuid().nullable(),
  bookingRef: z.string().nullable(),
  url: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const FlightResponseSchema = BaseItineraryItemResponseSchema.extend({
  type: z.literal("Flight"),
  details: FlightDetailsSchema.nullable(),
});

export const TransportResponseSchema = BaseItineraryItemResponseSchema.extend({
  type: z.literal("Transport"),
  details: TransportDetailsSchema.nullable(),
});

export const AccommodationResponseSchema =
  BaseItineraryItemResponseSchema.extend({
    type: z.literal("Accommodation"),
    details: AccommodationDetailsSchema.nullable(),
  });

export const PlaceResponseSchema = BaseItineraryItemResponseSchema.extend({
  type: z.literal("Place"),
  details: PlaceDetailsSchema.nullable(),
});

export const FoodResponseSchema = BaseItineraryItemResponseSchema.extend({
  type: z.literal("Food"),
  details: FoodDetailsSchema.nullable(),
});

export const ItineraryItemResponseSchema = z.discriminatedUnion("type", [
  FlightResponseSchema,
  TransportResponseSchema,
  AccommodationResponseSchema,
  PlaceResponseSchema,
  FoodResponseSchema,
]);

export type ItineraryItemResponse = z.infer<typeof ItineraryItemResponseSchema>;

export const ListItineraryItemsResponseSchema = z.object({
  items: z.array(ItineraryItemResponseSchema),
});

export type ListItineraryItemsResponse = z.infer<
  typeof ListItineraryItemsResponseSchema
>;

export const ItineraryItemIdParamSchema = z.object({
  itemId: z.string().uuid(),
});
