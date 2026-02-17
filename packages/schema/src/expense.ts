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

// Payment method enum matching Prisma schema
export const PaymentMethodSchema = z.enum(["Cash", "Card", "App"]);

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

// User info schema (for payer and split users)
export const UserInfoSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  displayName: z.string().nullable(),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;

// Expense split schema
export const ExpenseSplitSchema = z.object({
  id: z.string().uuid(),
  expenseId: z.string().uuid(),
  userId: z.string().uuid(),
  amountOwed: z.number().int().min(0),
  isSettled: z.boolean(),
  settledAt: z.string().datetime().nullable(),
  user: UserInfoSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ExpenseSplit = z.infer<typeof ExpenseSplitSchema>;

// Split input for creating/updating expenses
export const ExpenseSplitInputSchema = z.object({
  userId: z.string().uuid(),
  amountOwed: z.number().int().min(0),
});

export type ExpenseSplitInput = z.infer<typeof ExpenseSplitInputSchema>;

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
  paidByUserId: z.string().uuid().nullable(),
  paidByUser: UserInfoSchema.nullable().optional(),
  paymentMethod: PaymentMethodSchema.nullable().optional(),
  splits: z.array(ExpenseSplitSchema).optional(),
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
  paidByUserId: z.string().uuid().optional(),
  paymentMethod: PaymentMethodSchema.optional(),
  splits: z.array(ExpenseSplitInputSchema).optional(),
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

// Balance summary schemas
export const UserBalanceSchema = z.object({
  amount: z.number(),
  user: UserInfoSchema,
});

export type UserBalance = z.infer<typeof UserBalanceSchema>;

export const BalanceSummarySchema = z.object({
  totalPaid: z.number(),
  totalOwed: z.number(),
  netBalance: z.number(),
  owesTo: z.record(z.string(), UserBalanceSchema),
  owedBy: z.record(z.string(), UserBalanceSchema),
});

export type BalanceSummary = z.infer<typeof BalanceSummarySchema>;

// Settle split request schema
export const SettleSplitParamsSchema = z.object({
  expenseId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type SettleSplitParams = z.infer<typeof SettleSplitParamsSchema>;
