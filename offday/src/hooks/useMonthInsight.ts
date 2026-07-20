import { useEffect, useState } from "react";
import { Holiday } from "../interface";
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

/** Genera el insight únicamente cuando los festivos corresponden al filtro activo. */
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

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setInsight(null);

    const stats = buildYearHolidayStats(
      yearHolidays,
      countryCode,
      year,
      month
    );

    generateMonthInsight(stats, controller.signal)
      .then((text) => {
        if (!controller.signal.aborted) {
          setInsight(text);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          const code = err instanceof Error ? err.message : "UNKNOWN";
          setError(code);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
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
