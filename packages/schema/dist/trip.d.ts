import { z } from "zod";
export declare const CurrencyCodeSchema: z.ZodString;
export declare const DestinationSchema: z.ZodObject<{
    country: z.ZodString;
    cities: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    country: string;
    cities: string[];
}, {
    country: string;
    cities: string[];
}>;
export type Destination = z.infer<typeof DestinationSchema>;
export declare const TripIdParamSchema: z.ZodObject<{
    tripId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tripId: string;
}, {
    tripId: string;
}>;
export declare const CreateTripRequestSchema: z.ZodObject<{
    title: z.ZodString;
    destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        country: z.ZodString;
        cities: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        country: string;
        cities: string[];
    }, {
        country: string;
        cities: string[];
    }>, "many">>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    destinationCurrency: z.ZodDefault<z.ZodString>;
    originCurrency: z.ZodDefault<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    startDate: string;
    endDate: string;
    destinationCurrency: string;
    originCurrency: string;
    destinations?: {
        country: string;
        cities: string[];
    }[] | undefined;
    notes?: string | undefined;
}, {
    title: string;
    startDate: string;
    endDate: string;
    destinations?: {
        country: string;
        cities: string[];
    }[] | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    notes?: string | undefined;
}>;
export type CreateTripRequest = z.infer<typeof CreateTripRequestSchema>;
export declare const UpdateTripRequestSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    destinations: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        country: z.ZodString;
        cities: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        country: string;
        cities: string[];
    }, {
        country: string;
        cities: string[];
    }>, "many">>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    destinationCurrency: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    originCurrency: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    destinations?: {
        country: string;
        cities: string[];
    }[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    notes?: string | undefined;
}, {
    title?: string | undefined;
    destinations?: {
        country: string;
        cities: string[];
    }[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    notes?: string | undefined;
}>, {
    title?: string | undefined;
    destinations?: {
        country: string;
        cities: string[];
    }[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    notes?: string | undefined;
}, {
    title?: string | undefined;
    destinations?: {
        country: string;
        cities: string[];
    }[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    destinationCurrency?: string | undefined;
    originCurrency?: string | undefined;
    notes?: string | undefined;
}>;
export type UpdateTripRequest = z.infer<typeof UpdateTripRequestSchema>;
export declare const TripResponseSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    destinations: z.ZodNullable<z.ZodArray<z.ZodObject<{
        country: z.ZodString;
        cities: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        country: string;
        cities: string[];
    }, {
        country: string;
        cities: string[];
    }>, "many">>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    destinationCurrency: z.ZodString;
    originCurrency: z.ZodString;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    destinations: {
        country: string;
        cities: string[];
    }[] | null;
    startDate: string;
    endDate: string;
    destinationCurrency: string;
    originCurrency: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}, {
    id: string;
    title: string;
    destinations: {
        country: string;
        cities: string[];
    }[] | null;
    startDate: string;
    endDate: string;
    destinationCurrency: string;
    originCurrency: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}>;
export type TripResponse = z.infer<typeof TripResponseSchema>;
export declare const ListTripsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        destinations: z.ZodNullable<z.ZodArray<z.ZodObject<{
            country: z.ZodString;
            cities: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            country: string;
            cities: string[];
        }, {
            country: string;
            cities: string[];
        }>, "many">>;
        startDate: z.ZodString;
        endDate: z.ZodString;
        destinationCurrency: z.ZodString;
        originCurrency: z.ZodString;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        destinations: {
            country: string;
            cities: string[];
        }[] | null;
        startDate: string;
        endDate: string;
        destinationCurrency: string;
        originCurrency: string;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
    }, {
        id: string;
        title: string;
        destinations: {
            country: string;
            cities: string[];
        }[] | null;
        startDate: string;
        endDate: string;
        destinationCurrency: string;
        originCurrency: string;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        title: string;
        destinations: {
            country: string;
            cities: string[];
        }[] | null;
        startDate: string;
        endDate: string;
        destinationCurrency: string;
        originCurrency: string;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
    }[];
}, {
    items: {
        id: string;
        title: string;
        destinations: {
            country: string;
            cities: string[];
        }[] | null;
        startDate: string;
        endDate: string;
        destinationCurrency: string;
        originCurrency: string;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
    }[];
}>;
export type ListTripsResponse = z.infer<typeof ListTripsResponseSchema>;
export declare const TripRoleSchema: z.ZodEnum<["OWNER", "EDITOR", "VIEWER"]>;
export type TripRole = z.infer<typeof TripRoleSchema>;
export declare const AddTripMemberRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodEnum<["OWNER", "EDITOR", "VIEWER"]>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    role: "OWNER" | "EDITOR" | "VIEWER";
}, {
    userId: string;
    role: "OWNER" | "EDITOR" | "VIEWER";
}>;
export type AddTripMemberRequest = z.infer<typeof AddTripMemberRequestSchema>;
export declare const UpdateTripMemberRequestSchema: z.ZodObject<{
    role: z.ZodEnum<["OWNER", "EDITOR", "VIEWER"]>;
}, "strip", z.ZodTypeAny, {
    role: "OWNER" | "EDITOR" | "VIEWER";
}, {
    role: "OWNER" | "EDITOR" | "VIEWER";
}>;
export type UpdateTripMemberRequest = z.infer<typeof UpdateTripMemberRequestSchema>;
export declare const RemoveTripMemberRequestSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export type RemoveTripMemberRequest = z.infer<typeof RemoveTripMemberRequestSchema>;
