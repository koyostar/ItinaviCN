"use client";

import { createTheme } from "@mui/material/styles";

// Contrast text colors - exported for use in constants
export const contrastColors = {
  light: "#fafffd", // porcelain - for dark backgrounds
  dark: "#48284a", // blackberryCream - for light backgrounds
};

// Dark background colors that need light text
const darkBackgrounds: string[] = [
  // All category colors use light text (richer, darker tones)
  "#5da89b",
  "#4a7ba7",
  "#d99547",
  "#9a6c89",
  "#b8624a",
  "#758a5f",
  "#3d6a8f",
  "#8892a6",
  "#5896c4",
  "#5e7a48",
];

/**
 * Get appropriate contrast text color for a given background color
 */
export const getContrastColor = (bgColor: string): string => {
  return darkBackgrounds.includes(bgColor)
    ? contrastColors.light
    : contrastColors.dark;
};

// Custom category colors - exported for use in constants
export const categoryColors = {
  // Expense categories
  expense: {
    accommodation: "#5da89b", // teal (restful, accommodation)
    transport: "#4a7ba7", // medium blue (movement, travel)
    food: "#d99547", // amber gold (food warmth)
    shop: "#9a6c89", // deep mauve (shopping luxury)
    attraction: "#b8624a", // burnt terracotta (cultural, earthy)
    other: "#758a5f", // forest olive (neutral, versatile)
  },
  // Itinerary item types
  itinerary: {
    flight: "#3d6a8f", // deep blue (sky, flight)
    transport: "#4a7ba7", // medium blue (movement, travel)
    accommodation: "#5da89b", // teal (restful, accommodation)
    place: "#b8624a", // burnt terracotta (cultural, earthy)
    food: "#d99547", // amber gold (food warmth)
  },
  // Itinerary status
  status: {
    planned: "#8892a6", // slate grey (planning stage)
    booked: "#5896c4", // ocean blue (confirmed)
    done: "#5e7a48", // forest green (completed)
    skipped: "#b8624a", // rust coral (cancelled)
  },
  // Location categories
  location: {
    place: "#b8624a", // burnt terracotta (cultural, earthy)
    restaurant: "#d99547", // amber gold (food warmth) - matches food
    accommodation: "#5da89b", // teal (restful, accommodation)
    transport: "#4a7ba7", // medium blue (movement, travel) - matches transport
    shop: "#9a6c89", // deep mauve (shopping luxury)
    other: "#758a5f", // forest olive (neutral, versatile)
  },
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#48284a",
      light: "#6d4a6f",
      dark: "#2f1a31",
      contrastText: "#fafffd",
    },
    secondary: {
      main: "#ffa69e",
      light: "#ffbfb8",
      dark: "#ff7e6f",
      contrastText: "#48284a",
    },
    success: {
      main: "#b6c8a9",
      light: "#d4e2ca",
      dark: "#8faa7a",
      contrastText: "#48284a",
    },
    info: {
      main: "#7e7f9a",
      light: "#a8a9bf",
      dark: "#5e5f7a",
      contrastText: "#fafffd",
    },
    warning: {
      main: "#ffb74d",
      light: "#ffcc80",
      dark: "#f57c00",
      contrastText: "#48284a",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#fafffd",
    },
    background: {
      default: "#fafffd",
      paper: "#ffffff",
    },
    text: {
      primary: "#48284a",
      secondary: "#7e7f9a",
      disabled: "#b0b0b0",
    },
    divider: "#b6c8a9",
  },
  categoryColors,
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(72, 40, 74, 0.2)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 2px 8px rgba(72, 40, 74, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Augment the Theme interface to include custom category colors
declare module "@mui/material/styles" {
  interface Theme {
    categoryColors: {
      expense: {
        accommodation: string;
        transport: string;
        food: string;
        shop: string;
        attraction: string;
        other: string;
      };
      itinerary: {
        flight: string;
        transport: string;
        accommodation: string;
        place: string;
        food: string;
      };
      status: {
        planned: string;
        booked: string;
        done: string;
        skipped: string;
      };
      location: {
        place: string;
        restaurant: string;
        accommodation: string;
        transport: string;
        shop: string;
        other: string;
      };
    };
  }

  interface ThemeOptions {
    categoryColors?: {
      expense?: {
        accommodation?: string;
        transport?: string;
        food?: string;
        shop?: string;
        attraction?: string;
        other?: string;
      };
      itinerary?: {
        flight?: string;
        transport?: string;
        accommodation?: string;
        place?: string;
        food?: string;
      };
      status?: {
        planned?: string;
        booked?: string;
        done?: string;
        skipped?: string;
      };
      location?: {
        place?: string;
        restaurant?: string;
        accommodation?: string;
        transport?: string;
        shop?: string;
        other?: string;
      };
    };
  }
}
