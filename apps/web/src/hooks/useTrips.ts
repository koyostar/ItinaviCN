import { useState, useEffect, useCallback } from "react";
import type { TripResponse } from "@itinavi/schema";
import { api } from "@/lib/api";

/**
 * Return type for the useTrips hook
 */
interface UseTripsReturn {
  /** Array of all trips */
  trips: TripResponse[];
  /** Whether trips are currently being loaded */
  loading: boolean;
  /** Error message if loading failed, null otherwise */
  error: string | null;
  /** Function to manually refetch trips data */
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage a list of all trips.
 *
 * Automatically fetches trips on mount and provides a refetch function
 * for manual updates (e.g., after creating, updating, or deleting a trip).
 *
 * @returns {UseTripsReturn} Object containing trips array, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * function TripsPage() {
 *   const { trips, loading, error, refetch } = useTrips();
 *
 *   if (loading) return <Loading />;
 *   if (error) return <Error message={error} onRetry={refetch} />;
 *
 *   return <TripsList trips={trips} onUpdate={refetch} />;
 * }
 * ```
 */
export function useTrips(): UseTripsReturn {
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.trips.list();
      setTrips((response as { items: TripResponse[] }).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trips");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { trips, loading, error, refetch };
}
