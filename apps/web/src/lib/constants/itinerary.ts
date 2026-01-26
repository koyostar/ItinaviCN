/**
 * Constants and configuration for itinerary items.
 * Includes types, statuses, transport modes, and UI mappings (icons, colors).
 */

import type {
  ItineraryItemType,
  TransportMode,
  ItineraryStatus,
} from "@itinavi/schema";
import FlightIcon from "@mui/icons-material/Flight";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import HotelIcon from "@mui/icons-material/Hotel";
import PlaceIcon from "@mui/icons-material/Place";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

/**
 * All available itinerary item types.
 * Used for filtering and type selection in forms.
 */
export const ITINERARY_TYPES: ItineraryItemType[] = [
  "Flight",
  "Transport",
  "Accommodation",
  "PlaceVisit",
  "Food",
];

/**
 * Available transport modes for Transport-type itinerary items.
 */
export const TRANSPORT_MODES: TransportMode[] = [
  "Metro",
  "Bus",
  "Taxi",
  "Didi",
  "Train",
  "Walk",
  "Other",
];

/**
 * Available status values for itinerary items.
 * Tracks progression from planning to completion.
 */
export const ITINERARY_STATUSES: ItineraryStatus[] = [
  "Planned",
  "Booked",
  "Done",
  "Skipped",
];

/**
 * Maps itinerary types to Material-UI icons.
 * Used for visual representation in cards and lists.
 */
export const ITINERARY_TYPE_ICONS: Record<
  ItineraryItemType,
  OverridableComponent<SvgIconTypeMap>
> = {
  Flight: FlightIcon,
  Transport: DirectionsBusIcon,
  Accommodation: HotelIcon,
  PlaceVisit: PlaceIcon,
  Food: RestaurantIcon,
};

/**
 * Maps itinerary types to Material-UI chip colors.
 * Provides visual distinction between different item types.
 */
export const ITINERARY_TYPE_COLORS: Record<
  ItineraryItemType,
  "primary" | "secondary" | "success" | "error" | "warning" | "info"
> = {
  Flight: "primary",
  Transport: "secondary",
  Accommodation: "info",
  PlaceVisit: "warning",
  Food: "success",
};

/**
 * Maps itinerary statuses to Material-UI chip colors.
 * Indicates progress state with appropriate color coding.
 */
export const ITINERARY_STATUS_COLORS: Record<
  ItineraryStatus,
  "default" | "primary" | "success" | "error"
> = {
  Planned: "default",
  Booked: "primary",
  Done: "success",
  Skipped: "error",
};
