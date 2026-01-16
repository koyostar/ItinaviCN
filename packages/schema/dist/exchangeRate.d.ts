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
    tripId: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    date: string;
}, {
    id: string;
    tripId: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    date: string;
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
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    date: string;
}, {
    tripId: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    date: string;
}>;
export type CreateExchangeRateInput = z.infer<typeof CreateExchangeRateInputSchema>;
