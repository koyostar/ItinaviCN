import { z } from "zod";
export declare const ItineraryItemTypeSchema: z.ZodEnum<["Flight", "Transport", "Accommodation", "Place", "Food"]>;
export type ItineraryItemType = z.infer<typeof ItineraryItemTypeSchema>;
export declare const ItineraryStatusSchema: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
export type ItineraryStatus = z.infer<typeof ItineraryStatusSchema>;
export declare const TransportModeSchema: z.ZodEnum<["Metro", "Bus", "Taxi", "Didi", "Train", "Walk", "Other"]>;
export type TransportMode = z.infer<typeof TransportModeSchema>;
export declare const FlightDetailsSchema: z.ZodObject<{
    airline: z.ZodOptional<z.ZodString>;
    flightNo: z.ZodOptional<z.ZodString>;
    departureAirport: z.ZodOptional<z.ZodString>;
    arrivalAirport: z.ZodOptional<z.ZodString>;
    departureAirportAddress: z.ZodOptional<z.ZodString>;
    arrivalAirportAddress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    airline?: string | undefined;
    flightNo?: string | undefined;
    departureAirport?: string | undefined;
    arrivalAirport?: string | undefined;
    departureAirportAddress?: string | undefined;
    arrivalAirportAddress?: string | undefined;
}, {
    airline?: string | undefined;
    flightNo?: string | undefined;
    departureAirport?: string | undefined;
    arrivalAirport?: string | undefined;
    departureAirportAddress?: string | undefined;
    arrivalAirportAddress?: string | undefined;
}>;
export type FlightDetails = z.infer<typeof FlightDetailsSchema>;
export declare const TransportDetailsSchema: z.ZodObject<{
    mode: z.ZodEnum<["Metro", "Bus", "Taxi", "Didi", "Train", "Walk", "Other"]>;
    fromLocationId: z.ZodOptional<z.ZodString>;
    toLocationId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
    fromLocationId?: string | undefined;
    toLocationId?: string | undefined;
}, {
    mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
    fromLocationId?: string | undefined;
    toLocationId?: string | undefined;
}>;
export type TransportDetails = z.infer<typeof TransportDetailsSchema>;
export declare const AccommodationDetailsSchema: z.ZodObject<{
    hotelName: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    checkInDateTime: z.ZodOptional<z.ZodString>;
    checkOutDateTime: z.ZodOptional<z.ZodString>;
    guests: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    hotelName?: string | undefined;
    address?: string | undefined;
    checkInDateTime?: string | undefined;
    checkOutDateTime?: string | undefined;
    guests?: number | undefined;
}, {
    hotelName?: string | undefined;
    address?: string | undefined;
    checkInDateTime?: string | undefined;
    checkOutDateTime?: string | undefined;
    guests?: number | undefined;
}>;
export type AccommodationDetails = z.infer<typeof AccommodationDetailsSchema>;
export declare const PlaceDetailsSchema: z.ZodObject<{
    address: z.ZodOptional<z.ZodString>;
    ticketInfo: z.ZodOptional<z.ZodString>;
    openingTime: z.ZodOptional<z.ZodString>;
    closingTime: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    address?: string | undefined;
    ticketInfo?: string | undefined;
    openingTime?: string | undefined;
    closingTime?: string | undefined;
}, {
    address?: string | undefined;
    ticketInfo?: string | undefined;
    openingTime?: string | undefined;
    closingTime?: string | undefined;
}>;
export type PlaceDetails = z.infer<typeof PlaceDetailsSchema>;
export declare const FoodDetailsSchema: z.ZodObject<{
    address: z.ZodOptional<z.ZodString>;
    cuisine: z.ZodOptional<z.ZodString>;
    openingTime: z.ZodOptional<z.ZodString>;
    closingTime: z.ZodOptional<z.ZodString>;
    reservationInfo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    address?: string | undefined;
    openingTime?: string | undefined;
    closingTime?: string | undefined;
    cuisine?: string | undefined;
    reservationInfo?: string | undefined;
}, {
    address?: string | undefined;
    openingTime?: string | undefined;
    closingTime?: string | undefined;
    cuisine?: string | undefined;
    reservationInfo?: string | undefined;
}>;
export type FoodDetails = z.infer<typeof FoodDetailsSchema>;
export declare const CreateFlightRequestSchema: z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Flight">;
    details: z.ZodOptional<z.ZodObject<{
        airline: z.ZodOptional<z.ZodString>;
        flightNo: z.ZodOptional<z.ZodString>;
        departureAirport: z.ZodOptional<z.ZodString>;
        arrivalAirport: z.ZodOptional<z.ZodString>;
        departureAirportAddress: z.ZodOptional<z.ZodString>;
        arrivalAirportAddress: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    }, {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Flight";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    } | undefined;
}, {
    type: "Flight";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    } | undefined;
}>;
export declare const CreateTransportRequestSchema: z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Transport">;
    details: z.ZodOptional<z.ZodObject<{
        mode: z.ZodEnum<["Metro", "Bus", "Taxi", "Didi", "Train", "Walk", "Other"]>;
        fromLocationId: z.ZodOptional<z.ZodString>;
        toLocationId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    }, {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Transport";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    } | undefined;
}, {
    type: "Transport";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    } | undefined;
}>;
export declare const CreateAccommodationRequestSchema: z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Accommodation">;
    details: z.ZodOptional<z.ZodObject<{
        hotelName: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        checkInDateTime: z.ZodOptional<z.ZodString>;
        checkOutDateTime: z.ZodOptional<z.ZodString>;
        guests: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    }, {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Accommodation";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    } | undefined;
}, {
    type: "Accommodation";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    } | undefined;
}>;
export declare const CreatePlaceRequestSchema: z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Place">;
    details: z.ZodOptional<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        ticketInfo: z.ZodOptional<z.ZodString>;
        openingTime: z.ZodOptional<z.ZodString>;
        closingTime: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    }, {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Place";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    } | undefined;
}, {
    type: "Place";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    } | undefined;
}>;
export declare const CreateFoodRequestSchema: z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Food">;
    details: z.ZodOptional<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        cuisine: z.ZodOptional<z.ZodString>;
        openingTime: z.ZodOptional<z.ZodString>;
        closingTime: z.ZodOptional<z.ZodString>;
        reservationInfo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    }, {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Food";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    } | undefined;
}, {
    type: "Food";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    } | undefined;
}>;
export declare const CreateItineraryItemRequestSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Flight">;
    details: z.ZodOptional<z.ZodObject<{
        airline: z.ZodOptional<z.ZodString>;
        flightNo: z.ZodOptional<z.ZodString>;
        departureAirport: z.ZodOptional<z.ZodString>;
        arrivalAirport: z.ZodOptional<z.ZodString>;
        departureAirportAddress: z.ZodOptional<z.ZodString>;
        arrivalAirportAddress: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    }, {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Flight";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    } | undefined;
}, {
    type: "Flight";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Transport">;
    details: z.ZodOptional<z.ZodObject<{
        mode: z.ZodEnum<["Metro", "Bus", "Taxi", "Didi", "Train", "Walk", "Other"]>;
        fromLocationId: z.ZodOptional<z.ZodString>;
        toLocationId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    }, {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Transport";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    } | undefined;
}, {
    type: "Transport";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Accommodation">;
    details: z.ZodOptional<z.ZodObject<{
        hotelName: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        checkInDateTime: z.ZodOptional<z.ZodString>;
        checkOutDateTime: z.ZodOptional<z.ZodString>;
        guests: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    }, {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Accommodation";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    } | undefined;
}, {
    type: "Accommodation";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    } | undefined;
}>, z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Place">;
    details: z.ZodOptional<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        ticketInfo: z.ZodOptional<z.ZodString>;
        openingTime: z.ZodOptional<z.ZodString>;
        closingTime: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    }, {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Place";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    } | undefined;
}, {
    type: "Place";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    startTimezone: z.ZodOptional<z.ZodString>;
    endTimezone: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>;
    locationId: z.ZodOptional<z.ZodString>;
    bookingRef: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"Food">;
    details: z.ZodOptional<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        cuisine: z.ZodOptional<z.ZodString>;
        openingTime: z.ZodOptional<z.ZodString>;
        closingTime: z.ZodOptional<z.ZodString>;
        reservationInfo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    }, {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Food";
    title: string;
    startDateTime: string;
    timezone: string;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    } | undefined;
}, {
    type: "Food";
    title: string;
    startDateTime: string;
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    notes?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    } | undefined;
}>]>;
export type CreateItineraryItemRequest = z.infer<typeof CreateItineraryItemRequestSchema>;
export declare const UpdateItineraryItemRequestSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    startDateTime: z.ZodOptional<z.ZodString>;
    endDateTime: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    timezone: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    startTimezone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    endTimezone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>>>;
    locationId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bookingRef: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    url: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
} & {
    type: z.ZodOptional<z.ZodEnum<["Flight", "Transport", "Accommodation", "Place", "Food"]>>;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    type?: "Food" | "Transport" | "Accommodation" | "Flight" | "Place" | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    startDateTime?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: Record<string, unknown> | undefined;
}, {
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    type?: "Food" | "Transport" | "Accommodation" | "Flight" | "Place" | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    startDateTime?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: Record<string, unknown> | undefined;
}>, {
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    type?: "Food" | "Transport" | "Accommodation" | "Flight" | "Place" | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    startDateTime?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: Record<string, unknown> | undefined;
}, {
    status?: "Planned" | "Booked" | "Done" | "Skipped" | undefined;
    type?: "Food" | "Transport" | "Accommodation" | "Flight" | "Place" | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    startDateTime?: string | undefined;
    endDateTime?: string | undefined;
    timezone?: string | undefined;
    startTimezone?: string | undefined;
    endTimezone?: string | undefined;
    locationId?: string | undefined;
    bookingRef?: string | undefined;
    url?: string | undefined;
    details?: Record<string, unknown> | undefined;
}>;
export type UpdateItineraryItemRequest = z.infer<typeof UpdateItineraryItemRequestSchema>;
export declare const FlightResponseSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Flight">;
    details: z.ZodNullable<z.ZodObject<{
        airline: z.ZodOptional<z.ZodString>;
        flightNo: z.ZodOptional<z.ZodString>;
        departureAirport: z.ZodOptional<z.ZodString>;
        arrivalAirport: z.ZodOptional<z.ZodString>;
        departureAirportAddress: z.ZodOptional<z.ZodString>;
        arrivalAirportAddress: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    }, {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Flight";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Flight";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    } | null;
}>;
export declare const TransportResponseSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Transport">;
    details: z.ZodNullable<z.ZodObject<{
        mode: z.ZodEnum<["Metro", "Bus", "Taxi", "Didi", "Train", "Walk", "Other"]>;
        fromLocationId: z.ZodOptional<z.ZodString>;
        toLocationId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    }, {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Transport";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Transport";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    } | null;
}>;
export declare const AccommodationResponseSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Accommodation">;
    details: z.ZodNullable<z.ZodObject<{
        hotelName: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        checkInDateTime: z.ZodOptional<z.ZodString>;
        checkOutDateTime: z.ZodOptional<z.ZodString>;
        guests: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    }, {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Accommodation";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Accommodation";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    } | null;
}>;
export declare const PlaceResponseSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Place">;
    details: z.ZodNullable<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        ticketInfo: z.ZodOptional<z.ZodString>;
        openingTime: z.ZodOptional<z.ZodString>;
        closingTime: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    }, {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Place";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Place";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    } | null;
}>;
export declare const FoodResponseSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Food">;
    details: z.ZodNullable<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        cuisine: z.ZodOptional<z.ZodString>;
        openingTime: z.ZodOptional<z.ZodString>;
        closingTime: z.ZodOptional<z.ZodString>;
        reservationInfo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    }, {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Food";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Food";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    } | null;
}>;
export declare const ItineraryItemResponseSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Flight">;
    details: z.ZodNullable<z.ZodObject<{
        airline: z.ZodOptional<z.ZodString>;
        flightNo: z.ZodOptional<z.ZodString>;
        departureAirport: z.ZodOptional<z.ZodString>;
        arrivalAirport: z.ZodOptional<z.ZodString>;
        departureAirportAddress: z.ZodOptional<z.ZodString>;
        arrivalAirportAddress: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    }, {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Flight";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Flight";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        airline?: string | undefined;
        flightNo?: string | undefined;
        departureAirport?: string | undefined;
        arrivalAirport?: string | undefined;
        departureAirportAddress?: string | undefined;
        arrivalAirportAddress?: string | undefined;
    } | null;
}>, z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Transport">;
    details: z.ZodNullable<z.ZodObject<{
        mode: z.ZodEnum<["Metro", "Bus", "Taxi", "Didi", "Train", "Walk", "Other"]>;
        fromLocationId: z.ZodOptional<z.ZodString>;
        toLocationId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    }, {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Transport";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Transport";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
        fromLocationId?: string | undefined;
        toLocationId?: string | undefined;
    } | null;
}>, z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Accommodation">;
    details: z.ZodNullable<z.ZodObject<{
        hotelName: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        checkInDateTime: z.ZodOptional<z.ZodString>;
        checkOutDateTime: z.ZodOptional<z.ZodString>;
        guests: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    }, {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Accommodation";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Accommodation";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        hotelName?: string | undefined;
        address?: string | undefined;
        checkInDateTime?: string | undefined;
        checkOutDateTime?: string | undefined;
        guests?: number | undefined;
    } | null;
}>, z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Place">;
    details: z.ZodNullable<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        ticketInfo: z.ZodOptional<z.ZodString>;
        openingTime: z.ZodOptional<z.ZodString>;
        closingTime: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    }, {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Place";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Place";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        address?: string | undefined;
        ticketInfo?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
    } | null;
}>, z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    startDateTime: z.ZodString;
    endDateTime: z.ZodNullable<z.ZodString>;
    timezone: z.ZodString;
    startTimezone: z.ZodNullable<z.ZodString>;
    endTimezone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
    locationId: z.ZodNullable<z.ZodString>;
    bookingRef: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
} & {
    type: z.ZodLiteral<"Food">;
    details: z.ZodNullable<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        cuisine: z.ZodOptional<z.ZodString>;
        openingTime: z.ZodOptional<z.ZodString>;
        closingTime: z.ZodOptional<z.ZodString>;
        reservationInfo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    }, {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Food";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    } | null;
}, {
    status: "Planned" | "Booked" | "Done" | "Skipped";
    type: "Food";
    tripId: string;
    title: string;
    notes: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
    startDateTime: string;
    endDateTime: string | null;
    timezone: string;
    startTimezone: string | null;
    endTimezone: string | null;
    locationId: string | null;
    bookingRef: string | null;
    url: string | null;
    details: {
        address?: string | undefined;
        openingTime?: string | undefined;
        closingTime?: string | undefined;
        cuisine?: string | undefined;
        reservationInfo?: string | undefined;
    } | null;
}>]>;
export type ItineraryItemResponse = z.infer<typeof ItineraryItemResponseSchema>;
export declare const ListItineraryItemsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        id: z.ZodString;
        tripId: z.ZodString;
        title: z.ZodString;
        startDateTime: z.ZodString;
        endDateTime: z.ZodNullable<z.ZodString>;
        timezone: z.ZodString;
        startTimezone: z.ZodNullable<z.ZodString>;
        endTimezone: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
        locationId: z.ZodNullable<z.ZodString>;
        bookingRef: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    } & {
        type: z.ZodLiteral<"Flight">;
        details: z.ZodNullable<z.ZodObject<{
            airline: z.ZodOptional<z.ZodString>;
            flightNo: z.ZodOptional<z.ZodString>;
            departureAirport: z.ZodOptional<z.ZodString>;
            arrivalAirport: z.ZodOptional<z.ZodString>;
            departureAirportAddress: z.ZodOptional<z.ZodString>;
            arrivalAirportAddress: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            airline?: string | undefined;
            flightNo?: string | undefined;
            departureAirport?: string | undefined;
            arrivalAirport?: string | undefined;
            departureAirportAddress?: string | undefined;
            arrivalAirportAddress?: string | undefined;
        }, {
            airline?: string | undefined;
            flightNo?: string | undefined;
            departureAirport?: string | undefined;
            arrivalAirport?: string | undefined;
            departureAirportAddress?: string | undefined;
            arrivalAirportAddress?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Flight";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            airline?: string | undefined;
            flightNo?: string | undefined;
            departureAirport?: string | undefined;
            arrivalAirport?: string | undefined;
            departureAirportAddress?: string | undefined;
            arrivalAirportAddress?: string | undefined;
        } | null;
    }, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Flight";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            airline?: string | undefined;
            flightNo?: string | undefined;
            departureAirport?: string | undefined;
            arrivalAirport?: string | undefined;
            departureAirportAddress?: string | undefined;
            arrivalAirportAddress?: string | undefined;
        } | null;
    }>, z.ZodObject<{
        id: z.ZodString;
        tripId: z.ZodString;
        title: z.ZodString;
        startDateTime: z.ZodString;
        endDateTime: z.ZodNullable<z.ZodString>;
        timezone: z.ZodString;
        startTimezone: z.ZodNullable<z.ZodString>;
        endTimezone: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
        locationId: z.ZodNullable<z.ZodString>;
        bookingRef: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    } & {
        type: z.ZodLiteral<"Transport">;
        details: z.ZodNullable<z.ZodObject<{
            mode: z.ZodEnum<["Metro", "Bus", "Taxi", "Didi", "Train", "Walk", "Other"]>;
            fromLocationId: z.ZodOptional<z.ZodString>;
            toLocationId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
            fromLocationId?: string | undefined;
            toLocationId?: string | undefined;
        }, {
            mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
            fromLocationId?: string | undefined;
            toLocationId?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Transport";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
            fromLocationId?: string | undefined;
            toLocationId?: string | undefined;
        } | null;
    }, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Transport";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
            fromLocationId?: string | undefined;
            toLocationId?: string | undefined;
        } | null;
    }>, z.ZodObject<{
        id: z.ZodString;
        tripId: z.ZodString;
        title: z.ZodString;
        startDateTime: z.ZodString;
        endDateTime: z.ZodNullable<z.ZodString>;
        timezone: z.ZodString;
        startTimezone: z.ZodNullable<z.ZodString>;
        endTimezone: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
        locationId: z.ZodNullable<z.ZodString>;
        bookingRef: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    } & {
        type: z.ZodLiteral<"Accommodation">;
        details: z.ZodNullable<z.ZodObject<{
            hotelName: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
            checkInDateTime: z.ZodOptional<z.ZodString>;
            checkOutDateTime: z.ZodOptional<z.ZodString>;
            guests: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            hotelName?: string | undefined;
            address?: string | undefined;
            checkInDateTime?: string | undefined;
            checkOutDateTime?: string | undefined;
            guests?: number | undefined;
        }, {
            hotelName?: string | undefined;
            address?: string | undefined;
            checkInDateTime?: string | undefined;
            checkOutDateTime?: string | undefined;
            guests?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Accommodation";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            hotelName?: string | undefined;
            address?: string | undefined;
            checkInDateTime?: string | undefined;
            checkOutDateTime?: string | undefined;
            guests?: number | undefined;
        } | null;
    }, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Accommodation";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            hotelName?: string | undefined;
            address?: string | undefined;
            checkInDateTime?: string | undefined;
            checkOutDateTime?: string | undefined;
            guests?: number | undefined;
        } | null;
    }>, z.ZodObject<{
        id: z.ZodString;
        tripId: z.ZodString;
        title: z.ZodString;
        startDateTime: z.ZodString;
        endDateTime: z.ZodNullable<z.ZodString>;
        timezone: z.ZodString;
        startTimezone: z.ZodNullable<z.ZodString>;
        endTimezone: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
        locationId: z.ZodNullable<z.ZodString>;
        bookingRef: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    } & {
        type: z.ZodLiteral<"Place">;
        details: z.ZodNullable<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            ticketInfo: z.ZodOptional<z.ZodString>;
            openingTime: z.ZodOptional<z.ZodString>;
            closingTime: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            address?: string | undefined;
            ticketInfo?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
        }, {
            address?: string | undefined;
            ticketInfo?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Place";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            address?: string | undefined;
            ticketInfo?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
        } | null;
    }, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Place";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            address?: string | undefined;
            ticketInfo?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
        } | null;
    }>, z.ZodObject<{
        id: z.ZodString;
        tripId: z.ZodString;
        title: z.ZodString;
        startDateTime: z.ZodString;
        endDateTime: z.ZodNullable<z.ZodString>;
        timezone: z.ZodString;
        startTimezone: z.ZodNullable<z.ZodString>;
        endTimezone: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<["Planned", "Booked", "Done", "Skipped"]>;
        locationId: z.ZodNullable<z.ZodString>;
        bookingRef: z.ZodNullable<z.ZodString>;
        url: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    } & {
        type: z.ZodLiteral<"Food">;
        details: z.ZodNullable<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            cuisine: z.ZodOptional<z.ZodString>;
            openingTime: z.ZodOptional<z.ZodString>;
            closingTime: z.ZodOptional<z.ZodString>;
            reservationInfo: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            address?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
            cuisine?: string | undefined;
            reservationInfo?: string | undefined;
        }, {
            address?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
            cuisine?: string | undefined;
            reservationInfo?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Food";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            address?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
            cuisine?: string | undefined;
            reservationInfo?: string | undefined;
        } | null;
    }, {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Food";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            address?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
            cuisine?: string | undefined;
            reservationInfo?: string | undefined;
        } | null;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    items: ({
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Flight";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            airline?: string | undefined;
            flightNo?: string | undefined;
            departureAirport?: string | undefined;
            arrivalAirport?: string | undefined;
            departureAirportAddress?: string | undefined;
            arrivalAirportAddress?: string | undefined;
        } | null;
    } | {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Transport";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
            fromLocationId?: string | undefined;
            toLocationId?: string | undefined;
        } | null;
    } | {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Accommodation";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            hotelName?: string | undefined;
            address?: string | undefined;
            checkInDateTime?: string | undefined;
            checkOutDateTime?: string | undefined;
            guests?: number | undefined;
        } | null;
    } | {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Place";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            address?: string | undefined;
            ticketInfo?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
        } | null;
    } | {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Food";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            address?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
            cuisine?: string | undefined;
            reservationInfo?: string | undefined;
        } | null;
    })[];
}, {
    items: ({
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Flight";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            airline?: string | undefined;
            flightNo?: string | undefined;
            departureAirport?: string | undefined;
            arrivalAirport?: string | undefined;
            departureAirportAddress?: string | undefined;
            arrivalAirportAddress?: string | undefined;
        } | null;
    } | {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Transport";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            mode: "Other" | "Metro" | "Bus" | "Taxi" | "Didi" | "Train" | "Walk";
            fromLocationId?: string | undefined;
            toLocationId?: string | undefined;
        } | null;
    } | {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Accommodation";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            hotelName?: string | undefined;
            address?: string | undefined;
            checkInDateTime?: string | undefined;
            checkOutDateTime?: string | undefined;
            guests?: number | undefined;
        } | null;
    } | {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Place";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            address?: string | undefined;
            ticketInfo?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
        } | null;
    } | {
        status: "Planned" | "Booked" | "Done" | "Skipped";
        type: "Food";
        tripId: string;
        title: string;
        notes: string | null;
        id: string;
        createdAt: string;
        updatedAt: string;
        startDateTime: string;
        endDateTime: string | null;
        timezone: string;
        startTimezone: string | null;
        endTimezone: string | null;
        locationId: string | null;
        bookingRef: string | null;
        url: string | null;
        details: {
            address?: string | undefined;
            openingTime?: string | undefined;
            closingTime?: string | undefined;
            cuisine?: string | undefined;
            reservationInfo?: string | undefined;
        } | null;
    })[];
}>;
export type ListItineraryItemsResponse = z.infer<typeof ListItineraryItemsResponseSchema>;
export declare const ItineraryItemIdParamSchema: z.ZodObject<{
    itemId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    itemId: string;
}, {
    itemId: string;
}>;
