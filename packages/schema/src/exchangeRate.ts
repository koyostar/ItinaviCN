import { z } from "zod";
import { CurrencyCodeSchema } from "./trip";

export const ExchangeRateSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  fromCurrency: CurrencyCodeSchema,
  toCurrency: CurrencyCodeSchema,
  rate: z.number().positive(),
  date: z.string(), // ISO date when the rate was recorded
});

export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;

export const CreateExchangeRateInputSchema = ExchangeRateSchema.omit({
  id: true,
});
export type CreateExchangeRateInput = z.infer<
  typeof CreateExchangeRateInputSchema
>;
