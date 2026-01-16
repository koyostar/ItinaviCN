import { z } from "zod";
export declare const LocationSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    name: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    tripId: string;
    name: string;
    notes?: string | undefined;
    address?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
}, {
    id: string;
    tripId: string;
    name: string;
    notes?: string | undefined;
    address?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
}>;
export type Location = z.infer<typeof LocationSchema>;
export declare const CreateLocationInputSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    tripId: z.ZodString;
    name: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "id">, "strip", z.ZodTypeAny, {
    tripId: string;
    name: string;
    notes?: string | undefined;
    address?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
}, {
    tripId: string;
    name: string;
    notes?: string | undefined;
    address?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
}>;
export type CreateLocationInput = z.infer<typeof CreateLocationInputSchema>;
