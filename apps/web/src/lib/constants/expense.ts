import { categoryColors, getContrastColor } from "@/lib/theme";
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
 * Color mapping for expense categories (from theme)
 */
export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Accommodation: categoryColors.expense.accommodation,
  Transport: categoryColors.expense.transport,
  Food: categoryColors.expense.food,
  Shop: categoryColors.expense.shop,
  Attraction: categoryColors.expense.attraction,
  Other: categoryColors.expense.other,
};

/**
 * Get chip sx props for expense category
 */
export const getExpenseCategoryChipSx = (category: ExpenseCategory) => ({
  backgroundColor: EXPENSE_CATEGORY_COLORS[category],
  color: getContrastColor(EXPENSE_CATEGORY_COLORS[category]),
  fontWeight: 600,
});

/**
 * Get icon color for expense category
 */
export const getExpenseCategoryIconColor = (category: ExpenseCategory) =>
  EXPENSE_CATEGORY_COLORS[category];

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
