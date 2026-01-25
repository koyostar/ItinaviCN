import { z } from "zod";
export declare const ItineraryItemSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    date: z.ZodString;
    time: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    category: z.ZodDefault<z.ZodEnum<["Activity", "Transport", "Accommodation", "Food", "Other"]>>;
    order: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    tripId: string;
    title: string;
    id: string;
    date: string;
    category: "Food" | "Transport" | "Accommodation" | "Other" | "Activity";
    order: number;
    description?: string | undefined;
    time?: string | undefined;
    location?: string | undefined;
}, {
    tripId: string;
    title: string;
    id: string;
    date: string;
    category?: "Food" | "Transport" | "Accommodation" | "Other" | "Activity" | undefined;
    description?: string | undefined;
    time?: string | undefined;
    location?: string | undefined;
    order?: number | undefined;
}>;
export type ItineraryItem = z.infer<typeof ItineraryItemSchema>;
export declare const CreateItineraryItemInputSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    tripId: z.ZodString;
    date: z.ZodString;
    time: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    category: z.ZodDefault<z.ZodEnum<["Activity", "Transport", "Accommodation", "Food", "Other"]>>;
    order: z.ZodDefault<z.ZodNumber>;
}, "id">, "strip", z.ZodTypeAny, {
    tripId: string;
    title: string;
    date: string;
    category: "Food" | "Transport" | "Accommodation" | "Other" | "Activity";
    order: number;
    description?: string | undefined;
    time?: string | undefined;
    location?: string | undefined;
}, {
    tripId: string;
    title: string;
    date: string;
    category?: "Food" | "Transport" | "Accommodation" | "Other" | "Activity" | undefined;
    description?: string | undefined;
    time?: string | undefined;
    location?: string | undefined;
    order?: number | undefined;
}>;
export type CreateItineraryItemInput = z.infer<typeof CreateItineraryItemInputSchema>;
