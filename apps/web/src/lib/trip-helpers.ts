import type { TripRole } from "@itinavi/schema";
import type { User } from "@/hooks/useShareTripDialog";

/**
 * Role color mapping for Material-UI Chip components
 */
export const ROLE_COLORS: Record<TripRole, "error" | "primary" | "default"> = {
  OWNER: "error",
  EDITOR: "primary",
  VIEWER: "default",
};

/**
 * Human-readable role labels
 */
export const ROLE_LABELS: Record<TripRole, string> = {
  OWNER: "Owner",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

/**
 * Role permission descriptions
 */
export const ROLE_DESCRIPTIONS: Record<TripRole, string> = {
  OWNER: "Full control (manage members, delete trip)",
  EDITOR: "Can modify itinerary, locations, and expenses",
  VIEWER: "Can only view trip details",
};

/**
 * Get user's display name (prefers displayName, falls back to username)
 */
export function getUserDisplayName(user: User): string {
  return user.displayName || user.username;
}

/**
 * Get formatted user identifier (e.g., "John Doe (@johndoe)")
 */
export function getUserIdentifier(user: User): string {
  return `${getUserDisplayName(user)} (@${user.username})`;
}
