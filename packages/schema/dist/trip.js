import { z } from "zod";
export const DisplayCurrencyModeSchema = z.enum([
    "DestinationOnly",
    "OriginOnly",
    "Both",
]);
export const CurrencyCodeSchema = z
    .string()
    .min(3)
    .max(3)
    .regex(/^[A-Z]{3}$/);
export const TripIdParamSchema = z.object({
    tripId: z.string().uuid(),
});
export const CreateTripRequestSchema = z.object({
    title: z.string().min(1).max(120),
    destination: z.string().max(120).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    destinationCurrency: CurrencyCodeSchema.default("CNY"),
    originCurrency: CurrencyCodeSchema.default("SGD"),
    displayCurrencyMode: DisplayCurrencyModeSchema.default("Both"),
    defaultExchangeRate: z.number().positive().optional(),
    notes: z.string().max(2000).optional(),
});
export const UpdateTripRequestSchema = CreateTripRequestSchema.partial().refine((v) => Object.keys(v).length > 0, { message: "At least one field is required" });
export const TripResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    destination: z.string().nullable(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    destinationCurrency: CurrencyCodeSchema,
    originCurrency: CurrencyCodeSchema,
    displayCurrencyMode: DisplayCurrencyModeSchema,
    defaultExchangeRate: z.number().nullable(),
    notes: z.string().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
export const ListTripsResponseSchema = z.object({
    items: z.array(TripResponseSchema),
});
