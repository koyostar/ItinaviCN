/**
 * Constants for location categories and their visual representation.
 */

import { categoryColors, getContrastColor } from "@/lib/theme";
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
 * Maps location categories to hex colors from theme.
 * Provides visual distinction between different location types.
 */
export const LOCATION_CATEGORY_COLORS: Record<LocationCategory, string> = {
  Place: categoryColors.location.place,
  Restaurant: categoryColors.location.restaurant,
  Accommodation: categoryColors.location.accommodation,
  TransportNode: categoryColors.location.transportNode,
  Shop: categoryColors.location.shop,
  Other: categoryColors.location.other,
};

/**
 * Get chip sx props for location category
 */
export const getLocationCategoryChipSx = (category: LocationCategory) => ({
  backgroundColor: LOCATION_CATEGORY_COLORS[category],
  color: getContrastColor(LOCATION_CATEGORY_COLORS[category]),
  fontWeight: 600,
});
