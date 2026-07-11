import { Holiday, HolidayQueryParams } from "../interface/holiday";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";

const BASE_URL = "https://date.nager.at/api/v4/Holidays";
const MIN_PROBE_YEAR = 2000;
const MAX_PROBE_YEAR = 2040;

const availableYearsCache = new Map<string, number[]>();

function filterByMonth(holidays: Holiday[], month: number): Holiday[] {
  return holidays.filter((holiday) => {
    const [, monthStr] = holiday.date.split("-");
    return Number(monthStr) === month;
  });
}

export async function getHolidays(
  params: Partial<HolidayQueryParams> = {}
): Promise<Holiday[]> {
  const { countryCode, year, month } = {
    ...getDefaultHolidayQueryParams(),
    ...params,
  };

  const url = `${BASE_URL}/${countryCode.toUpperCase()}/${year}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al obtener festivos: ${response.status}`);
  }

  const data: Holiday[] = await response.json();
  return filterByMonth(data, month);
}

export async function getAvailableYears(
  countryCode: string = getDefaultHolidayQueryParams().countryCode
): Promise<number[]> {
  const code = countryCode.toUpperCase();
  const cached = availableYearsCache.get(code);

  if (cached) {
    return cached;
  }

  const years = Array.from(
    { length: MAX_PROBE_YEAR - MIN_PROBE_YEAR + 1 },
    (_, index) => MIN_PROBE_YEAR + index
  );

  const checks = await Promise.all(
    years.map(async (year) => {
      const response = await fetch(`${BASE_URL}/${code}/${year}`, {
        method: "HEAD",
      });
      return response.ok ? year : null;
    })
  );

  const availableYears = checks
    .filter((year): year is number => year !== null)
    .sort((a, b) => b - a);

  availableYearsCache.set(code, availableYears);
  return availableYears;
}
