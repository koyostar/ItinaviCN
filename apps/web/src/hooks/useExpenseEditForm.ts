import { useState, useEffect } from "react";
import type { ExpenseCategory, ExpenseResponse, PaymentMethod } from "@itinavi/schema";

export function useExpenseEditForm(expense: ExpenseResponse | null) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Other" as ExpenseCategory,
    expenseDateTime: "",
    amount: "",
    destinationCurrency: "",
    exchangeRateUsed: "",
    linkedItineraryItemId: "",
    notes: "",
    paidByUserId: "",
    paymentMethod: "Cash" as PaymentMethod,
  });

  // Update form when editing an expense
  useEffect(() => {
    if (expense) {
      const dateTime = new Date(expense.expenseDateTime);
      const localDateTime = new Date(
        dateTime.getTime() - dateTime.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      setFormData({
        title: expense.title,
        category: expense.category,
        expenseDateTime: localDateTime,
        amount: (expense.amountDestinationMinor / 100).toString(),
        destinationCurrency: expense.destinationCurrency,
        exchangeRateUsed: expense.exchangeRateUsed?.toString() || "",
        linkedItineraryItemId: expense.linkedItineraryItemId || "",
        notes: expense.notes || "",
        paidByUserId: expense.paidByUserId || "",
        paymentMethod: expense.paymentMethod || "Cash",
      });
    }
  }, [expense]);

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setExchangeRate = (rate: number | null) => {
    if (rate !== null) {
      setFormData((prev) => ({
        ...prev,
        exchangeRateUsed: rate.toString(),
      }));
    }
  };

  return {
    formData,
    updateField,
    setExchangeRate,
  };
}
