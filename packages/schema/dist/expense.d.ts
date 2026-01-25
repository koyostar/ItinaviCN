import { z } from "zod";
export declare const ExpenseSchema: z.ZodObject<{
    id: z.ZodString;
    tripId: z.ZodString;
    date: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["Food", "Transport", "Accommodation", "Shopping", "Entertainment", "Other"]>>;
    description: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    tripId: string;
    id: string;
    amount: number;
    currency: string;
    category: "Food" | "Transport" | "Accommodation" | "Shopping" | "Entertainment" | "Other";
    notes?: string | undefined;
    description?: string | undefined;
}, {
    date: string;
    tripId: string;
    id: string;
    amount: number;
    currency: string;
    notes?: string | undefined;
    category?: "Food" | "Transport" | "Accommodation" | "Shopping" | "Entertainment" | "Other" | undefined;
    description?: string | undefined;
}>;
export type Expense = z.infer<typeof ExpenseSchema>;
export declare const CreateExpenseInputSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    tripId: z.ZodString;
    date: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["Food", "Transport", "Accommodation", "Shopping", "Entertainment", "Other"]>>;
    description: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "id">, "strip", z.ZodTypeAny, {
    date: string;
    tripId: string;
    amount: number;
    currency: string;
    category: "Food" | "Transport" | "Accommodation" | "Shopping" | "Entertainment" | "Other";
    notes?: string | undefined;
    description?: string | undefined;
}, {
    date: string;
    tripId: string;
    amount: number;
    currency: string;
    notes?: string | undefined;
    category?: "Food" | "Transport" | "Accommodation" | "Shopping" | "Entertainment" | "Other" | undefined;
    description?: string | undefined;
}>;
export type CreateExpenseInput = z.infer<typeof CreateExpenseInputSchema>;
