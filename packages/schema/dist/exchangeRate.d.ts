import { z } from "zod";
export declare const ExchangeRateSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    fromCurrency: z.ZodString;
    toCurrency: z.ZodString;
    rate: z.ZodNumber;
    date: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tripId: string;
    id: string;
    date: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}, {
    tripId: string;
    id: string;
    date: string;
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
    tripId: string;
    date: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}, {
    tripId: string;
    date: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}>;
export type CreateExchangeRateInput = z.infer<typeof CreateExchangeRateInputSchema>;
