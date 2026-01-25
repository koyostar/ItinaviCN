"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateItineraryItemInputSchema = exports.ItineraryItemSchema = void 0;
const zod_1 = require("zod");
exports.ItineraryItemSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    tripId: zod_1.z.string().uuid(),
    date: zod_1.z.string(), // ISO date
    time: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    category: zod_1.z
        .enum(["Activity", "Transport", "Accommodation", "Food", "Other"])
        .default("Other"),
    order: zod_1.z.number().int().nonnegative().default(0),
});
exports.CreateItineraryItemInputSchema = exports.ItineraryItemSchema.omit({
    id: true,
});
