import { useState, useCallback } from "react";

/**
 * Return type for the useEditDialog hook
 * @template T - The type of item being edited
 */
interface UseEditDialogReturn<T> {
  /** Whether the edit dialog is currently open */
  open: boolean;
  /** The item currently being edited, or null if dialog is closed */
  item: T | null;
  /** Whether the form is currently being submitted */
  submitting: boolean;
  /** Function to open the dialog with a specific item to edit */
  openEdit: (item: T) => void;
  /** Function to close the dialog and clear the current item */
  closeEdit: () => void;
  /** Function to handle form submission with the update logic */
  handleSubmit: (updateFn: (item: T) => Promise<void>) => Promise<void>;
}

/**
 * Custom hook for managing edit dialog state and submission.
 *
 * Provides a consistent pattern for edit dialogs across the application,
 * including opening/closing, tracking the item being edited, and handling
 * the submission process with error handling.
 *
 * @template T - The type of item being edited (e.g., TripResponse, LocationResponse)
 * @returns {UseEditDialogReturn<T>} Object with dialog state and control functions
 *
 * @example
 * ```tsx
 * function TripsPage() {
 *   const editDialog = useEditDialog<TripResponse>();
 *   const { refetch } = useTrips();
 *
 *   return (
 *     <>
 *       <TripCard onEdit={editDialog.openEdit} />
 *
 *       <FormDialog open={editDialog.open} onClose={editDialog.closeEdit}>
 *         {editDialog.item && (
 *           <TripForm
 *             initialData={editDialog.item}
 *             onSubmit={(data) =>
 *               editDialog.handleSubmit(async (trip) => {
 *                 await api.trips.update(trip.id, data);
 *                 refetch();
 *               })
 *             }
 *             loading={editDialog.submitting}
 *           />
 *         )}
 *       </FormDialog>
 *     </>
 *   );
 * }
 * ```
 */
export function useEditDialog<T>(): UseEditDialogReturn<T> {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const openEdit = useCallback((itemToEdit: T) => {
    setItem(itemToEdit);
    setOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    if (!submitting) {
      setOpen(false);
      setItem(null);
    }
  }, [submitting]);

  const handleSubmit = useCallback(
    async (updateFn: (item: T) => Promise<void>) => {
      if (!item) return;
      setSubmitting(true);
      try {
        await updateFn(item);
        setOpen(false);
        setItem(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update");
      } finally {
        setSubmitting(false);
      }
    },
    [item]
  );

  return {
    open,
    item,
    submitting,
    openEdit,
    closeEdit,
    handleSubmit,
  };
}
