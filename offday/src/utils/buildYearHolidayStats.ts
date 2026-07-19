import { Holiday } from "../interface/holiday";
import { YearHolidayStats } from "../interface/monthInsight";
import { formatMonthName } from "./dateFormat";
import { filterHolidaysByMonth } from "./holidayDate";
import { getHolidayDisplayName } from "./getHolidayDisplayName";

/** Resume todos los festivos de un año para generar el insight mensual. */
export function buildYearHolidayStats(
  holidays: Holiday[],
  countryCode: string,
  year: number,
  selectedMonth: number
): YearHolidayStats {
  const months = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthHolidays = filterHolidaysByMonth(holidays, month);

    return {
      month,
      monthName: formatMonthName(month),
      count: monthHolidays.length,
      holidays: monthHolidays.map((holiday) => ({
        name: getHolidayDisplayName(holiday),
        date: holiday.date,
        national: holiday.nationalHoliday,
        types: holiday.holidayTypes,
      })),
    };
  });

  return {
    countryCode,
    year,
    selectedMonth,
    selectedMonthName: formatMonthName(selectedMonth),
    yearTotal: holidays.length,
    months,
  };
}
