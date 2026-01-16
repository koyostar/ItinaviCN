import { z } from "zod";
export declare const CurrencyCodeSchema: z.ZodString;
export declare const TripSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    destination: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    destinationCurrency: z.ZodDefault<z.ZodString>;
    originCurrency: z.ZodDefault<z.ZodString>;
    displayCurrencyMode: z.ZodDefault<z.ZodEnum<["DestinationOnly", "OriginOnly", "Both"]>>;
    defaultExchangeRate: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    destinationCurrency: string;
    originCurrency: string;
    displayCurrencyMode: "DestinationOnly" | "OriginOnly" | "Both";
    destination?: string | undefined;
    defaultExchangeRate?: number | undefined;
}, {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    destination?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    displayCurrencyMode?: "DestinationOnly" | "OriginOnly" | "Both" | undefined;
    defaultExchangeRate?: number | undefined;
}>;
export type Trip = z.infer<typeof TripSchema>;
export declare const CreateTripInputSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    title: z.ZodString;
    destination: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    destinationCurrency: z.ZodDefault<z.ZodString>;
    originCurrency: z.ZodDefault<z.ZodString>;
    displayCurrencyMode: z.ZodDefault<z.ZodEnum<["DestinationOnly", "OriginOnly", "Both"]>>;
    defaultExchangeRate: z.ZodOptional<z.ZodNumber>;
}, "id">, "strip", z.ZodTypeAny, {
    title: string;
    startDate: string;
    endDate: string;
    destinationCurrency: string;
    originCurrency: string;
    displayCurrencyMode: "DestinationOnly" | "OriginOnly" | "Both";
    destination?: string | undefined;
    defaultExchangeRate?: number | undefined;
}, {
    title: string;
    startDate: string;
    endDate: string;
    destination?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    displayCurrencyMode?: "DestinationOnly" | "OriginOnly" | "Both" | undefined;
    defaultExchangeRate?: number | undefined;
}>;
export type CreateTripInput = z.infer<typeof CreateTripInputSchema>;
