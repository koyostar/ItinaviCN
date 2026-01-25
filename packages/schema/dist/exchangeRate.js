"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExchangeRateInputSchema = exports.ExchangeRateSchema = void 0;
const zod_1 = require("zod");
const trip_1 = require("./trip");
exports.ExchangeRateSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    tripId: zod_1.z.string().uuid(),
    fromCurrency: trip_1.CurrencyCodeSchema,
    toCurrency: trip_1.CurrencyCodeSchema,
    rate: zod_1.z.number().positive(),
    date: zod_1.z.string(), // ISO date when the rate was recorded
});
exports.CreateExchangeRateInputSchema = exports.ExchangeRateSchema.omit({
    id: true,
});
