import { useState, useEffect, useCallback } from "react";
import type { LocationResponse } from "@itinavi/schema";
import { api } from "@/lib/api";

/**
 * Return type for the useLocations hook
 */
interface UseLocationsReturn {
  /** Array of saved locations for the trip */
  locations: LocationResponse[];
  /** Whether locations are currently being loaded */
  loading: boolean;
  /** Error message if loading failed, null otherwise */
  error: string | null;
  /** Function to manually refetch locations */
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage saved locations for a specific trip.
 *
 * Automatically fetches locations on mount and re-fetches when tripId changes.
 * Locations can include places, restaurants, hotels, and other points of interest.
 *
 * @param {string} tripId - The ID of the trip whose locations to fetch
 * @returns {UseLocationsReturn} Object containing locations array, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * function LocationsPage({ tripId }: { tripId: string }) {
 *   const { locations, loading, error, refetch } = useLocations(tripId);
 *
 *   const handleAdd = async (data: CreateLocationRequest) => {
 *     await api.locations.create(tripId, data);
 *     refetch(); // Reload locations after adding
 *   };
 *
 *   return <LocationsList locations={locations} onAdd={handleAdd} />;
 * }
 * ```
 */
export function useLocations(tripId: string): UseLocationsReturn {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.locations.list(tripId);
      setLocations((response as { items: LocationResponse[] }).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load locations");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { locations, loading, error, refetch };
}
