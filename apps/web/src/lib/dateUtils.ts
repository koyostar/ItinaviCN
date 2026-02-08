/**
 * Date and time utility functions
 */

/**
 * Converts a local date string (YYYY-MM-DD) to UTC datetime at start of day
 * @param dateString - Date in format YYYY-MM-DD
 * @param endOfDay - If true, sets time to end of day (23:59:59.999)
 * @returns ISO 8601 UTC datetime string
 */
export function localDateToUTC(dateString: string, endOfDay = false): string {
  // Parse as local date
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date.toISOString();
}

/**
 * Extracts the local date from a UTC datetime string
 * @param utcDatetime - ISO 8601 UTC datetime string
 * @returns Local date in format YYYY-MM-DD
 */
export function utcToLocalDate(utcDatetime: string): string {
  const date = new Date(utcDatetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a UTC datetime string to local date display
 * @param utcDatetime - ISO 8601 UTC datetime string
 * @param locale - Locale for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatUTCDate(
  utcDatetime: string,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  const date = new Date(utcDatetime);
  return date.toLocaleDateString(locale, options);
}

/**
 * Formats a UTC datetime string to local time display
 * @param utcDatetime - ISO 8601 UTC datetime string
 * @param locale - Locale for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted time string
 */
export function formatUTCTime(
  utcDatetime: string,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }
): string {
  const date = new Date(utcDatetime);
  return date.toLocaleTimeString(locale, options);
}

/**
 * Formats a UTC datetime string to local datetime display
 * @param utcDatetime - ISO 8601 UTC datetime string
 * @param locale - Locale for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted datetime string
 */
export function formatUTCDateTime(
  utcDatetime: string,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
): string {
  const date = new Date(utcDatetime);
  return date.toLocaleString(locale, options);
}

/**
 * Converts a UTC datetime to datetime-local input format (YYYY-MM-DDTHH:mm)
 * @param utcDatetime - ISO 8601 UTC datetime string
 * @returns Datetime string in format YYYY-MM-DDTHH:mm for datetime-local inputs
 */
export function utcToDateTimeLocal(utcDatetime: string): string {
  return new Date(utcDatetime).toISOString().slice(0, 16);
}

/**
 * Converts a UTC datetime to datetime-local input format in a specific timezone
 * @param utcDatetime - ISO 8601 UTC datetime string
 * @param timezone - IANA timezone name (e.g., 'Asia/Shanghai')
 * @returns Datetime string in format YYYY-MM-DDTHH:mm for datetime-local inputs
 */
export function utcToDateTimeLocalInTimezone(
  utcDatetime: string,
  timezone: string
): string {
  const date = new Date(utcDatetime);

  // Get the date parts in the target timezone
  const year = date.toLocaleString("en-US", {
    timeZone: timezone,
    year: "numeric",
  });
  const month = date.toLocaleString("en-US", {
    timeZone: timezone,
    month: "2-digit",
  });
  const day = date.toLocaleString("en-US", {
    timeZone: timezone,
    day: "2-digit",
  });
  const hour = date.toLocaleString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    hour12: false,
  });
  const minute = date.toLocaleString("en-US", {
    timeZone: timezone,
    minute: "2-digit",
  });

  // Format as YYYY-MM-DDTHH:mm
  return `${year}-${month}-${day}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

/**
 * Converts a datetime-local input value to UTC ISO string
 * Assumes the input is in browser's local timezone
 * @param datetimeLocal - Datetime string in format YYYY-MM-DDTHH:mm
 * @returns ISO 8601 UTC datetime string
 */
export function dateTimeLocalToUTC(datetimeLocal: string): string {
  return new Date(datetimeLocal).toISOString();
}

/**
 * Calculates the duration between two datetime strings
 * @param startDateTime - ISO 8601 datetime string
 * @param endDateTime - ISO 8601 datetime string
 * @returns Duration in format "Xh Ym" or empty string if endDateTime is null
 */
export function calculateDuration(
  startDateTime: string,
  endDateTime: string | null
): string {
  if (!endDateTime) return "";

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

/**
 * Calculates the number of days between two dates (inclusive)
 * @param startDate - ISO 8601 date string
 * @param endDate - ISO 8601 date string
 * @returns Number of days (inclusive, so same day = 1)
 */
export function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return days + 1; // +1 to make it inclusive
}
