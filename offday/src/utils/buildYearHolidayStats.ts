import { Holiday, YearHolidayStats } from "../interface";
import { formatMonthName } from "./dateFormat";
import { getHolidayMonth } from "./holidayDate";
import { getHolidayDisplayName } from "./getHolidayDisplayName";

/**
 * Resume el año para el insight: conteos por mes + festivos solo del mes activo.
 * Un solo pase sobre la lista (evita filtrar el año 13 veces).
 */
export function buildYearHolidayStats(
  holidays: Holiday[],
  countryCode: string,
  year: number,
  selectedMonth: number
): YearHolidayStats {
  const byMonth: Holiday[][] = Array.from({ length: 12 }, () => []);

  for (const holiday of holidays) {
    const month = getHolidayMonth(holiday.date);

    if (month >= 1 && month <= 12) {
      byMonth[month - 1].push(holiday);
    }
  }

  const months = byMonth.map((monthHolidays, index) => {
    const month = index + 1;

    return {
      month,
      monthName: formatMonthName(month),
      count: monthHolidays.length,
    };
  });

  const selectedHolidays = byMonth[selectedMonth - 1].map((holiday) => ({
    name: getHolidayDisplayName(holiday),
    date: holiday.date,
    national: holiday.nationalHoliday,
    types: holiday.holidayTypes,
  }));

  return {
    countryCode,
    year,
    selectedMonth,
    selectedMonthName: formatMonthName(selectedMonth),
    yearTotal: holidays.length,
    months,
    selectedHolidays,
  };
}
