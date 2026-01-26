import { useState, useEffect, useCallback } from "react";
import type { TripResponse } from "@itinavi/schema";
import { api } from "@/lib/api";

/**
 * Return type for the useTrip hook
 */
interface UseTripReturn {
  /** The trip data, or null if not yet loaded */
  trip: TripResponse | null;
  /** Whether the trip is currently being loaded */
  loading: boolean;
  /** Error message if loading failed, null otherwise */
  error: string | null;
  /** Function to manually refetch the trip data */
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage a single trip's data.
 *
 * Automatically fetches the trip on mount and re-fetches when tripId changes.
 * Provides a refetch function for manual updates.
 *
 * @param {string} tripId - The ID of the trip to fetch
 * @returns {UseTripReturn} Object containing trip data, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * function TripDetailsPage({ tripId }: { tripId: string }) {
 *   const { trip, loading, error, refetch } = useTrip(tripId);
 *
 *   if (loading) return <Loading />;
 *   if (error) return <Error message={error} onRetry={refetch} />;
 *   if (!trip) return <NotFound />;
 *
 *   return <TripDetails trip={trip} onUpdate={refetch} />;
 * }
 * ```
 */
export function useTrip(tripId: string): UseTripReturn {
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.trips.get(tripId);
      setTrip(response as TripResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trip");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { trip, loading, error, refetch };
}
