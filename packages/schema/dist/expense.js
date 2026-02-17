"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettleSplitParamsSchema = exports.BalanceSummarySchema = exports.UserBalanceSchema = exports.ExpenseIdParamSchema = exports.ListExpensesResponseSchema = exports.UpdateExpenseRequestSchema = exports.CreateExpenseRequestSchema = exports.ExpenseResponseSchema = exports.ExpenseSplitInputSchema = exports.ExpenseSplitSchema = exports.UserInfoSchema = exports.PaymentMethodSchema = exports.ExpenseCategorySchema = void 0;
const zod_1 = require("zod");
const trip_1 = require("./trip");
// Expense category enum matching Prisma schema
exports.ExpenseCategorySchema = zod_1.z.enum([
    "Accommodation",
    "Transport",
    "Food",
    "Shop",
    "Attraction",
    "Other",
]);
// Payment method enum matching Prisma schema
exports.PaymentMethodSchema = zod_1.z.enum(["Cash", "Card", "App"]);
// User info schema (for payer and split users)
exports.UserInfoSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    username: zod_1.z.string(),
    displayName: zod_1.z.string().nullable(),
});
// Expense split schema
exports.ExpenseSplitSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    expenseId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
    amountOwed: zod_1.z.number().int().min(0),
    isSettled: zod_1.z.boolean(),
    settledAt: zod_1.z.string().datetime().nullable(),
    user: exports.UserInfoSchema.optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
// Split input for creating/updating expenses
exports.ExpenseSplitInputSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    amountOwed: zod_1.z.number().int().min(0),
});
// Base expense schema
exports.ExpenseResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    tripId: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    category: exports.ExpenseCategorySchema,
    expenseDateTime: zod_1.z.string().datetime(),
    amountDestinationMinor: zod_1.z.number().int().min(0),
    destinationCurrency: trip_1.CurrencyCodeSchema,
    exchangeRateUsed: zod_1.z.number().optional(),
    linkedItineraryItemId: zod_1.z.string().uuid().nullable(),
    linkedLocationId: zod_1.z.string().uuid().nullable(),
    notes: zod_1.z.string().nullable(),
    paidByUserId: zod_1.z.string().uuid().nullable(),
    paidByUser: exports.UserInfoSchema.nullable().optional(),
    paymentMethod: exports.PaymentMethodSchema.nullable().optional(),
    splits: zod_1.z.array(exports.ExpenseSplitSchema).optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
// Create expense request schema
exports.CreateExpenseRequestSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    category: exports.ExpenseCategorySchema.default("Other"),
    expenseDateTime: zod_1.z.string().datetime(),
    amountDestinationMinor: zod_1.z.number().int().min(0),
    destinationCurrency: trip_1.CurrencyCodeSchema,
    exchangeRateUsed: zod_1.z.number().optional(),
    linkedItineraryItemId: zod_1.z.string().uuid().optional(),
    linkedLocationId: zod_1.z.string().uuid().optional(),
    notes: zod_1.z.string().max(2000).optional(),
    paidByUserId: zod_1.z.string().uuid().optional(),
    paymentMethod: exports.PaymentMethodSchema.optional(),
    splits: zod_1.z.array(exports.ExpenseSplitInputSchema).optional(),
});
// Update expense request schema
exports.UpdateExpenseRequestSchema = exports.CreateExpenseRequestSchema.partial().refine((v) => Object.keys(v).length > 0, {
    message: "At least one field is required",
});
// List expenses response
exports.ListExpensesResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.ExpenseResponseSchema),
});
// Expense ID param
exports.ExpenseIdParamSchema = zod_1.z.object({
    expenseId: zod_1.z.string().uuid(),
});
// Balance summary schemas
exports.UserBalanceSchema = zod_1.z.object({
    amount: zod_1.z.number(),
    user: exports.UserInfoSchema,
});
exports.BalanceSummarySchema = zod_1.z.object({
    totalPaid: zod_1.z.number(),
    totalOwed: zod_1.z.number(),
    netBalance: zod_1.z.number(),
    owesTo: zod_1.z.record(zod_1.z.string(), exports.UserBalanceSchema),
    owedBy: zod_1.z.record(zod_1.z.string(), exports.UserBalanceSchema),
});
// Settle split request schema
exports.SettleSplitParamsSchema = zod_1.z.object({
    expenseId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid(),
});
