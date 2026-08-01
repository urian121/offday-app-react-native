import {
  Holiday,
  HolidayLocalNameSource,
  HolidayQueryParams,
} from "../interface";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";
import { getDeviceLanguageCode } from "../utils/getDeviceLocale";
import { NAGER_V3_BASE_URL, NAGER_V4_BASE_URL } from "../utils/nagerConfig";
import { reportNagerFailure } from "./nagerAlertService";

const localNamesCache = new Map<string, Map<string, string>>();

/** Obtiene el calendario anual canónico desde Nager.Date v4. */
async function fetchV4YearHolidays(
  countryCode: string,
  year: number,
  signal?: AbortSignal
): Promise<Holiday[]> {
  const url = `${NAGER_V4_BASE_URL}/${countryCode.toUpperCase()}/${year}`;

  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      reportNagerFailure({
        source: "v4",
        countryCode,
        year,
        status: response.status,
        message: `Error al obtener festivos: ${response.status}`,
      });
      throw new Error(`Error al obtener festivos: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    if (
      !(
        error instanceof Error &&
        error.message.startsWith("Error al obtener festivos:")
      )
    ) {
      reportNagerFailure({
        source: "v4",
        countryCode,
        year,
        message: error instanceof Error ? error.message : "NETWORK_ERROR",
      });
    }

    throw error;
  }
}

/** Obtiene y cachea nombres locales de v3 sin bloquear los datos v4. */
async function fetchLocalNamesMap(
  countryCode: string,
  year: number,
  signal?: AbortSignal
): Promise<Map<string, string>> {
  const code = countryCode.toUpperCase();
  const cacheKey = `${code}-${year}`;
  const cached = localNamesCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const url = `${NAGER_V3_BASE_URL}/${year}/${code}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      reportNagerFailure({
        source: "v3",
        countryCode: code,
        year,
        status: response.status,
        message: `Error al obtener nombres locales: ${response.status}`,
      });
      return new Map();
    }

    const data: HolidayLocalNameSource[] = await response.json();
    const localNames = new Map(
      data.map((holiday) => [holiday.date, holiday.localName])
    );

    localNamesCache.set(cacheKey, localNames);
    return localNames;
  } catch (error) {
    if (!(error instanceof Error && error.name === "AbortError")) {
      reportNagerFailure({
        source: "v3",
        countryCode: code,
        year,
        message: error instanceof Error ? error.message : "NETWORK_ERROR",
      });
    }

    return new Map();
  }
}

/** Enriquece los festivos v4 con nombres locales de v3, unidos por fecha. */
async function fetchYearHolidays(
  countryCode: string,
  year: number,
  signal?: AbortSignal
): Promise<Holiday[]> {
  const code = countryCode.toUpperCase();
  const languageCode = getDeviceLanguageCode();

  // En inglés la UI usa `name` de v4; omitimos v3 para ahorrar una petición.
  if (languageCode === "en") {
    const v4Holidays = await fetchV4YearHolidays(code, year, signal);
    return v4Holidays.map((holiday) => ({
      ...holiday,
      localName: null,
    }));
  }

  const [v4Holidays, localNames] = await Promise.all([
    fetchV4YearHolidays(code, year, signal),
    fetchLocalNamesMap(code, year, signal),
  ]);

  return v4Holidays.map((holiday) => ({
    ...holiday,
    localName: localNames.get(holiday.date) ?? null,
  }));
}

/** Devuelve todos los festivos de un país y año con su nombre local opcional. */
export async function getHolidaysForYear(
  params: Partial<Pick<HolidayQueryParams, "countryCode" | "year">> = {},
  signal?: AbortSignal
): Promise<Holiday[]> {
  const { countryCode, year } = {
    ...getDefaultHolidayQueryParams(),
    ...params,
  };

  return fetchYearHolidays(countryCode, year, signal);
}
