import { YearHolidayStats } from "../interface/monthInsight";
import {
  getDeviceLanguageCode,
  getDeviceLocale,
} from "../utils/getDeviceLocale";
import { getApiBaseUrl } from "../utils/apiConfig";

const insightCache = new Map<string, string>();

/** Construye una clave local para reutilizar respuestas ya obtenidas del backend. */
function getCacheKey(stats: YearHolidayStats, locale: string): string {
  return [
    stats.countryCode,
    stats.year,
    stats.selectedMonth,
    locale,
  ].join("-");
}

/** Solicita al backend el dato curioso del mes y lo cachea en memoria. */
export async function generateMonthInsight(
  stats: YearHolidayStats,
  signal?: AbortSignal
): Promise<string> {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error("API_URL_MISSING");
  }

  const locale = getDeviceLocale();
  const languageCode = getDeviceLanguageCode();
  const cacheKey = getCacheKey(stats, locale);
  const cached = insightCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await fetch(`${apiBaseUrl}/api/month-insight`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stats, locale, languageCode }),
    signal,
  });

  const data = (await response.json().catch(() => null)) as {
    insight?: string;
    error?: string;
  } | null;

  if (!response.ok) {
    throw new Error(data?.error || "API_REQUEST_FAILED");
  }

  const insight = data?.insight?.trim();

  if (!insight) {
    throw new Error("OPENAI_EMPTY_RESPONSE");
  }

  insightCache.set(cacheKey, insight);
  return insight;
}
