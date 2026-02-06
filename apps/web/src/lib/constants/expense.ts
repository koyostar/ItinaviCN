import type { ExpenseCategory } from "@itinavi/schema";
import {
  Attractions as AttractionIcon,
  Restaurant as FoodIcon,
  Hotel as HotelIcon,
  MoreHoriz as OtherIcon,
  ShoppingBag as ShopIcon,
  DirectionsBus as TransportIcon,
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
  "primary" | "secondary" | "success" | "error" | "warning" | "info" | "default"
> = {
  Accommodation: "primary",
  Transport: "info",
  Food: "warning",
  Shop: "secondary",
  Attraction: "success",
  Other: "default",
};

/**
 * Icon color mapping for expense categories (MUI SvgIcon colors)
 */
export const EXPENSE_CATEGORY_ICON_COLORS: Record<
  ExpenseCategory,
  "primary" | "secondary" | "success" | "error" | "warning" | "info" | "action"
> = {
  Accommodation: "primary",
  Transport: "info",
  Food: "warning",
  Shop: "secondary",
  Attraction: "success",
  Other: "action",
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
