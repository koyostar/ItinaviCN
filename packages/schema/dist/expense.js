"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenseInputSchema = exports.ExpenseSchema = void 0;
const zod_1 = require("zod");
const trip_1 = require("./trip");
exports.ExpenseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    tripId: zod_1.z.string().uuid(),
    date: zod_1.z.string(), // ISO date
    amount: zod_1.z.number().positive(),
    currency: trip_1.CurrencyCodeSchema,
    category: zod_1.z
        .enum([
        "Food",
        "Transport",
        "Accommodation",
        "Shopping",
        "Entertainment",
        "Other",
    ])
        .default("Other"),
    description: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.CreateExpenseInputSchema = exports.ExpenseSchema.omit({ id: true });
