import { getExchangeRate } from "@/lib/exchangeRate";
import { useCallback, useState } from "react";

interface UseExchangeRateReturn {
  rate: number | null;
  loading: boolean;
  error: string | null;
  fetchRate: (
    baseCurrency: string,
    targetCurrency: string,
    date?: string,
  ) => Promise<number | null>;
  clearRate: () => void;
}

/**
 * Hook to fetch exchange rates based on currency pair and date
 * @returns Object with rate, loading state, error, and fetch function
 */
export function useExchangeRate(): UseExchangeRateReturn {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = useCallback(
    async (baseCurrency: string, targetCurrency: string, date?: string) => {
      // Don't fetch if currencies are the same
      if (baseCurrency === targetCurrency) {
        setRate(1);
        setError(null);
        return 1;
      }

      try {
        setLoading(true);
        setError(null);

        const fetchedRate = await getExchangeRate(
          baseCurrency,
          targetCurrency,
          date,
        );

        if (fetchedRate === null) {
          throw new Error("Unable to fetch exchange rate");
        }

        setRate(fetchedRate);
        return fetchedRate;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch exchange rate";
        setError(errorMessage);
        setRate(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearRate = useCallback(() => {
    setRate(null);
    setError(null);
  }, []);

  return {
    rate,
    loading,
    error,
    fetchRate,
    clearRate,
  };
}
