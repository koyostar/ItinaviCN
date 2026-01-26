import { useState, useCallback } from "react";

/**
 * Return type for the useDetailsDialog hook
 * @template T - The type of item being displayed
 */
interface UseDetailsDialogReturn<T> {
  /** Whether the details dialog is currently open */
  open: boolean;
  /** The item currently being viewed, or null if dialog is closed */
  item: T | null;
  /** Function to open the dialog with a specific item to view */
  openDetails: (item: T) => void;
  /** Function to close the dialog and clear the current item */
  closeDetails: () => void;
}

/**
 * Custom hook for managing read-only details dialog state.
 *
 * Simpler version of useEditDialog for displaying item details without editing.
 * Useful for showing detailed information in a modal/dialog view.
 *
 * @template T - The type of item being displayed (e.g., ItineraryItemResponse)
 * @returns {UseDetailsDialogReturn<T>} Object with dialog state and control functions
 *
 * @example
 * ```tsx
 * function ItineraryPage() {
 *   const detailsDialog = useDetailsDialog<ItineraryItemResponse>();
 *
 *   return (
 *     <>
 *       <ItineraryCard onClick={detailsDialog.openDetails} />
 *
 *       <Dialog open={detailsDialog.open} onClose={detailsDialog.closeDetails}>
 *         {detailsDialog.item && (
 *           <ItemDetails item={detailsDialog.item} />
 *         )}
 *       </Dialog>
 *     </>
 *   );
 * }
 * ```
 */
export function useDetailsDialog<T>(): UseDetailsDialogReturn<T> {
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);

  const openDetails = useCallback((itemToView: T) => {
    setItem(itemToView);
    setOpen(true);
  }, []);

  const closeDetails = useCallback(() => {
    setOpen(false);
    setItem(null);
  }, []);

  return { open, item, openDetails, closeDetails };
}
