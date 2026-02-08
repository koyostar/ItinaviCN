import { useState } from "react";

/**
 * Return type for the useDeleteConfirmation hook
 */
interface UseDeleteConfirmationReturn {
  /** Whether the confirmation dialog is currently open */
  open: boolean;
  /** Whether the deletion is in progress */
  loading: boolean;
  /** Function to trigger delete confirmation for a specific item ID */
  handleDelete: (id: string) => void;
  /** Function to confirm and execute the deletion */
  handleConfirm: () => Promise<void>;
  /** Function to cancel the deletion and close the dialog */
  handleCancel: () => void;
}

/**
 * Custom hook for managing delete confirmation dialogs with optimistic updates.
 *
 * Provides a two-step deletion process: first showing a confirmation dialog,
 * then executing the delete operation and refreshing the data. Prevents accidental
 * deletions and provides consistent UX across the application.
 *
 * @param {function} deleteFn - Async function that performs the deletion, receives the item ID
 * @param {function} onSuccess - Callback function called after successful deletion (typically a refetch)
 * @returns {UseDeleteConfirmationReturn} Object with dialog state and control functions
 *
 * @example
 * ```tsx
 * function TripsList() {
 *   const { trips, refetch } = useTrips();
 *   const deleteConfirmation = useDeleteConfirmation(
 *     async (id) => await api.trips.delete(id),
 *     refetch
 *   );
 *
 *   return (
 *     <>
 *       {trips.map(trip => (
 *         <TripCard
 *           key={trip.id}
 *           onDelete={() => deleteConfirmation.handleDelete(trip.id)}
 *         />
 *       ))}
 *
 *       <ConfirmDialog
 *         open={deleteConfirmation.open}
 *         onConfirm={deleteConfirmation.handleConfirm}
 *         onCancel={deleteConfirmation.handleCancel}
 *         loading={deleteConfirmation.loading}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function useDeleteConfirmation(
  deleteFunction: (id: string) => Promise<void>,
  onSuccess?: () => void
): UseDeleteConfirmationReturn {
  const [open, setOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    try {
      await deleteFunction(itemToDelete);
      setOpen(false);
      setItemToDelete(null);
      onSuccess?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setItemToDelete(null);
  };

  return { open, loading, handleDelete, handleConfirm, handleCancel };
}
