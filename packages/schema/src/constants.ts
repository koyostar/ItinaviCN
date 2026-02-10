/**
 * Location and timezone constants shared across frontend and backend.
 * This file contains reference data for countries, cities, and timezones
 * commonly used in the application.
 */

// ========================================
// Location Data
// ========================================

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
export const COUNTRIES: Record<string, LocationData> = {
  China: { en: "China", zh: "中国" },
  Japan: { en: "Japan", zh: "日本" },
  "South Korea": { en: "South Korea", zh: "韩国" },
  Thailand: { en: "Thailand", zh: "泰国" },
  Vietnam: { en: "Vietnam", zh: "越南" },
  Singapore: { en: "Singapore", zh: "新加坡" },
  Malaysia: { en: "Malaysia", zh: "马来西亚" },
  Indonesia: { en: "Indonesia", zh: "印度尼西亚" },
};

/**
 * Cities by country with bilingual names
 * Key is the standardized English country name
 */
export const CITIES: Record<string, Record<string, LocationData>> = {
  China: {
    Beijing: { en: "Beijing", zh: "北京" },
    Shanghai: { en: "Shanghai", zh: "上海" },
    Guangzhou: { en: "Guangzhou", zh: "广州" },
    Shenzhen: { en: "Shenzhen", zh: "深圳" },
    Chengdu: { en: "Chengdu", zh: "成都" },
    Chongqing: { en: "Chongqing", zh: "重庆" },
    Hangzhou: { en: "Hangzhou", zh: "杭州" },
    Wuhan: { en: "Wuhan", zh: "武汉" },
    Xian: { en: "Xian", zh: "西安" },
    Suzhou: { en: "Suzhou", zh: "苏州" },
    Nanjing: { en: "Nanjing", zh: "南京" },
    Qingdao: { en: "Qingdao", zh: "青岛" },
    Dalian: { en: "Dalian", zh: "大连" },
    Xiamen: { en: "Xiamen", zh: "厦门" },
    Kunming: { en: "Kunming", zh: "昆明" },
    Sanya: { en: "Sanya", zh: "三亚" },
    Guilin: { en: "Guilin", zh: "桂林" },
    Lijiang: { en: "Lijiang", zh: "丽江" },
    Lhasa: { en: "Lhasa", zh: "拉萨" },
    Harbin: { en: "Harbin", zh: "哈尔滨" },
  },
  Japan: {
    Tokyo: { en: "Tokyo", zh: "东京" },
    Osaka: { en: "Osaka", zh: "大阪" },
    Kyoto: { en: "Kyoto", zh: "京都" },
    Sapporo: { en: "Sapporo", zh: "札幌" },
    Fukuoka: { en: "Fukuoka", zh: "福冈" },
  },
  "South Korea": {
    Seoul: { en: "Seoul", zh: "首尔" },
    Busan: { en: "Busan", zh: "釜山" },
    Jeju: { en: "Jeju", zh: "济州" },
  },
  Thailand: {
    Bangkok: { en: "Bangkok", zh: "曼谷" },
    "Chiang Mai": { en: "Chiang Mai", zh: "清迈" },
    Phuket: { en: "Phuket", zh: "普吉" },
  },
  Vietnam: {
    Hanoi: { en: "Hanoi", zh: "河内" },
    "Ho Chi Minh": { en: "Ho Chi Minh", zh: "胡志明市" },
  },
  Singapore: {
    Singapore: { en: "Singapore", zh: "新加坡" },
  },
  Malaysia: {
    "Kuala Lumpur": { en: "Kuala Lumpur", zh: "吉隆坡" },
    Penang: { en: "Penang", zh: "槟城" },
  },
  Indonesia: {
    Jakarta: { en: "Jakarta", zh: "雅加达" },
    Bali: { en: "Bali", zh: "巴厘岛" },
  },
};

// ========================================
// Location Helper Functions
// ========================================

/**
 * Search function to find locations by either English or Chinese name
 */
export function searchLocations(
  query: string,
  locations: Record<string, LocationData>
): Array<{ key: string; data: LocationData }> {
  const lowerQuery = query.toLowerCase();
  return Object.entries(locations)
    .filter(([key, data]) => {
      return (
        key.toLowerCase().includes(lowerQuery) ||
        data.en.toLowerCase().includes(lowerQuery) ||
        data.zh.includes(query)
      );
    })
    .map(([key, data]) => ({ key, data }));
}

/**
 * Get display name based on language preference
 */
export function getDisplayName(
  locationData: LocationData,
  language: "en" | "zh"
): string {
  return language === "zh" ? locationData.zh : locationData.en;
}

/**
 * Find standardized key from either English or Chinese input
 */
export function findLocationKey(
  input: string,
  locations: Record<string, LocationData>
): string | null {
  // Direct key match
  if (locations[input]) return input;

  // Search for match in English or Chinese
  const found = Object.entries(locations).find(
    ([key, data]) =>
      key.toLowerCase() === input.toLowerCase() ||
      data.en.toLowerCase() === input.toLowerCase() ||
      data.zh === input
  );

  return found ? found[0] : null;
}

// ========================================
// Timezone Data
// ========================================

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
export const COUNTRY_TIMEZONES: Record<string, string> = {
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
      date.toLocaleString("en-US", { timeZone: timezone })
    );
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    const sign = offset >= 0 ? "+" : "";
    return `UTC${sign}${offset}`;
  } catch {
    return timezone;
  }
}
