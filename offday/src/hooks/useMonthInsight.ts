import { useEffect, useState } from "react";
import { Holiday } from "../interface";
import { generateMonthInsight } from "../services/monthInsightService";
import { buildGenericMonthInsight } from "../utils/buildGenericMonthInsight";
import { buildYearHolidayStats } from "../utils/buildYearHolidayStats";

type UseMonthInsightParams = {
  month: number;
  year: number;
  countryCode: string;
  yearHolidays: Holiday[];
  holidaysReady: boolean;
  holidaysError: string | null;
};

/**
 * Muestra al instante un dato local con los festivos del mes.
 * Si la IA responde a tiempo, lo reemplaza por el insight generado.
 */
export function useMonthInsight({
  month,
  year,
  countryCode,
  yearHolidays,
  holidaysReady,
  holidaysError,
}: UseMonthInsightParams) {
  const [insight, setInsight] = useState<string | null>(null);

  useEffect(() => {
    if (!holidaysReady || holidaysError) {
      setInsight(null);
      return;
    }

    const controller = new AbortController();
    const stats = buildYearHolidayStats(
      yearHolidays,
      countryCode,
      year,
      month
    );

    // Siempre hay contenido: con 0 o N festivos el genérico usa los stats locales.
    setInsight(buildGenericMonthInsight(stats));

    generateMonthInsight(stats, controller.signal)
      .then((text) => {
        if (!controller.signal.aborted && text.trim()) {
          setInsight(text.trim());
        }
      })
      .catch((err) => {
        // Abort o fallo de IA: nos quedamos con el dato local ya visible.
        if (
          controller.signal.aborted ||
          (err instanceof Error && err.name === "AbortError")
        ) {
          return;
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

  return { insight };
}
