import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { TripResponse, CreateTripRequest } from "@itinavi/schema";

export function useTripDetail(tripId: string) {
  const router = useRouter();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function loadTrip() {
    try {
      setLoading(true);
      setError(null);
      const data = (await api.trips.get(tripId)) as TripResponse;
      setTrip(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trip");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(payload: Partial<CreateTripRequest>) {
    try {
      setUpdating(true);
      await api.trips.update(tripId, payload);
      setEditDialogOpen(false);
      await loadTrip();
    } catch (err) {
      throw err;
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await api.trips.delete(tripId);
      router.push("/trips");
    } catch (err) {
      setDeleting(false);
      throw err;
    }
  }

  return {
    trip,
    loading,
    error,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    shareDialogOpen,
    setShareDialogOpen,
    updating,
    deleting,
    handleUpdate,
    handleDelete,
    refetch: loadTrip,
  };
}
