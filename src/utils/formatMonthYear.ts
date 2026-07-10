import { getDeviceLocale } from "./getDeviceLocale";

export function formatMonthYear(month: number, year: number): string {
  const locale = getDeviceLocale();
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}
