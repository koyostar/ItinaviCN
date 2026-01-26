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
export const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: "Asia/Shanghai", label: "(UTC+8) China" },
  { value: "Asia/Singapore", label: "(UTC+8) Singapore" },
  { value: "Asia/Tokyo", label: "(UTC+9) Japan" },
  { value: "Asia/Hong_Kong", label: "(UTC+8) Hong Kong" },
  { value: "Asia/Seoul", label: "(UTC+9) South Korea" },
  { value: "Asia/Bangkok", label: "(UTC+7) Thailand" },
  { value: "Europe/London", label: "(UTC+0) UK" },
  { value: "Europe/Paris", label: "(UTC+1) France" },
  { value: "America/New_York", label: "(UTC-5) US East" },
  { value: "America/Los_Angeles", label: "(UTC-8) US West" },
  { value: "Australia/Sydney", label: "(UTC+11) Australia" },
];

/**
 * Mapping of country names to their primary timezone.
 * Used to automatically set default timezones based on trip destinations.
 */
const COUNTRY_TIMEZONES: Record<string, string> = {
  Singapore: "Asia/Singapore",
  Japan: "Asia/Tokyo",
  "Hong Kong": "Asia/Hong_Kong",
  "South Korea": "Asia/Seoul",
  Thailand: "Asia/Bangkok",
  China: "Asia/Shanghai",
};

/**
 * Get the default timezone for a given country.
 *
 * @param {string} country - The country name (e.g., "China", "Singapore")
 * @returns {string} IANA timezone identifier, defaults to "Asia/Shanghai" if country not found
 *
 * @example
 * ```typescript
 * const timezone = getTimezoneForCountry("Japan"); // Returns "Asia/Tokyo"
 * const fallback = getTimezoneForCountry("Unknown"); // Returns "Asia/Shanghai"
 * ```
 */
export function getTimezoneForCountry(country: string): string {
  return COUNTRY_TIMEZONES[country] || "Asia/Shanghai";
}

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
export function getUTCOffset(timezone: string): string {
  try {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(
      date.toLocaleString("en-US", { timeZone: timezone }),
    );
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    const sign = offset >= 0 ? "+" : "";
    return `UTC${sign}${offset}`;
  } catch {
    return timezone;
  }
}
