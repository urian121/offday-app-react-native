import { useEffect, useState } from "react";
import { Holiday } from "../interface/holiday";
import { generateMonthInsight } from "../services/monthInsightService";
import { buildYearHolidayStats } from "../utils/buildYearHolidayStats";

type UseMonthInsightParams = {
  month: number;
  year: number;
  countryCode: string;
  yearHolidays: Holiday[];
  holidaysReady: boolean;
  holidaysError: string | null;
};

export function useMonthInsight({
  month,
  year,
  countryCode,
  yearHolidays,
  holidaysReady,
  holidaysError,
}: UseMonthInsightParams) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!holidaysReady || holidaysError) {
      setInsight(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setInsight(null);

    const stats = buildYearHolidayStats(
      yearHolidays,
      countryCode,
      year,
      month
    );

    generateMonthInsight(stats)
      .then((text) => {
        if (!cancelled) {
          setInsight(text);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const code = err instanceof Error ? err.message : "UNKNOWN";
          setError(code);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    month,
    year,
    countryCode,
    yearHolidays,
    holidaysReady,
    holidaysError,
  ]);

  return { insight, loading, error };
}
