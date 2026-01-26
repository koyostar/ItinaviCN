import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { TripResponse } from "@itinavi/schema";
import { getTimezoneForCountry } from "@/lib/utils/timezone";

/**
 * Return type for the useTripTimezone hook
 */
interface UseTripTimezoneReturn {
  /** The timezone string for the trip's primary destination (e.g., "Asia/Shanghai") */
  timezone: string;
  /** Whether the timezone is currently being loaded */
  loading: boolean;
}

/**
 * Custom hook to fetch and determine the default timezone for a trip.
 *
 * Fetches the trip data and extracts the timezone from the first destination's country.
 * Falls back to "Asia/Shanghai" if no destination is available. This is useful for
 * setting default timezones in date/time pickers for itinerary items.
 *
 * @param {string} tripId - The ID of the trip
 * @returns {UseTripTimezoneReturn} Object containing the timezone string and loading state
 *
 * @example
 * ```tsx
 * function NewItineraryItemPage({ tripId }: { tripId: string }) {
 *   const { timezone: defaultTimezone } = useTripTimezone(tripId);
 *
 *   return (
 *     <ItineraryForm
 *       defaultTimezone={defaultTimezone}
 *       onSubmit={handleSubmit}
 *     />
 *   );
 * }
 * ```
 */
export function useTripTimezone(tripId: string): UseTripTimezoneReturn {
  const [timezone, setTimezone] = useState("Asia/Shanghai");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimezone() {
      try {
        const trip = (await api.trips.get(tripId)) as TripResponse;
        const country = trip.destinations?.[0]?.country;
        if (country) {
          setTimezone(getTimezoneForCountry(country));
        }
      } catch (err) {
        console.error("Failed to load timezone:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTimezone();
  }, [tripId]);

  return { timezone, loading };
}
