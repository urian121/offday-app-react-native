import { Holiday, HolidayQueryParams } from "../interface/holiday";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";

const V4_BASE_URL = "https://date.nager.at/api/v4/Holidays";
const V3_BASE_URL = "https://date.nager.at/api/v3/PublicHolidays";

const localNamesCache = new Map<string, Map<string, string>>();

type HolidayV3 = {
  date: string;
  localName: string;
};

function filterByMonth(holidays: Holiday[], month: number): Holiday[] {
  return holidays.filter((holiday) => {
    const [, monthStr] = holiday.date.split("-");
    return Number(monthStr) === month;
  });
}

async function fetchV4YearHolidays(
  countryCode: string,
  year: number
): Promise<Holiday[]> {
  const url = `${V4_BASE_URL}/${countryCode.toUpperCase()}/${year}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al obtener festivos: ${response.status}`);
  }

  return response.json();
}

async function fetchLocalNamesMap(
  countryCode: string,
  year: number
): Promise<Map<string, string>> {
  const code = countryCode.toUpperCase();
  const cacheKey = `${code}-${year}`;
  const cached = localNamesCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const url = `${V3_BASE_URL}/${year}/${code}`;
    const response = await fetch(url);

    if (!response.ok) {
      return new Map();
    }

    const data: HolidayV3[] = await response.json();
    const localNames = new Map(
      data.map((holiday) => [holiday.date, holiday.localName])
    );

    localNamesCache.set(cacheKey, localNames);
    return localNames;
  } catch {
    return new Map();
  }
}

async function fetchYearHolidays(
  countryCode: string,
  year: number
): Promise<Holiday[]> {
  const code = countryCode.toUpperCase();

  const [v4Holidays, localNames] = await Promise.all([
    fetchV4YearHolidays(code, year),
    fetchLocalNamesMap(code, year),
  ]);

  return v4Holidays.map((holiday) => ({
    ...holiday,
    localName: localNames.get(holiday.date) ?? null,
  }));
}

export async function getHolidaysForYear(
  params: Partial<Pick<HolidayQueryParams, "countryCode" | "year">> = {}
): Promise<Holiday[]> {
  const { countryCode, year } = {
    ...getDefaultHolidayQueryParams(),
    ...params,
  };

  return fetchYearHolidays(countryCode, year);
}

export async function getHolidays(
  params: Partial<HolidayQueryParams> = {}
): Promise<Holiday[]> {
  const { countryCode, year, month } = {
    ...getDefaultHolidayQueryParams(),
    ...params,
  };

  const data = await fetchYearHolidays(countryCode, year);
  return filterByMonth(data, month);
}
