/**
 * Base URL for API requests. Defaults to localhost in development.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Get the authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("itinavi_token");
}

/**
 * Custom error class for API-related errors.
 * Extends the standard Error class with HTTP status code and response data.
 */
export class ApiError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} status - HTTP status code (e.g., 404, 500)
   * @param {unknown} data - Additional error data from the API response
   */
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Internal helper function to make authenticated API requests.
 *
 * Handles JSON serialization, error responses, and returns typed data.
 * All API methods use this function internally.
 *
 * @template T - The expected response type
 * @param {string} endpoint - API endpoint path (e.g., "/api/trips")
 * @param {RequestInit} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<T>} Typed API response data
 * @throws {ApiError} If the API request fails
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || "An error occurred",
      response.status,
      errorData
    );
  }

  // Handle empty responses (e.g., 204 No Content for DELETE operations)
  const contentLength = response.headers.get("content-length");
  if (contentLength === "0" || response.status === 204) {
    return undefined as T;
  }

  // Check if response has content before parsing JSON
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text);
}

/**
 * Main API client object with methods for all backend endpoints.
 *
 * Organized by resource type (trips, locations, itinerary, expenses).
 * All methods return Promises and throw ApiError on failure.
 *
 * @example
 * ```typescript
 * // Fetch all trips
 * const trips = await api.trips.list();
 *
 * // Create a new trip
 * const newTrip = await api.trips.create({
 *   title: "Tokyo Adventure",
 *   startDate: "2026-06-01",
 *   endDate: "2026-06-10"
 * });
 *
 * // Update a trip
 * await api.trips.update(tripId, { title: "Updated Title" });
 *
 * // Delete a trip
 * await api.trips.delete(tripId);
 * ```
 */
export const api = {
  /**
   * Trip management endpoints
   */
  trips: {
    /** Fetch all trips for the current user */
    list: () => fetchApi("/api/trips"),
    /** Fetch a single trip by ID */
    get: (tripId: string) => fetchApi(`/api/trips/${tripId}`),
    /** Create a new trip */
    create: (data: unknown) =>
      fetchApi("/api/trips", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    /** Update an existing trip */
    update: (tripId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    /** Delete a trip */
    delete: (tripId: string) =>
      fetchApi(`/api/trips/${tripId}`, {
        method: "DELETE",
      }),
  },

  /**
   * Location (places of interest) endpoints
   */
  locations: {
    /** Fetch all locations for a trip */
    list: (tripId: string) => fetchApi(`/api/trips/${tripId}/locations`),
    /** Fetch a single location by ID */
    get: (tripId: string, locationId: string) =>
      fetchApi(`/api/trips/${tripId}/locations/${locationId}`),
    /** Create a new location for a trip */
    create: (tripId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}/locations`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    /** Update an existing location */
    update: (tripId: string, locationId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}/locations/${locationId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    /** Delete a location */
    delete: (tripId: string, locationId: string) =>
      fetchApi(`/api/trips/${tripId}/locations/${locationId}`, {
        method: "DELETE",
      }),
  },

  /**
   * Itinerary item endpoints (flights, accommodations, activities, etc.)
   */
  itinerary: {
    /** Fetch all itinerary items for a trip */
    list: (tripId: string) => fetchApi(`/api/trips/${tripId}/itinerary`),
    /** Fetch a single itinerary item by ID */
    get: (tripId: string, itemId: string) =>
      fetchApi(`/api/trips/${tripId}/itinerary/${itemId}`),
    /** Create a new itinerary item */
    create: (tripId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}/itinerary`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    /** Update an existing itinerary item */
    update: (tripId: string, itemId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}/itinerary/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    /** Delete an itinerary item */
    delete: (tripId: string, itemId: string) =>
      fetchApi(`/api/trips/${tripId}/itinerary/${itemId}`, {
        method: "DELETE",
      }),
    /** Sync itinerary addresses to locations */
    syncLocations: (tripId: string) =>
      fetchApi(`/api/trips/${tripId}/itinerary/sync-locations`, {
        method: "POST",
      }),
  },

  /**
   * Expense tracking endpoints
   */
  expenses: {
    /** Fetch all expenses for a trip */
    list: (tripId: string) => fetchApi(`/api/trips/${tripId}/expenses`),
    /** Fetch a single expense by ID */
    get: (tripId: string, expenseId: string) =>
      fetchApi(`/api/trips/${tripId}/expenses/${expenseId}`),
    /** Create a new expense */
    create: (tripId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}/expenses`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    /** Update an existing expense */
    update: (tripId: string, expenseId: string, data: unknown) =>
      fetchApi(`/api/trips/${tripId}/expenses/${expenseId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    /** Delete an expense */
    delete: (tripId: string, expenseId: string) =>
      fetchApi(`/api/trips/${tripId}/expenses/${expenseId}`, {
        method: "DELETE",
      }),
  },

  /**
   * Authentication endpoints
   */
  auth: {
    /** Get current user profile */
    me: () => fetchApi("/auth/me"),
    /** Update user profile */
    updateProfile: (data: unknown) =>
      fetchApi("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    /** Change password */
    changePassword: (data: unknown) =>
      fetchApi("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    /** Get all users (dev only) */
    getAllUsers: () => fetchApi("/auth/users"),
    /** Reset user password to default (dev only) */
    devResetPassword: (userId: string) =>
      fetchApi("/auth/dev-reset-password", {
        method: "POST",
        body: JSON.stringify({ userId }),
      }),
  },
};
