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

export const ITINERARY_TYPES: ItineraryItemType[] = [
  "Flight",
  "Transport",
  "Accommodation",
  "PlaceVisit",
  "Food",
];

export const TRANSPORT_MODES: TransportMode[] = [
  "Metro",
  "Bus",
  "Taxi",
  "Didi",
  "Train",
  "Walk",
  "Other",
];

export const ITINERARY_STATUSES: ItineraryStatus[] = [
  "Planned",
  "Booked",
  "Done",
  "Skipped",
];

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

export const ITINERARY_STATUS_COLORS: Record<
  ItineraryStatus,
  "default" | "primary" | "success" | "error"
> = {
  Planned: "default",
  Booked: "primary",
  Done: "success",
  Skipped: "error",
};
