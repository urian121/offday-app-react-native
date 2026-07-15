import { getDeviceLocale } from "./getDeviceLocale";

/** Crea un formateador de fecha usando el locale actual del dispositivo. */
function createFormatter(options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(getDeviceLocale(), options);
}

/** Convierte un mes numérico de 1 a 12 en su nombre localizado. */
export function formatMonthName(month: number): string {
  return createFormatter({ month: "long" }).format(new Date(2000, month - 1, 1));
}

/** Formatea una fecha como “mar, 14 de julio” según el idioma del teléfono. */
export function formatCurrentDate(date: Date = new Date()): string {
  return createFormatter({
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(date);
}

/** Extrae el día del mes de una fecha ISO sin aplicar zona horaria. */
export function formatHolidayDay(date: string): string {
  const [, , day] = date.split("-");
  return String(Number(day));
}

/** Devuelve el día de semana abreviado y localizado de una fecha ISO. */
export function formatWeekdayShort(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return createFormatter({ weekday: "short" }).format(
    new Date(year, month - 1, day)
  );
}

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const value = index + 1;
  return { value, label: formatMonthName(value) };
});
