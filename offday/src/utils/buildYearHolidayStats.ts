import { Holiday, YearHolidayStats } from "../interface";
import { formatMonthName } from "./dateFormat";
import { filterHolidaysByMonth } from "./holidayDate";
import { getHolidayDisplayName } from "./getHolidayDisplayName";

/**
 * Resume el año para el insight: conteos por mes + festivos solo del mes activo.
 * Evita enviar los 12 listados completos al backend / IA.
 */
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
    };
  });

  const selectedHolidays = filterHolidaysByMonth(holidays, selectedMonth).map(
    (holiday) => ({
      name: getHolidayDisplayName(holiday),
      date: holiday.date,
      national: holiday.nationalHoliday,
      types: holiday.holidayTypes,
    })
  );

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
