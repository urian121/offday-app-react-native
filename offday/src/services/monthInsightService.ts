import { YearHolidayStats } from "../interface";
import {
  getDeviceLanguageCode,
  getDeviceLocale,
} from "../utils/getDeviceLocale";
import { getApiBaseUrl } from "../utils/apiConfig";

const insightCache = new Map<string, string>();
const MAX_ATTEMPTS = 2;

/** Construye una clave local para reutilizar respuestas ya obtenidas del backend. */
function getCacheKey(stats: YearHolidayStats, languageCode: string): string {
  return [
    stats.countryCode,
    stats.year,
    stats.selectedMonth,
    languageCode,
  ].join("-");
}

/** True si el fallo permite un reintento breve (red / IA intermitente). */
function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return true;
  }

  if (error.name === "AbortError") {
    return false;
  }

  return ![
    "API_URL_MISSING",
    "INVALID_REQUEST",
    "REPLICATE_API_TOKEN_MISSING",
    "REPLICATE_UNAUTHORIZED",
    "REPLICATE_NO_CREDITS",
  ].includes(error.message);
}

/** Una petición al backend; lanza códigos cortos si falla. */
async function requestMonthInsight(
  apiBaseUrl: string,
  stats: YearHolidayStats,
  locale: string,
  languageCode: string,
  signal?: AbortSignal
): Promise<string> {
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
    throw new Error("EMPTY_RESPONSE");
  }

  return insight;
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
  const cacheKey = getCacheKey(stats, languageCode);
  const cached = insightCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (signal?.aborted) {
      const aborted = new Error("Aborted");
      aborted.name = "AbortError";
      throw aborted;
    }

    try {
      const insight = await requestMonthInsight(
        apiBaseUrl,
        stats,
        locale,
        languageCode,
        signal
      );
      insightCache.set(cacheKey, insight);
      return insight;
    } catch (error) {
      lastError = error;

      if (
        attempt >= MAX_ATTEMPTS ||
        signal?.aborted ||
        !isRetryableError(error)
      ) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("UNKNOWN");
}
