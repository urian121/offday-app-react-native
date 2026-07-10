import { Holiday, HolidayQueryParams } from "../interface/holiday";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";

const BASE_URL = "https://date.nager.at/api/v4/Holidays";

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
