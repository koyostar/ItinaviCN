// Exchange rate API service using Frankfurter API (free, open-source, CORS-enabled)
// https://www.frankfurter.app/
const EXCHANGE_RATE_API = "https://api.frankfurter.app";

export interface ExchangeRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

/**
 * Fetch exchange rate for a specific date
 * @param baseCurrency - The base currency code (e.g., 'CNY')
 * @param targetCurrency - The target currency code (e.g., 'SGD')
 * @param date - The date in YYYY-MM-DD format (optional, defaults to latest)
 * @returns The exchange rate as a number
 */
export async function getExchangeRate(
  baseCurrency: string,
  targetCurrency: string,
  date?: string
): Promise<number | null> {
  try {
    // Use historical endpoint if date is provided, otherwise use latest
    const endpoint = date
      ? `${EXCHANGE_RATE_API}/${date}?from=${baseCurrency}&to=${targetCurrency}`
      : `${EXCHANGE_RATE_API}/latest?from=${baseCurrency}&to=${targetCurrency}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data: ExchangeRateResponse = await response.json();

    if (data.rates[targetCurrency]) {
      return data.rates[targetCurrency];
    }

    return null;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}

/**
 * Format exchange rate for display
 */
export function formatExchangeRate(rate: number): string {
  return rate.toFixed(4);
}
