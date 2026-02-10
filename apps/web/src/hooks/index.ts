/**
 * Barrel export file for all custom hooks.
 * Provides a centralized import point for better developer experience.
 */

// Data fetching hooks
export { useExpenses } from "./useExpenses";
export { useItineraryItems } from "./useItineraryItems";
export { useLocations } from "./useLocations";
export { useTrip } from "./useTrip";
export { useTrips } from "./useTrips";

// Dialog management hooks
export { useDeleteConfirmation } from "./useDeleteConfirmation";
export { useDetailsDialog } from "./useDetailsDialog";
export { useEditDialog } from "./useEditDialog";

// Form and utility hooks
export { useExchangeRate } from "./useExchangeRate";
export { useFormSubmit } from "./useFormSubmit";
export { useItineraryFilters } from "./useItineraryFilters";
export { useLocationFilters } from "./useLocationFilters";
export { useLoginForm } from "./useLoginForm";
export { usePasswordChange } from "./usePasswordChange";
export { useProfileForm } from "./useProfileForm";
export { useSnackbar } from "./useSnackbar";
export { useSyncLocations } from "./useSyncLocations";
export { useTripTimezone } from "./useTripTimezone";
