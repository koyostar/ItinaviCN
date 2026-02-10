import { api } from "./api";
import type { LocationResponse } from "@itinavi/schema";

/**
 * Converts a location into a Place itinerary item
 * @param tripId - The trip ID
 * @param location - The location to add to itinerary
 * @param timezone - Optional timezone, defaults to "Asia/Shanghai"
 * @returns Promise that resolves when the itinerary item is created
 */
export async function addLocationToItinerary(
  tripId: string,
  location: LocationResponse,
  timezone: string = "Asia/Shanghai"
): Promise<void> {
  await api.itinerary.create(tripId, {
    type: "Place",
    title: location.name,
    startDateTime: new Date().toISOString(),
    timezone,
    locationId: location.id,
    details: {
      city: location.city || undefined,
      district: location.district || undefined,
      province: location.province || undefined,
      address: location.address || undefined,
      latitude: location.latitude || undefined,
      longitude: location.longitude || undefined,
      adcode: location.adcode || undefined,
      citycode: location.citycode || undefined,
      amapPoiId: location.amapPoiId || undefined,
    },
    notes: location.notes || undefined,
  });
}
