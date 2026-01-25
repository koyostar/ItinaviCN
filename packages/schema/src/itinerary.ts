import { z } from "zod";

// Enums
export const ItineraryItemTypeSchema = z.enum([
  "Flight",
  "Transport",
  "Accommodation",
  "PlaceVisit",
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
  departAirport: z.string().optional(),
  arriveAirport: z.string().optional(),
  terminal: z.string().optional(),
  seat: z.string().optional(),
});

export type FlightDetails = z.infer<typeof FlightDetailsSchema>;

export const TransportDetailsSchema = z.object({
  mode: TransportModeSchema,
  fromLocationId: z.string().uuid().optional(),
  toLocationId: z.string().uuid().optional(),
});

export type TransportDetails = z.infer<typeof TransportDetailsSchema>;

export const AccommodationDetailsSchema = z.object({
  checkInDateTime: z.string().datetime().optional(),
  checkOutDateTime: z.string().datetime().optional(),
  guests: z.number().int().positive().optional(),
});

export type AccommodationDetails = z.infer<typeof AccommodationDetailsSchema>;

export const PlaceVisitDetailsSchema = z.object({
  ticketInfo: z.string().optional(),
  openingHours: z.string().optional(),
});

export type PlaceVisitDetails = z.infer<typeof PlaceVisitDetailsSchema>;

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

export const CreatePlaceVisitRequestSchema = BaseItineraryItemSchema.extend({
  type: z.literal("PlaceVisit"),
  details: PlaceVisitDetailsSchema.optional(),
});

export const CreateFoodRequestSchema = BaseItineraryItemSchema.extend({
  type: z.literal("Food"),
  details: FoodDetailsSchema.optional(),
});

export const CreateItineraryItemRequestSchema = z.discriminatedUnion("type", [
  CreateFlightRequestSchema,
  CreateTransportRequestSchema,
  CreateAccommodationRequestSchema,
  CreatePlaceVisitRequestSchema,
  CreateFoodRequestSchema,
]);

export type CreateItineraryItemRequest = z.infer<typeof CreateItineraryItemRequestSchema>;

export const UpdateItineraryItemRequestSchema = BaseItineraryItemSchema.partial().extend({
  type: ItineraryItemTypeSchema.optional(),
  details: z.record(z.unknown()).optional(),
}).refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" },
);

export type UpdateItineraryItemRequest = z.infer<typeof UpdateItineraryItemRequestSchema>;

// Response schemas
const BaseItineraryItemResponseSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  title: z.string(),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime().nullable(),
  timezone: z.string(),
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

export const AccommodationResponseSchema = BaseItineraryItemResponseSchema.extend({
  type: z.literal("Accommodation"),
  details: AccommodationDetailsSchema.nullable(),
});

export const PlaceVisitResponseSchema = BaseItineraryItemResponseSchema.extend({
  type: z.literal("PlaceVisit"),
  details: PlaceVisitDetailsSchema.nullable(),
});

export const FoodResponseSchema = BaseItineraryItemResponseSchema.extend({
  type: z.literal("Food"),
  details: FoodDetailsSchema.nullable(),
});

export const ItineraryItemResponseSchema = z.discriminatedUnion("type", [
  FlightResponseSchema,
  TransportResponseSchema,
  AccommodationResponseSchema,
  PlaceVisitResponseSchema,
  FoodResponseSchema,
]);

export type ItineraryItemResponse = z.infer<typeof ItineraryItemResponseSchema>;

export const ListItineraryItemsResponseSchema = z.object({
  items: z.array(ItineraryItemResponseSchema),
});

export type ListItineraryItemsResponse = z.infer<typeof ListItineraryItemsResponseSchema>;

export const ItineraryItemIdParamSchema = z.object({
  itemId: z.string().uuid(),
});
