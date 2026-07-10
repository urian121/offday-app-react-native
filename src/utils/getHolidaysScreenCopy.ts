import { getDeviceLocale } from "../utils/getDeviceLocale";

const COPY = {
  es: {
    holidaysThisMonth: (count: number) =>
      `${count} festivo${count === 1 ? "" : "s"} este mes`,
    noHolidays: "No hay festivos este mes.",
    national: "Nacional",
    unknownError: "Error desconocido",
  },
  en: {
    holidaysThisMonth: (count: number) =>
      `${count} holiday${count === 1 ? "" : "s"} this month`,
    noHolidays: "No holidays this month.",
    national: "National",
    unknownError: "Unknown error",
  },
} as const;

export function getHolidaysScreenCopy() {
  const locale = getDeviceLocale();
  return locale.startsWith("es") ? COPY.es : COPY.en;
}
