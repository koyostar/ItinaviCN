export interface TimezoneOption {
  value: string;
  label: string;
}

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
 * Get UTC offset for a timezone (e.g., "Asia/Shanghai" -> "UTC+8")
 */
export function getUTCOffset(timezone: string): string {
  try {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    const sign = offset >= 0 ? '+' : '';
    return `UTC${sign}${offset}`;
  } catch {
    return timezone;
  }
}
