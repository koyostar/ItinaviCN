import { useState, useEffect, useCallback } from "react";
import type { ExpenseResponse } from "@itinavi/schema";
import { api } from "@/lib/api";

/**
 * Return type for the useExpenses hook
 */
interface UseExpensesReturn {
  /** Array of expenses for the trip */
  expenses: ExpenseResponse[];
  /** Whether expenses are currently being loaded */
  loading: boolean;
  /** Error message if loading failed, null otherwise */
  error: string | null;
  /** Function to manually refetch expenses */
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage expenses for a specific trip.
 *
 * Automatically fetches expenses on mount and re-fetches when tripId changes.
 * Expenses include categorized spending with currency and exchange rate information.
 *
 * @param {string} tripId - The ID of the trip whose expenses to fetch
 * @returns {UseExpensesReturn} Object containing expenses array, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * function ExpensesPage({ tripId }: { tripId: string }) {
 *   const { expenses, loading, error, refetch } = useExpenses(tripId);
 *
 *   const handleDelete = async (id: string) => {
 *     await api.expenses.delete(tripId, id);
 *     refetch(); // Reload expenses after deletion
 *   };
 *
 *   return <ExpenseList expenses={expenses} onDelete={handleDelete} />;
 * }
 * ```
 */
export function useExpenses(tripId: string): UseExpensesReturn {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.expenses.list(tripId);
      setExpenses((response as { items: ExpenseResponse[] }).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { expenses, loading, error, refetch };
}
