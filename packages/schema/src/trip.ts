import { z } from "zod";

export const CurrencyCodeSchema = z.string().min(3).max(3); // simple MVP

export const TripSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  destination: z.string().optional(),
  startDate: z.string(), // ISO date in MVP
  endDate: z.string(),
  destinationCurrency: CurrencyCodeSchema.default("CNY"),
  originCurrency: CurrencyCodeSchema.default("SGD"),
  displayCurrencyMode: z
    .enum(["DestinationOnly", "OriginOnly", "Both"])
    .default("Both"),
  defaultExchangeRate: z.number().positive().optional(),
});

export type Trip = z.infer<typeof TripSchema>;

export const CreateTripInputSchema = TripSchema.omit({ id: true });
export type CreateTripInput = z.infer<typeof CreateTripInputSchema>;
