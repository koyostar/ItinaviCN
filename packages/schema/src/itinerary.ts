import { z } from "zod";

export const ItineraryItemSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  date: z.string(), // ISO date
  time: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z
    .enum(["Activity", "Transport", "Accommodation", "Food", "Other"])
    .default("Other"),
  order: z.number().int().nonnegative().default(0),
});

export type ItineraryItem = z.infer<typeof ItineraryItemSchema>;

export const CreateItineraryItemInputSchema = ItineraryItemSchema.omit({
  id: true,
});
export type CreateItineraryItemInput = z.infer<
  typeof CreateItineraryItemInputSchema
>;
