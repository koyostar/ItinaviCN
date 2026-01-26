/**
 * Barrel export file for all custom hooks.
 * Provides a centralized import point for better developer experience.
 */

// Data fetching hooks
export { useTrips } from "./useTrips";
export { useTrip } from "./useTrip";
export { useItineraryItems } from "./useItineraryItems";
export { useLocations } from "./useLocations";

// Dialog management hooks
export { useEditDialog } from "./useEditDialog";
export { useDetailsDialog } from "./useDetailsDialog";
export { useDeleteConfirmation } from "./useDeleteConfirmation";

// Form and utility hooks
export { useFormSubmit } from "./useFormSubmit";
export { useTripTimezone } from "./useTripTimezone";
