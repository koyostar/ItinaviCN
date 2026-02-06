"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseIdParamSchema = exports.ListExpensesResponseSchema = exports.UpdateExpenseRequestSchema = exports.CreateExpenseRequestSchema = exports.ExpenseResponseSchema = exports.ExpenseCategorySchema = void 0;
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
});
// Update expense request schema
exports.UpdateExpenseRequestSchema = exports.CreateExpenseRequestSchema.partial()
    .refine((v) => Object.keys(v).length > 0, {
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
