/**
 * Constants for location categories and their visual representation.
 */

import type { LocationCategory } from "@itinavi/schema";

/**
 * All available location categories.
 * Used for categorizing saved places, restaurants, hotels, etc.
 */
export const LOCATION_CATEGORIES: LocationCategory[] = [
  "Place",
  "Restaurant",
  "Accommodation",
  "TransportNode",
  "Shop",
  "Other",
];

/**
 * Maps location categories to Material-UI chip colors.
 * Provides visual distinction between different location types.
 */
export const LOCATION_CATEGORY_COLORS: Record<
  LocationCategory,
  "primary" | "secondary" | "success" | "error" | "warning" | "info"
> = {
  Place: "primary",
  Restaurant: "error",
  Accommodation: "success",
  TransportNode: "info",
  Shop: "warning",
  Other: "secondary",
};
