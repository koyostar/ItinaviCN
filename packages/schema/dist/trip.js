"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTripsResponseSchema = exports.TripResponseSchema = exports.UpdateTripRequestSchema = exports.CreateTripRequestSchema = exports.TripIdParamSchema = exports.DestinationSchema = exports.CurrencyCodeSchema = void 0;
const zod_1 = require("zod");
exports.CurrencyCodeSchema = zod_1.z
    .string()
    .min(3)
    .max(3)
    .regex(/^[A-Z]{3}$/);
exports.DestinationSchema = zod_1.z.object({
    country: zod_1.z.string().min(1).max(100),
    cities: zod_1.z.array(zod_1.z.string().min(1).max(100)),
});
exports.TripIdParamSchema = zod_1.z.object({
    tripId: zod_1.z.string().uuid(),
});
exports.CreateTripRequestSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(120),
    destinations: zod_1.z.array(exports.DestinationSchema).min(1).optional(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    destinationCurrency: exports.CurrencyCodeSchema.default("CNY"),
    originCurrency: exports.CurrencyCodeSchema.default("SGD"),
    notes: zod_1.z.string().max(2000).optional(),
});
exports.UpdateTripRequestSchema = exports.CreateTripRequestSchema.partial().refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });
exports.TripResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    destinations: zod_1.z.array(exports.DestinationSchema).nullable(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    destinationCurrency: exports.CurrencyCodeSchema,
    originCurrency: exports.CurrencyCodeSchema,
    notes: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.ListTripsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.TripResponseSchema),
});
