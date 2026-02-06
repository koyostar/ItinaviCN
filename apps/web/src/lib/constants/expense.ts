import type { ExpenseCategory } from "@itinavi/schema";
import {
  Hotel as HotelIcon,
  DirectionsBus as TransportIcon,
  Restaurant as FoodIcon,
  ShoppingBag as ShopIcon,
  Attractions as AttractionIcon,
  MoreHoriz as OtherIcon,
} from "@mui/icons-material";

/**
 * Icon mapping for expense categories
 */
export const EXPENSE_CATEGORY_ICONS: Record<ExpenseCategory, typeof HotelIcon> =
  {
    Accommodation: HotelIcon,
    Transport: TransportIcon,
    Food: FoodIcon,
    Shop: ShopIcon,
    Attraction: AttractionIcon,
    Other: OtherIcon,
  };

/**
 * Color mapping for expense categories (MUI color palettes)
 */
export const EXPENSE_CATEGORY_COLORS: Record<
  ExpenseCategory,
  "primary" | "secondary" | "success" | "error" | "warning" | "info"
> = {
  Accommodation: "primary",
  Transport: "info",
  Food: "warning",
  Shop: "secondary",
  Attraction: "success",
  Other: "default" as any,
};

/**
 * Display labels for expense categories
 */
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  Accommodation: "Accommodation",
  Transport: "Transport",
  Food: "Food & Dining",
  Shop: "Shopping",
  Attraction: "Attractions",
  Other: "Other",
};
