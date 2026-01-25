import { z } from "zod";
export declare const DisplayCurrencyModeSchema: z.ZodEnum<["DestinationOnly", "OriginOnly", "Both"]>;
export type DisplayCurrencyMode = z.infer<typeof DisplayCurrencyModeSchema>;
export declare const CurrencyCodeSchema: z.ZodString;
export declare const TripIdParamSchema: z.ZodObject<{
    tripId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tripId: string;
}, {
    tripId: string;
}>;
export declare const CreateTripRequestSchema: z.ZodObject<{
    title: z.ZodString;
    destination: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    destinationCurrency: z.ZodDefault<z.ZodString>;
    originCurrency: z.ZodDefault<z.ZodString>;
    displayCurrencyMode: z.ZodDefault<z.ZodEnum<["DestinationOnly", "OriginOnly", "Both"]>>;
    defaultExchangeRate: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    startDate: string;
    endDate: string;
    destinationCurrency: string;
    originCurrency: string;
    displayCurrencyMode: "DestinationOnly" | "OriginOnly" | "Both";
    destination?: string | undefined;
    defaultExchangeRate?: number | undefined;
    notes?: string | undefined;
}, {
    title: string;
    startDate: string;
    endDate: string;
    destination?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    displayCurrencyMode?: "DestinationOnly" | "OriginOnly" | "Both" | undefined;
    defaultExchangeRate?: number | undefined;
    notes?: string | undefined;
}>;
export type CreateTripRequest = z.infer<typeof CreateTripRequestSchema>;
export declare const UpdateTripRequestSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    destination: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    destinationCurrency: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    originCurrency: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    displayCurrencyMode: z.ZodOptional<z.ZodDefault<z.ZodEnum<["DestinationOnly", "OriginOnly", "Both"]>>>;
    defaultExchangeRate: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    destination?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    displayCurrencyMode?: "DestinationOnly" | "OriginOnly" | "Both" | undefined;
    defaultExchangeRate?: number | undefined;
    notes?: string | undefined;
}, {
    title?: string | undefined;
    destination?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    displayCurrencyMode?: "DestinationOnly" | "OriginOnly" | "Both" | undefined;
    defaultExchangeRate?: number | undefined;
    notes?: string | undefined;
}>, {
    title?: string | undefined;
    destination?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    displayCurrencyMode?: "DestinationOnly" | "OriginOnly" | "Both" | undefined;
    defaultExchangeRate?: number | undefined;
    notes?: string | undefined;
}, {
    title?: string | undefined;
    destination?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    displayCurrencyMode?: "DestinationOnly" | "OriginOnly" | "Both" | undefined;
    defaultExchangeRate?: number | undefined;
    notes?: string | undefined;
}>;
export type UpdateTripRequest = z.infer<typeof UpdateTripRequestSchema>;
export declare const TripResponseSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    destination: z.ZodNullable<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    destinationCurrency: z.ZodString;
    originCurrency: z.ZodString;
    displayCurrencyMode: z.ZodEnum<["DestinationOnly", "OriginOnly", "Both"]>;
    defaultExchangeRate: z.ZodNullable<z.ZodNumber>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    destination: string | null;
    startDate: string;
    endDate: string;
    destinationCurrency: string;
    originCurrency: string;
    displayCurrencyMode: "DestinationOnly" | "OriginOnly" | "Both";
    defaultExchangeRate: number | null;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
}, {
    title: string;
    destination: string | null;
    startDate: string;
    endDate: string;
    destinationCurrency: string;
    originCurrency: string;
    displayCurrencyMode: "DestinationOnly" | "OriginOnly" | "Both";
    defaultExchangeRate: number | null;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
}>;
export type TripResponse = z.infer<typeof TripResponseSchema>;
export declare const ListTripsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        destination: z.ZodNullable<z.ZodString>;
        startDate: z.ZodString;
        endDate: z.ZodString;
        destinationCurrency: z.ZodString;
        originCurrency: z.ZodString;
        displayCurrencyMode: z.ZodEnum<["DestinationOnly", "OriginOnly", "Both"]>;
        defaultExchangeRate: z.ZodNullable<z.ZodNumber>;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        destination: string | null;
        startDate: string;
        endDate: string;
        destinationCurrency: string;
        originCurrency: string;
        displayCurrencyMode: "DestinationOnly" | "OriginOnly" | "Both";
        defaultExchangeRate: number | null;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
    }, {
        title: string;
        destination: string | null;
        startDate: string;
        endDate: string;
        destinationCurrency: string;
        originCurrency: string;
        displayCurrencyMode: "DestinationOnly" | "OriginOnly" | "Both";
        defaultExchangeRate: number | null;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        title: string;
        destination: string | null;
        startDate: string;
        endDate: string;
        destinationCurrency: string;
        originCurrency: string;
        displayCurrencyMode: "DestinationOnly" | "OriginOnly" | "Both";
        defaultExchangeRate: number | null;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
    }[];
}, {
    items: {
        title: string;
        destination: string | null;
        startDate: string;
        endDate: string;
        destinationCurrency: string;
        originCurrency: string;
        displayCurrencyMode: "DestinationOnly" | "OriginOnly" | "Both";
        defaultExchangeRate: number | null;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
    }[];
}>;
export type ListTripsResponse = z.infer<typeof ListTripsResponseSchema>;
