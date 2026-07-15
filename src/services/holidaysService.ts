import {
  Holiday,
  HolidayLocalNameSource,
  HolidayQueryParams,
} from "../interface/holiday";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";

const V4_BASE_URL = "https://date.nager.at/api/v4/Holidays";
const V3_BASE_URL = "https://date.nager.at/api/v3/PublicHolidays";

const localNamesCache = new Map<string, Map<string, string>>();

/** Obtiene el calendario anual canónico desde Nager.Date v4. */
async function fetchV4YearHolidays(
  countryCode: string,
  year: number,
  signal?: AbortSignal
): Promise<Holiday[]> {
  const url = `${V4_BASE_URL}/${countryCode.toUpperCase()}/${year}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Error al obtener festivos: ${response.status}`);
  }

  return response.json();
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
    const url = `${V3_BASE_URL}/${year}/${code}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      return new Map();
    }

    const data: HolidayLocalNameSource[] = await response.json();
    const localNames = new Map(
      data.map((holiday) => [holiday.date, holiday.localName])
    );

    localNamesCache.set(cacheKey, localNames);
    return localNames;
  } catch {
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
