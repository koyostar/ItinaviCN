import { z } from "zod";

export const LocationCategorySchema = z.enum([
  "Place",
  "Restaurant",
  "Accommodation",
  "TransportNode",
  "Shop",
  "Other",
]);

export type LocationCategory = z.infer<typeof LocationCategorySchema>;

export const LocationIdParamSchema = z.object({
  locationId: z.string().uuid(),
});

export const CreateLocationRequestSchema = z.object({
  name: z.string().min(1).max(200),
  category: LocationCategorySchema,
  address: z.string().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  baiduPlaceId: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateLocationRequest = z.infer<typeof CreateLocationRequestSchema>;

export const UpdateLocationRequestSchema = CreateLocationRequestSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: "At least one field is required" },
);

export type UpdateLocationRequest = z.infer<typeof UpdateLocationRequestSchema>;

export const LocationResponseSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  name: z.string(),
  category: LocationCategorySchema,
  address: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  baiduPlaceId: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LocationResponse = z.infer<typeof LocationResponseSchema>;

export const ListLocationsResponseSchema = z.object({
  items: z.array(LocationResponseSchema),
});

export type ListLocationsResponse = z.infer<typeof ListLocationsResponseSchema>;
