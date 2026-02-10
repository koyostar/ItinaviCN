/**
 * Location and timezone constants shared across frontend and backend.
 * This file contains reference data for countries, cities, and timezones
 * commonly used in the application.
 */
/**
 * Location data with English (standardized) and Chinese names
 */
export interface LocationData {
    en: string;
    zh: string;
}
/**
 * Supported countries with bilingual names
 */
export declare const COUNTRIES: Record<string, LocationData>;
/**
 * Cities by country with bilingual names
 * Key is the standardized English country name
 */
export declare const CITIES: Record<string, Record<string, LocationData>>;
/**
 * Search function to find locations by either English or Chinese name
 */
export declare function searchLocations(query: string, locations: Record<string, LocationData>): Array<{
    key: string;
    data: LocationData;
}>;
/**
 * Get display name based on language preference
 */
export declare function getDisplayName(locationData: LocationData, language: "en" | "zh"): string;
/**
 * Find standardized key from either English or Chinese input
 */
export declare function findLocationKey(input: string, locations: Record<string, LocationData>): string | null;
/**
 * Timezone option for dropdown/select components
 */
export interface TimezoneOption {
    /** IANA timezone identifier (e.g., "Asia/Shanghai") */
    value: string;
    /** Human-readable label with UTC offset and region (e.g., "(UTC+8) China") */
    label: string;
}
/**
 * List of commonly used timezones for the application.
 * Primarily focused on Asian and Western regions.
 */
export declare const COMMON_TIMEZONES: TimezoneOption[];
/**
 * Mapping of country names to their primary timezone.
 * Used to automatically set default timezones based on trip destinations.
 */
export declare const COUNTRY_TIMEZONES: Record<string, string>;
/**
 * Get the default timezone for a given country.
 *
 * @param {string} country - The country name (e.g., "China", "Singapore")
 * @returns {string} IANA timezone identifier, defaults to "Asia/Shanghai" if country not found
 */
export declare function getTimezoneForCountry(country: string): string;
/**
 * Calculate and format the UTC offset for a timezone.
 *
 * Converts IANA timezone identifiers to human-readable UTC offset format.
 * Handles both positive and negative offsets.
 *
 * @param {string} timezone - IANA timezone identifier (e.g., "Asia/Shanghai")
 * @returns {string} Formatted UTC offset (e.g., "UTC+8", "UTC-5") or original timezone on error
 *
 * @example
 * ```typescript
 * getUTCOffset("Asia/Shanghai"); // Returns "UTC+8"
 * getUTCOffset("America/New_York"); // Returns "UTC-5"
 * getUTCOffset("Invalid/Timezone"); // Returns "Invalid/Timezone"
 * ```
 */
export declare function getUTCOffset(timezone: string): string;
