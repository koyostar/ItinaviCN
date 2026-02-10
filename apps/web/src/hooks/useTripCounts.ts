import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface TripCounts {
  locations: number;
  itinerary: number;
  expenses: number;
  totalAmount: number;
}

export function useTripCounts(tripId: string) {
  const [counts, setCounts] = useState<TripCounts>({
    locations: 0,
    itinerary: 0,
    expenses: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function loadCounts() {
    try {
      setLoading(true);
      const [locationsRes, itineraryRes, expensesRes] = await Promise.all([
        api.locations.list(tripId) as Promise<{ items: unknown[] }>,
        api.itinerary.list(tripId) as Promise<{ items: unknown[] }>,
        api.expenses.list(tripId) as Promise<
          { items: { amount: number }[] }
        >,
      ]);

      const totalAmount = expensesRes.items.reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0
      );

      setCounts({
        locations: locationsRes.items.length,
        itinerary: itineraryRes.items.length,
        expenses: expensesRes.items.length,
        totalAmount,
      });
    } catch (err) {
      console.error("Failed to load counts:", err);
    } finally {
      setLoading(false);
    }
  }

  return {
    counts,
    loading,
    refetch: loadCounts,
  };
}
