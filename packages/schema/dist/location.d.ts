import { z } from "zod";
export declare const LocationCategorySchema: z.ZodEnum<["Place", "Restaurant", "Accommodation", "TransportNode", "Shop", "Other"]>;
export type LocationCategory = z.infer<typeof LocationCategorySchema>;
export declare const LocationIdParamSchema: z.ZodObject<{
    locationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    locationId: string;
}, {
    locationId: string;
}>;
export declare const CreateLocationRequestSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<["Place", "Restaurant", "Accommodation", "TransportNode", "Shop", "Other"]>;
    address: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    baiduPlaceId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode";
    name: string;
    notes?: string | undefined;
    address?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    baiduPlaceId?: string | undefined;
}, {
    category: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode";
    name: string;
    notes?: string | undefined;
    address?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    baiduPlaceId?: string | undefined;
}>;
export type CreateLocationRequest = z.infer<typeof CreateLocationRequestSchema>;
export declare const UpdateLocationRequestSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["Place", "Restaurant", "Accommodation", "TransportNode", "Shop", "Other"]>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    latitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    longitude: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    baiduPlaceId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
    category?: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode" | undefined;
    address?: string | undefined;
    name?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    baiduPlaceId?: string | undefined;
}, {
    notes?: string | undefined;
    category?: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode" | undefined;
    address?: string | undefined;
    name?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    baiduPlaceId?: string | undefined;
}>, {
    notes?: string | undefined;
    category?: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode" | undefined;
    address?: string | undefined;
    name?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    baiduPlaceId?: string | undefined;
}, {
    notes?: string | undefined;
    category?: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode" | undefined;
    address?: string | undefined;
    name?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    baiduPlaceId?: string | undefined;
}>;
export type UpdateLocationRequest = z.infer<typeof UpdateLocationRequestSchema>;
export declare const LocationResponseSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<["Place", "Restaurant", "Accommodation", "TransportNode", "Shop", "Other"]>;
    address: z.ZodNullable<z.ZodString>;
    latitude: z.ZodNullable<z.ZodNumber>;
    longitude: z.ZodNullable<z.ZodNumber>;
    baiduPlaceId: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tripId: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    category: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode";
    address: string | null;
    name: string;
    latitude: number | null;
    longitude: number | null;
    baiduPlaceId: string | null;
}, {
    tripId: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    category: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode";
    address: string | null;
    name: string;
    latitude: number | null;
    longitude: number | null;
    baiduPlaceId: string | null;
}>;
export type LocationResponse = z.infer<typeof LocationResponseSchema>;
export declare const ListLocationsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        tripId: z.ZodString;
        name: z.ZodString;
        category: z.ZodEnum<["Place", "Restaurant", "Accommodation", "TransportNode", "Shop", "Other"]>;
        address: z.ZodNullable<z.ZodString>;
        latitude: z.ZodNullable<z.ZodNumber>;
        longitude: z.ZodNullable<z.ZodNumber>;
        baiduPlaceId: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        tripId: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        category: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode";
        address: string | null;
        name: string;
        latitude: number | null;
        longitude: number | null;
        baiduPlaceId: string | null;
    }, {
        tripId: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        category: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode";
        address: string | null;
        name: string;
        latitude: number | null;
        longitude: number | null;
        baiduPlaceId: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        tripId: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        category: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode";
        address: string | null;
        name: string;
        latitude: number | null;
        longitude: number | null;
        baiduPlaceId: string | null;
    }[];
}, {
    items: {
        tripId: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        category: "Accommodation" | "Shop" | "Other" | "Place" | "Restaurant" | "TransportNode";
        address: string | null;
        name: string;
        latitude: number | null;
        longitude: number | null;
        baiduPlaceId: string | null;
    }[];
}>;
export type ListLocationsResponse = z.infer<typeof ListLocationsResponseSchema>;
