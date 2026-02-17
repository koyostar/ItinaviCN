import { z } from "zod";
export declare const ExpenseCategorySchema: z.ZodEnum<["Accommodation", "Transport", "Food", "Shop", "Attraction", "Other"]>;
export type ExpenseCategory = z.infer<typeof ExpenseCategorySchema>;
export declare const PaymentMethodSchema: z.ZodEnum<["Cash", "Card", "App"]>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export declare const UserInfoSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    displayName: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    displayName: string | null;
    id: string;
}, {
    username: string;
    displayName: string | null;
    id: string;
}>;
export type UserInfo = z.infer<typeof UserInfoSchema>;
export declare const ExpenseSplitSchema: z.ZodObject<{
    id: z.ZodString;
    expenseId: z.ZodString;
    userId: z.ZodString;
    amountOwed: z.ZodNumber;
    isSettled: z.ZodBoolean;
    settledAt: z.ZodNullable<z.ZodString>;
    user: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        displayName: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        displayName: string | null;
        id: string;
    }, {
        username: string;
        displayName: string | null;
        id: string;
    }>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    expenseId: string;
    amountOwed: number;
    isSettled: boolean;
    settledAt: string | null;
    user?: {
        username: string;
        displayName: string | null;
        id: string;
    } | undefined;
}, {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    expenseId: string;
    amountOwed: number;
    isSettled: boolean;
    settledAt: string | null;
    user?: {
        username: string;
        displayName: string | null;
        id: string;
    } | undefined;
}>;
export type ExpenseSplit = z.infer<typeof ExpenseSplitSchema>;
export declare const ExpenseSplitInputSchema: z.ZodObject<{
    userId: z.ZodString;
    amountOwed: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    userId: string;
    amountOwed: number;
}, {
    userId: string;
    amountOwed: number;
}>;
export type ExpenseSplitInput = z.infer<typeof ExpenseSplitInputSchema>;
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
    paidByUserId: z.ZodNullable<z.ZodString>;
    paidByUser: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        displayName: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        displayName: string | null;
        id: string;
    }, {
        username: string;
        displayName: string | null;
        id: string;
    }>>>;
    paymentMethod: z.ZodOptional<z.ZodNullable<z.ZodEnum<["Cash", "Card", "App"]>>>;
    splits: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        expenseId: z.ZodString;
        userId: z.ZodString;
        amountOwed: z.ZodNumber;
        isSettled: z.ZodBoolean;
        settledAt: z.ZodNullable<z.ZodString>;
        user: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            username: z.ZodString;
            displayName: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            username: string;
            displayName: string | null;
            id: string;
        }, {
            username: string;
            displayName: string | null;
            id: string;
        }>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
        expenseId: string;
        amountOwed: number;
        isSettled: boolean;
        settledAt: string | null;
        user?: {
            username: string;
            displayName: string | null;
            id: string;
        } | undefined;
    }, {
        id: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
        expenseId: string;
        amountOwed: number;
        isSettled: boolean;
        settledAt: string | null;
        user?: {
            username: string;
            displayName: string | null;
            id: string;
        } | undefined;
    }>, "many">>;
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
    paidByUserId: string | null;
    exchangeRateUsed?: number | undefined;
    paidByUser?: {
        username: string;
        displayName: string | null;
        id: string;
    } | null | undefined;
    paymentMethod?: "Cash" | "Card" | "App" | null | undefined;
    splits?: {
        id: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
        expenseId: string;
        amountOwed: number;
        isSettled: boolean;
        settledAt: string | null;
        user?: {
            username: string;
            displayName: string | null;
            id: string;
        } | undefined;
    }[] | undefined;
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
    paidByUserId: string | null;
    exchangeRateUsed?: number | undefined;
    paidByUser?: {
        username: string;
        displayName: string | null;
        id: string;
    } | null | undefined;
    paymentMethod?: "Cash" | "Card" | "App" | null | undefined;
    splits?: {
        id: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
        expenseId: string;
        amountOwed: number;
        isSettled: boolean;
        settledAt: string | null;
        user?: {
            username: string;
            displayName: string | null;
            id: string;
        } | undefined;
    }[] | undefined;
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
    paidByUserId: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodOptional<z.ZodEnum<["Cash", "Card", "App"]>>;
    splits: z.ZodOptional<z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        amountOwed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        amountOwed: number;
    }, {
        userId: string;
        amountOwed: number;
    }>, "many">>;
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
    paidByUserId?: string | undefined;
    paymentMethod?: "Cash" | "Card" | "App" | undefined;
    splits?: {
        userId: string;
        amountOwed: number;
    }[] | undefined;
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
    paidByUserId?: string | undefined;
    paymentMethod?: "Cash" | "Card" | "App" | undefined;
    splits?: {
        userId: string;
        amountOwed: number;
    }[] | undefined;
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
    paidByUserId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    paymentMethod: z.ZodOptional<z.ZodOptional<z.ZodEnum<["Cash", "Card", "App"]>>>;
    splits: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        amountOwed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        amountOwed: number;
    }, {
        userId: string;
        amountOwed: number;
    }>, "many">>>;
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
    paidByUserId?: string | undefined;
    paymentMethod?: "Cash" | "Card" | "App" | undefined;
    splits?: {
        userId: string;
        amountOwed: number;
    }[] | undefined;
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
    paidByUserId?: string | undefined;
    paymentMethod?: "Cash" | "Card" | "App" | undefined;
    splits?: {
        userId: string;
        amountOwed: number;
    }[] | undefined;
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
    paidByUserId?: string | undefined;
    paymentMethod?: "Cash" | "Card" | "App" | undefined;
    splits?: {
        userId: string;
        amountOwed: number;
    }[] | undefined;
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
    paidByUserId?: string | undefined;
    paymentMethod?: "Cash" | "Card" | "App" | undefined;
    splits?: {
        userId: string;
        amountOwed: number;
    }[] | undefined;
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
        paidByUserId: z.ZodNullable<z.ZodString>;
        paidByUser: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            username: z.ZodString;
            displayName: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            username: string;
            displayName: string | null;
            id: string;
        }, {
            username: string;
            displayName: string | null;
            id: string;
        }>>>;
        paymentMethod: z.ZodOptional<z.ZodNullable<z.ZodEnum<["Cash", "Card", "App"]>>>;
        splits: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            expenseId: z.ZodString;
            userId: z.ZodString;
            amountOwed: z.ZodNumber;
            isSettled: z.ZodBoolean;
            settledAt: z.ZodNullable<z.ZodString>;
            user: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                username: z.ZodString;
                displayName: z.ZodNullable<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                username: string;
                displayName: string | null;
                id: string;
            }, {
                username: string;
                displayName: string | null;
                id: string;
            }>>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            expenseId: string;
            amountOwed: number;
            isSettled: boolean;
            settledAt: string | null;
            user?: {
                username: string;
                displayName: string | null;
                id: string;
            } | undefined;
        }, {
            id: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            expenseId: string;
            amountOwed: number;
            isSettled: boolean;
            settledAt: string | null;
            user?: {
                username: string;
                displayName: string | null;
                id: string;
            } | undefined;
        }>, "many">>;
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
        paidByUserId: string | null;
        exchangeRateUsed?: number | undefined;
        paidByUser?: {
            username: string;
            displayName: string | null;
            id: string;
        } | null | undefined;
        paymentMethod?: "Cash" | "Card" | "App" | null | undefined;
        splits?: {
            id: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            expenseId: string;
            amountOwed: number;
            isSettled: boolean;
            settledAt: string | null;
            user?: {
                username: string;
                displayName: string | null;
                id: string;
            } | undefined;
        }[] | undefined;
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
        paidByUserId: string | null;
        exchangeRateUsed?: number | undefined;
        paidByUser?: {
            username: string;
            displayName: string | null;
            id: string;
        } | null | undefined;
        paymentMethod?: "Cash" | "Card" | "App" | null | undefined;
        splits?: {
            id: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            expenseId: string;
            amountOwed: number;
            isSettled: boolean;
            settledAt: string | null;
            user?: {
                username: string;
                displayName: string | null;
                id: string;
            } | undefined;
        }[] | undefined;
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
        paidByUserId: string | null;
        exchangeRateUsed?: number | undefined;
        paidByUser?: {
            username: string;
            displayName: string | null;
            id: string;
        } | null | undefined;
        paymentMethod?: "Cash" | "Card" | "App" | null | undefined;
        splits?: {
            id: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            expenseId: string;
            amountOwed: number;
            isSettled: boolean;
            settledAt: string | null;
            user?: {
                username: string;
                displayName: string | null;
                id: string;
            } | undefined;
        }[] | undefined;
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
        paidByUserId: string | null;
        exchangeRateUsed?: number | undefined;
        paidByUser?: {
            username: string;
            displayName: string | null;
            id: string;
        } | null | undefined;
        paymentMethod?: "Cash" | "Card" | "App" | null | undefined;
        splits?: {
            id: string;
            userId: string;
            createdAt: string;
            updatedAt: string;
            expenseId: string;
            amountOwed: number;
            isSettled: boolean;
            settledAt: string | null;
            user?: {
                username: string;
                displayName: string | null;
                id: string;
            } | undefined;
        }[] | undefined;
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
export declare const UserBalanceSchema: z.ZodObject<{
    amount: z.ZodNumber;
    user: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        displayName: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        username: string;
        displayName: string | null;
        id: string;
    }, {
        username: string;
        displayName: string | null;
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    user: {
        username: string;
        displayName: string | null;
        id: string;
    };
    amount: number;
}, {
    user: {
        username: string;
        displayName: string | null;
        id: string;
    };
    amount: number;
}>;
export type UserBalance = z.infer<typeof UserBalanceSchema>;
export declare const BalanceSummarySchema: z.ZodObject<{
    totalPaid: z.ZodNumber;
    totalOwed: z.ZodNumber;
    netBalance: z.ZodNumber;
    owesTo: z.ZodRecord<z.ZodString, z.ZodObject<{
        amount: z.ZodNumber;
        user: z.ZodObject<{
            id: z.ZodString;
            username: z.ZodString;
            displayName: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            username: string;
            displayName: string | null;
            id: string;
        }, {
            username: string;
            displayName: string | null;
            id: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        user: {
            username: string;
            displayName: string | null;
            id: string;
        };
        amount: number;
    }, {
        user: {
            username: string;
            displayName: string | null;
            id: string;
        };
        amount: number;
    }>>;
    owedBy: z.ZodRecord<z.ZodString, z.ZodObject<{
        amount: z.ZodNumber;
        user: z.ZodObject<{
            id: z.ZodString;
            username: z.ZodString;
            displayName: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            username: string;
            displayName: string | null;
            id: string;
        }, {
            username: string;
            displayName: string | null;
            id: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        user: {
            username: string;
            displayName: string | null;
            id: string;
        };
        amount: number;
    }, {
        user: {
            username: string;
            displayName: string | null;
            id: string;
        };
        amount: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    totalPaid: number;
    totalOwed: number;
    netBalance: number;
    owesTo: Record<string, {
        user: {
            username: string;
            displayName: string | null;
            id: string;
        };
        amount: number;
    }>;
    owedBy: Record<string, {
        user: {
            username: string;
            displayName: string | null;
            id: string;
        };
        amount: number;
    }>;
}, {
    totalPaid: number;
    totalOwed: number;
    netBalance: number;
    owesTo: Record<string, {
        user: {
            username: string;
            displayName: string | null;
            id: string;
        };
        amount: number;
    }>;
    owedBy: Record<string, {
        user: {
            username: string;
            displayName: string | null;
            id: string;
        };
        amount: number;
    }>;
}>;
export type BalanceSummary = z.infer<typeof BalanceSummarySchema>;
export declare const SettleSplitParamsSchema: z.ZodObject<{
    expenseId: z.ZodString;
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    expenseId: string;
}, {
    userId: string;
    expenseId: string;
}>;
export type SettleSplitParams = z.infer<typeof SettleSplitParamsSchema>;
