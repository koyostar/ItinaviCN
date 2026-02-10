import { z } from "zod";

export const CurrencyCodeSchema = z
  .string()
  .min(3)
  .max(3)
  .regex(/^[A-Z]{3}$/);

export const DestinationSchema = z.object({
  country: z.string().min(1).max(100),
  cities: z.array(z.string().min(1).max(100)),
});

export type Destination = z.infer<typeof DestinationSchema>;

export const TripIdParamSchema = z.object({
  tripId: z.string().uuid(),
});

export const CreateTripRequestSchema = z.object({
  title: z.string().min(1).max(120),
  destinations: z.array(DestinationSchema).min(1).optional(),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  destinationCurrency: CurrencyCodeSchema.default("CNY"),
  originCurrency: CurrencyCodeSchema.default("SGD"),

  notes: z.string().max(2000).optional(),
});

export type CreateTripRequest = z.infer<typeof CreateTripRequestSchema>;

export const UpdateTripRequestSchema = CreateTripRequestSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" },
);

export type UpdateTripRequest = z.infer<typeof UpdateTripRequestSchema>;

export const TripResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  destinations: z.array(DestinationSchema).nullable(),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  destinationCurrency: CurrencyCodeSchema,
  originCurrency: CurrencyCodeSchema,

  notes: z.string().nullable(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TripResponse = z.infer<typeof TripResponseSchema>;

export const ListTripsResponseSchema = z.object({
  items: z.array(TripResponseSchema),
});

export type ListTripsResponse = z.infer<typeof ListTripsResponseSchema>;

// ========================================
// Trip Member / Collaboration
// ========================================

export const TripRoleSchema = z.enum(["OWNER", "EDITOR", "VIEWER"]);

export type TripRole = z.infer<typeof TripRoleSchema>;

export const AddTripMemberRequestSchema = z.object({
  userId: z.string().uuid(),
  role: TripRoleSchema,
});

export type AddTripMemberRequest = z.infer<typeof AddTripMemberRequestSchema>;

export const UpdateTripMemberRequestSchema = z.object({
  role: TripRoleSchema,
});

export type UpdateTripMemberRequest = z.infer<typeof UpdateTripMemberRequestSchema>;

export const RemoveTripMemberRequestSchema = z.object({
  userId: z.string().uuid(),
});

export type RemoveTripMemberRequest = z.infer<typeof RemoveTripMemberRequestSchema>;
