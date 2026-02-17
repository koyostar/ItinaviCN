import type { ExpenseResponse, ExpenseSplit, ExpenseSplitInput, UserInfo } from "@itinavi/schema";
import { formatUTCDate } from "../dateUtils";

/**
 * Gets display name for a user
 */
export function getUserDisplay(user: UserInfo | null | undefined): string {
  if (!user) return "Unknown User";
  return user.displayName || user.username || "Unknown User";
}

/**
 * Maps expense splits to split inputs for editing
 */
export function mapSplitsToInput(splits: ExpenseSplit[]): ExpenseSplitInput[] {
  return splits.map((split) => ({
    userId: split.userId,
    amountOwed: split.amountOwed,
  }));
}

/**
 * Groups expenses by their date
 */
export function groupExpensesByDate(
  expenses: ExpenseResponse[]
): Record<string, ExpenseResponse[]> {
  return expenses.reduce(
    (acc, expense) => {
      const date = formatUTCDate(expense.expenseDateTime, "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(expense);
      return acc;
    },
    {} as Record<string, ExpenseResponse[]>
  );
}

/**
 * Calculates total amounts grouped by currency
 */
export function calculateTotalsByCurrency(
  expenses: ExpenseResponse[]
): Record<string, number> {
  return expenses.reduce(
    (acc, expense) => {
      const currency = expense.destinationCurrency;
      if (!acc[currency]) acc[currency] = 0;
      acc[currency] += expense.amountDestinationMinor / 100; // Convert from minor units
      return acc;
    },
    {} as Record<string, number>
  );
}
