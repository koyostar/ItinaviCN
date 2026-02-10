import { z } from "zod";
export declare const ExchangeRateSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    fromCurrency: z.ZodString;
    toCurrency: z.ZodString;
    rate: z.ZodNumber;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    date: string;
    tripId: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}, {
    id: string;
    date: string;
    tripId: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}>;
export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;
export declare const CreateExchangeRateInputSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    tripId: z.ZodString;
    fromCurrency: z.ZodString;
    toCurrency: z.ZodString;
    rate: z.ZodNumber;
    date: z.ZodString;
}, "id">, "strip", z.ZodTypeAny, {
    date: string;
    tripId: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}, {
    date: string;
    tripId: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}>;
export type CreateExchangeRateInput = z.infer<typeof CreateExchangeRateInputSchema>;
/**
 * Response from Frankfurter API (https://www.frankfurter.app/)
 * Used for fetching real-time exchange rates
 */
export interface ExchangeRateApiResponse {
    amount: number;
    base: string;
    date: string;
    rates: Record<string, number>;
}
