import type { Holiday } from "../interface";

/** Extrae el mes 1-12 de una fecha ISO sin conversiones de zona horaria. */
function getHolidayMonth(date: string): number {
  const [, month] = date.split("-");
  return Number(month);
}

/** Filtra festivos por mes conservando el orden recibido desde la API. */
export function filterHolidaysByMonth(
  holidays: Holiday[],
  month: number
): Holiday[] {
  return holidays.filter((holiday) => getHolidayMonth(holiday.date) === month);
}
