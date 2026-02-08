"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLocationsResponseSchema = exports.LocationResponseSchema = exports.UpdateLocationRequestSchema = exports.CreateLocationRequestSchema = exports.LocationIdParamSchema = exports.LocationCategorySchema = void 0;
const zod_1 = require("zod");
exports.LocationCategorySchema = zod_1.z.enum([
    "Place",
    "Restaurant",
    "Accommodation",
    "Transport",
    "Shop",
    "Other",
]);
exports.LocationIdParamSchema = zod_1.z.object({
    locationId: zod_1.z.string().uuid(),
});
exports.CreateLocationRequestSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    category: exports.LocationCategorySchema,
    city: zod_1.z.string().max(100).optional(),
    district: zod_1.z.string().max(100).optional(),
    province: zod_1.z.string().max(100).optional(),
    address: zod_1.z.string().max(500).optional(),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    adcode: zod_1.z.string().max(20).optional(),
    citycode: zod_1.z.string().max(20).optional(),
    amapPoiId: zod_1.z.string().max(100).optional(),
    notes: zod_1.z.string().max(2000).optional(),
});
exports.UpdateLocationRequestSchema = exports.CreateLocationRequestSchema.partial().refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });
exports.LocationResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    tripId: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    category: exports.LocationCategorySchema,
    city: zod_1.z.string().nullable(),
    district: zod_1.z.string().nullable(),
    province: zod_1.z.string().nullable(),
    address: zod_1.z.string().nullable(),
    latitude: zod_1.z.number().nullable(),
    longitude: zod_1.z.number().nullable(),
    adcode: zod_1.z.string().nullable(),
    citycode: zod_1.z.string().nullable(),
    amapPoiId: zod_1.z.string().nullable(),
    notes: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
exports.ListLocationsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.LocationResponseSchema),
});
