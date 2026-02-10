import { z } from "zod";
export declare const ExpenseCategorySchema: z.ZodEnum<["Accommodation", "Transport", "Food", "Shop", "Attraction", "Other"]>;
export type ExpenseCategory = z.infer<typeof ExpenseCategorySchema>;
export declare const ExpenseResponseSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    title: z.ZodString;
    category: z.ZodEnum<["Accommodation", "Transport", "Food", "Shop", "Attraction", "Other"]>;
    expenseDateTime: z.ZodString;
    amountDestinationMinor: z.ZodNumber;
    destinationCurrency: z.ZodString;
    exchangeRateUsed: z.ZodOptional<z.ZodNumber>;
    linkedItineraryItemId: z.ZodNullable<z.ZodString>;
    linkedLocationId: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    tripId: string;
    title: string;
    destinationCurrency: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    category: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other";
    expenseDateTime: string;
    amountDestinationMinor: number;
    linkedItineraryItemId: string | null;
    linkedLocationId: string | null;
    exchangeRateUsed?: number | undefined;
}, {
    id: string;
    tripId: string;
    title: string;
    destinationCurrency: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    category: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other";
    expenseDateTime: string;
    amountDestinationMinor: number;
    linkedItineraryItemId: string | null;
    linkedLocationId: string | null;
    exchangeRateUsed?: number | undefined;
}>;
export type ExpenseResponse = z.infer<typeof ExpenseResponseSchema>;
export declare const CreateExpenseRequestSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["Accommodation", "Transport", "Food", "Shop", "Attraction", "Other"]>>;
    expenseDateTime: z.ZodString;
    amountDestinationMinor: z.ZodNumber;
    destinationCurrency: z.ZodString;
    exchangeRateUsed: z.ZodOptional<z.ZodNumber>;
    linkedItineraryItemId: z.ZodOptional<z.ZodString>;
    linkedLocationId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    destinationCurrency: string;
    category: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other";
    expenseDateTime: string;
    amountDestinationMinor: number;
    notes?: string | undefined;
    exchangeRateUsed?: number | undefined;
    linkedItineraryItemId?: string | undefined;
    linkedLocationId?: string | undefined;
}, {
    title: string;
    destinationCurrency: string;
    expenseDateTime: string;
    amountDestinationMinor: number;
    notes?: string | undefined;
    category?: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other" | undefined;
    exchangeRateUsed?: number | undefined;
    linkedItineraryItemId?: string | undefined;
    linkedLocationId?: string | undefined;
}>;
export type CreateExpenseRequest = z.infer<typeof CreateExpenseRequestSchema>;
export declare const UpdateExpenseRequestSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodDefault<z.ZodEnum<["Accommodation", "Transport", "Food", "Shop", "Attraction", "Other"]>>>;
    expenseDateTime: z.ZodOptional<z.ZodString>;
    amountDestinationMinor: z.ZodOptional<z.ZodNumber>;
    destinationCurrency: z.ZodOptional<z.ZodString>;
    exchangeRateUsed: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    linkedItineraryItemId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    linkedLocationId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    destinationCurrency?: string | undefined;
    notes?: string | undefined;
    category?: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other" | undefined;
    expenseDateTime?: string | undefined;
    amountDestinationMinor?: number | undefined;
    exchangeRateUsed?: number | undefined;
    linkedItineraryItemId?: string | undefined;
    linkedLocationId?: string | undefined;
}, {
    title?: string | undefined;
    destinationCurrency?: string | undefined;
    notes?: string | undefined;
    category?: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other" | undefined;
    expenseDateTime?: string | undefined;
    amountDestinationMinor?: number | undefined;
    exchangeRateUsed?: number | undefined;
    linkedItineraryItemId?: string | undefined;
    linkedLocationId?: string | undefined;
}>, {
    title?: string | undefined;
    destinationCurrency?: string | undefined;
    notes?: string | undefined;
    category?: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other" | undefined;
    expenseDateTime?: string | undefined;
    amountDestinationMinor?: number | undefined;
    exchangeRateUsed?: number | undefined;
    linkedItineraryItemId?: string | undefined;
    linkedLocationId?: string | undefined;
}, {
    title?: string | undefined;
    destinationCurrency?: string | undefined;
    notes?: string | undefined;
    category?: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other" | undefined;
    expenseDateTime?: string | undefined;
    amountDestinationMinor?: number | undefined;
    exchangeRateUsed?: number | undefined;
    linkedItineraryItemId?: string | undefined;
    linkedLocationId?: string | undefined;
}>;
export type UpdateExpenseRequest = z.infer<typeof UpdateExpenseRequestSchema>;
export declare const ListExpensesResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        tripId: z.ZodString;
        title: z.ZodString;
        category: z.ZodEnum<["Accommodation", "Transport", "Food", "Shop", "Attraction", "Other"]>;
        expenseDateTime: z.ZodString;
        amountDestinationMinor: z.ZodNumber;
        destinationCurrency: z.ZodString;
        exchangeRateUsed: z.ZodOptional<z.ZodNumber>;
        linkedItineraryItemId: z.ZodNullable<z.ZodString>;
        linkedLocationId: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        tripId: string;
        title: string;
        destinationCurrency: string;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
        category: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other";
        expenseDateTime: string;
        amountDestinationMinor: number;
        linkedItineraryItemId: string | null;
        linkedLocationId: string | null;
        exchangeRateUsed?: number | undefined;
    }, {
        id: string;
        tripId: string;
        title: string;
        destinationCurrency: string;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
        category: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other";
        expenseDateTime: string;
        amountDestinationMinor: number;
        linkedItineraryItemId: string | null;
        linkedLocationId: string | null;
        exchangeRateUsed?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        tripId: string;
        title: string;
        destinationCurrency: string;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
        category: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other";
        expenseDateTime: string;
        amountDestinationMinor: number;
        linkedItineraryItemId: string | null;
        linkedLocationId: string | null;
        exchangeRateUsed?: number | undefined;
    }[];
}, {
    items: {
        id: string;
        tripId: string;
        title: string;
        destinationCurrency: string;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
        category: "Accommodation" | "Transport" | "Food" | "Shop" | "Attraction" | "Other";
        expenseDateTime: string;
        amountDestinationMinor: number;
        linkedItineraryItemId: string | null;
        linkedLocationId: string | null;
        exchangeRateUsed?: number | undefined;
    }[];
}>;
export type ListExpensesResponse = z.infer<typeof ListExpensesResponseSchema>;
export declare const ExpenseIdParamSchema: z.ZodObject<{
    expenseId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    expenseId: string;
}, {
    expenseId: string;
}>;
export type ExpenseIdParam = z.infer<typeof ExpenseIdParamSchema>;
