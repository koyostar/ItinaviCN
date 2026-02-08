import { api } from "@/lib/api";
import { useState } from "react";

interface UseSyncLocationsReturn {
  syncing: boolean;
  syncMessage: string | null;
  handleSync: () => Promise<void>;
  clearMessage: () => void;
}

export function useSyncLocations(
  tripId: string,
  onSuccess?: () => void
): UseSyncLocationsReturn {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncMessage(null);
      const result = (await api.itinerary.syncLocations(tripId)) as {
        created: number;
      };
      setSyncMessage(
        `Synced successfully! ${result.created} location(s) created from itinerary.`
      );
      if (onSuccess) {
        await onSuccess();
      }
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (err) {
      setSyncMessage(
        err instanceof Error ? err.message : "Failed to sync locations"
      );
    } finally {
      setSyncing(false);
    }
  };

  const clearMessage = () => setSyncMessage(null);

  return { syncing, syncMessage, handleSync, clearMessage };
}
