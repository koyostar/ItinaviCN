"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItineraryItemIdParamSchema = exports.ListItineraryItemsResponseSchema = exports.ItineraryItemResponseSchema = exports.FoodResponseSchema = exports.PlaceResponseSchema = exports.AccommodationResponseSchema = exports.TransportResponseSchema = exports.FlightResponseSchema = exports.UpdateItineraryItemRequestSchema = exports.CreateItineraryItemRequestSchema = exports.CreateFoodRequestSchema = exports.CreatePlaceRequestSchema = exports.CreateAccommodationRequestSchema = exports.CreateTransportRequestSchema = exports.CreateFlightRequestSchema = exports.FoodDetailsSchema = exports.PlaceDetailsSchema = exports.AccommodationDetailsSchema = exports.TransportDetailsSchema = exports.FlightDetailsSchema = exports.TransportModeSchema = exports.ItineraryStatusSchema = exports.ItineraryItemTypeSchema = void 0;
const zod_1 = require("zod");
// Enums
exports.ItineraryItemTypeSchema = zod_1.z.enum([
    "Flight",
    "Transport",
    "Accommodation",
    "Place",
    "Food",
]);
exports.ItineraryStatusSchema = zod_1.z.enum([
    "Planned",
    "Booked",
    "Done",
    "Skipped",
]);
exports.TransportModeSchema = zod_1.z.enum([
    "Metro",
    "Bus",
    "Taxi",
    "Didi",
    "Train",
    "Walk",
    "Other",
]);
// Type-specific details schemas
exports.FlightDetailsSchema = zod_1.z.object({
    airline: zod_1.z.string().optional(),
    flightNo: zod_1.z.string().optional(),
    departureAirport: zod_1.z.string().optional(),
    arrivalAirport: zod_1.z.string().optional(),
    departureAirportAddress: zod_1.z.string().optional(),
    arrivalAirportAddress: zod_1.z.string().optional(),
});
exports.TransportDetailsSchema = zod_1.z.object({
    mode: exports.TransportModeSchema,
    fromLocationId: zod_1.z.string().uuid().optional(),
    toLocationId: zod_1.z.string().uuid().optional(),
});
exports.AccommodationDetailsSchema = zod_1.z.object({
    hotelName: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    checkInDateTime: zod_1.z.string().datetime().optional(),
    checkOutDateTime: zod_1.z.string().datetime().optional(),
    guests: zod_1.z.number().int().positive().optional(),
});
exports.PlaceDetailsSchema = zod_1.z.object({
    address: zod_1.z.string().optional(),
    ticketInfo: zod_1.z.string().optional(),
    openingTime: zod_1.z.string().optional(),
    closingTime: zod_1.z.string().optional(),
});
exports.FoodDetailsSchema = zod_1.z.object({
    address: zod_1.z.string().optional(),
    cuisine: zod_1.z.string().optional(),
    openingTime: zod_1.z.string().optional(),
    closingTime: zod_1.z.string().optional(),
    reservationInfo: zod_1.z.string().optional(),
});
// Common base schema
const BaseItineraryItemSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    startDateTime: zod_1.z.string().datetime(),
    endDateTime: zod_1.z.string().datetime().optional(),
    timezone: zod_1.z.string().default("Asia/Shanghai"),
    startTimezone: zod_1.z.string().optional(),
    endTimezone: zod_1.z.string().optional(),
    status: exports.ItineraryStatusSchema.default("Planned"),
    locationId: zod_1.z.string().uuid().optional(),
    bookingRef: zod_1.z.string().max(100).optional(),
    url: zod_1.z.string().url().optional(),
    notes: zod_1.z.string().max(2000).optional(),
});
// Request schemas for creating items
exports.CreateFlightRequestSchema = BaseItineraryItemSchema.extend({
    type: zod_1.z.literal("Flight"),
    details: exports.FlightDetailsSchema.optional(),
});
exports.CreateTransportRequestSchema = BaseItineraryItemSchema.extend({
    type: zod_1.z.literal("Transport"),
    details: exports.TransportDetailsSchema.optional(),
});
exports.CreateAccommodationRequestSchema = BaseItineraryItemSchema.extend({
    type: zod_1.z.literal("Accommodation"),
    details: exports.AccommodationDetailsSchema.optional(),
});
exports.CreatePlaceRequestSchema = BaseItineraryItemSchema.extend({
    type: zod_1.z.literal("Place"),
    details: exports.PlaceDetailsSchema.optional(),
});
exports.CreateFoodRequestSchema = BaseItineraryItemSchema.extend({
    type: zod_1.z.literal("Food"),
    details: exports.FoodDetailsSchema.optional(),
});
exports.CreateItineraryItemRequestSchema = zod_1.z.discriminatedUnion("type", [
    exports.CreateFlightRequestSchema,
    exports.CreateTransportRequestSchema,
    exports.CreateAccommodationRequestSchema,
    exports.CreatePlaceRequestSchema,
    exports.CreateFoodRequestSchema,
]);
exports.UpdateItineraryItemRequestSchema = BaseItineraryItemSchema.partial()
    .extend({
    type: exports.ItineraryItemTypeSchema.optional(),
    details: zod_1.z.record(zod_1.z.unknown()).optional(),
})
    .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field is required",
});
// Response schemas
const BaseItineraryItemResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    tripId: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    startDateTime: zod_1.z.string().datetime(),
    endDateTime: zod_1.z.string().datetime().nullable(),
    timezone: zod_1.z.string(),
    startTimezone: zod_1.z.string().nullable(),
    endTimezone: zod_1.z.string().nullable(),
    status: exports.ItineraryStatusSchema,
    locationId: zod_1.z.string().uuid().nullable(),
    bookingRef: zod_1.z.string().nullable(),
    url: zod_1.z.string().nullable(),
    notes: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.FlightResponseSchema = BaseItineraryItemResponseSchema.extend({
    type: zod_1.z.literal("Flight"),
    details: exports.FlightDetailsSchema.nullable(),
});
exports.TransportResponseSchema = BaseItineraryItemResponseSchema.extend({
    type: zod_1.z.literal("Transport"),
    details: exports.TransportDetailsSchema.nullable(),
});
exports.AccommodationResponseSchema = BaseItineraryItemResponseSchema.extend({
    type: zod_1.z.literal("Accommodation"),
    details: exports.AccommodationDetailsSchema.nullable(),
});
exports.PlaceResponseSchema = BaseItineraryItemResponseSchema.extend({
    type: zod_1.z.literal("Place"),
    details: exports.PlaceDetailsSchema.nullable(),
});
exports.FoodResponseSchema = BaseItineraryItemResponseSchema.extend({
    type: zod_1.z.literal("Food"),
    details: exports.FoodDetailsSchema.nullable(),
});
exports.ItineraryItemResponseSchema = zod_1.z.discriminatedUnion("type", [
    exports.FlightResponseSchema,
    exports.TransportResponseSchema,
    exports.AccommodationResponseSchema,
    exports.PlaceResponseSchema,
    exports.FoodResponseSchema,
]);
exports.ListItineraryItemsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.ItineraryItemResponseSchema),
});
exports.ItineraryItemIdParamSchema = zod_1.z.object({
    itemId: zod_1.z.string().uuid(),
});
