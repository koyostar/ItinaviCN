/**
 * Converts a local date string (YYYY-MM-DD) to UTC datetime at start of day
 * @param dateString - Date in format YYYY-MM-DD
 * @returns ISO 8601 UTC datetime string
 */
export function localDateToUTC(dateString: string, endOfDay = false): string {
  // Parse as local date
  const [year, month, day] = dateString.split('-').map(Number);
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
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
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
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  const date = new Date(utcDatetime);
  return date.toLocaleDateString(locale, options);
}
