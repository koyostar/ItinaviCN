import { z } from "zod";
export const LocationSchema = z.object({
    id: z.string().uuid(),
    tripId: z.string().uuid(),
    name: z.string().min(1),
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    notes: z.string().optional(),
});
export const CreateLocationInputSchema = LocationSchema.omit({ id: true });
