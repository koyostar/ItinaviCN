import { z } from "zod";
import { CurrencyCodeSchema } from "./trip";
export const ExpenseSchema = z.object({
    id: z.string().uuid(),
    tripId: z.string().uuid(),
    date: z.string(), // ISO date
    amount: z.number().positive(),
    currency: CurrencyCodeSchema,
    category: z.enum(["Food", "Transport", "Accommodation", "Shopping", "Entertainment", "Other"]).default("Other"),
    description: z.string().optional(),
    notes: z.string().optional(),
});
export const CreateExpenseInputSchema = ExpenseSchema.omit({ id: true });
