import type { LocationCategory } from "@itinavi/schema";

export const LOCATION_CATEGORIES: LocationCategory[] = [
  'Place',
  'Restaurant',
  'Accommodation',
  'TransportNode',
  'Shop',
  'Other',
];

export const LOCATION_CATEGORY_COLORS: Record<LocationCategory, 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'> = {
  Place: 'primary',
  Restaurant: 'error',
  Accommodation: 'success',
  TransportNode: 'info',
  Shop: 'warning',
  Other: 'secondary',
};
