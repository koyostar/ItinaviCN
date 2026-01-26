import { useState, useEffect, useCallback } from "react";
import type { ItineraryItemResponse } from "@itinavi/schema";
import { api } from "@/lib/api";

/**
 * Return type for the useItineraryItems hook
 */
interface UseItineraryItemsReturn {
  /** Array of itinerary items for the trip */
  items: ItineraryItemResponse[];
  /** Whether items are currently being loaded */
  loading: boolean;
  /** Error message if loading failed, null otherwise */
  error: string | null;
  /** Function to manually refetch itinerary items */
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage itinerary items for a specific trip.
 *
 * Automatically fetches items on mount and re-fetches when tripId changes.
 * Items include flights, accommodations, transport, place visits, and food entries.
 *
 * @param {string} tripId - The ID of the trip whose itinerary items to fetch
 * @returns {UseItineraryItemsReturn} Object containing items array, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * function ItineraryPage({ tripId }: { tripId: string }) {
 *   const { items, loading, error, refetch } = useItineraryItems(tripId);
 *
 *   const handleDelete = async (id: string) => {
 *     await api.itinerary.delete(tripId, id);
 *     refetch(); // Reload items after deletion
 *   };
 *
 *   return <ItineraryList items={items} onDelete={handleDelete} />;
 * }
 * ```
 */
export function useItineraryItems(tripId: string): UseItineraryItemsReturn {
  const [items, setItems] = useState<ItineraryItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.itinerary.list(tripId);
      setItems((response as { items: ItineraryItemResponse[] }).items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load itinerary");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { items, loading, error, refetch };
}
