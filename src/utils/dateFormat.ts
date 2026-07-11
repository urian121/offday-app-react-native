import { getDeviceLocale } from "./getDeviceLocale";

function createFormatter(options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(getDeviceLocale(), options);
}

export function formatMonthName(month: number): string {
  return createFormatter({ month: "long" }).format(new Date(2000, month - 1, 1));
}

export function formatMonthYear(month: number, year: number): string {
  return createFormatter({ month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1)
  );
}

export function formatHolidayDay(date: string): string {
  const [, , day] = date.split("-");
  return String(Number(day));
}

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
