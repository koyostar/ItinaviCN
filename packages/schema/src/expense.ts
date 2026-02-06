import { z } from "zod";
import { CurrencyCodeSchema } from "./trip";

// Expense category enum matching Prisma schema
export const ExpenseCategorySchema = z.enum([
  "Accommodation",
  "Transport",
  "Food",
  "Shop",
  "Attraction",
  "Other",
]);

export type ExpenseCategory = z.infer<typeof ExpenseCategorySchema>;

// Base expense schema
export const ExpenseResponseSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  title: z.string(),
  category: ExpenseCategorySchema,
  expenseDateTime: z.string().datetime(),
  amountDestinationMinor: z.number().int().min(0),
  destinationCurrency: CurrencyCodeSchema,
  exchangeRateUsed: z.number().optional(),
  linkedItineraryItemId: z.string().uuid().nullable(),
  linkedLocationId: z.string().uuid().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ExpenseResponse = z.infer<typeof ExpenseResponseSchema>;

// Create expense request schema
export const CreateExpenseRequestSchema = z.object({
  title: z.string().min(1).max(200),
  category: ExpenseCategorySchema.default("Other"),
  expenseDateTime: z.string().datetime(),
  amountDestinationMinor: z.number().int().min(0),
  destinationCurrency: CurrencyCodeSchema,
  exchangeRateUsed: z.number().optional(),
  linkedItineraryItemId: z.string().uuid().optional(),
  linkedLocationId: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
});

export type CreateExpenseRequest = z.infer<typeof CreateExpenseRequestSchema>;

// Update expense request schema
export const UpdateExpenseRequestSchema =
  CreateExpenseRequestSchema.partial().refine(
    (v) => Object.keys(v).length > 0,
    {
      message: "At least one field is required",
    },
  );

export type UpdateExpenseRequest = z.infer<typeof UpdateExpenseRequestSchema>;

// List expenses response
export const ListExpensesResponseSchema = z.object({
  items: z.array(ExpenseResponseSchema),
});

export type ListExpensesResponse = z.infer<typeof ListExpensesResponseSchema>;

// Expense ID param
export const ExpenseIdParamSchema = z.object({
  expenseId: z.string().uuid(),
});

export type ExpenseIdParam = z.infer<typeof ExpenseIdParamSchema>;
