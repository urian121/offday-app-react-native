import { getDeviceLocale } from "./getDeviceLocale";

const COPY = {
  es: {
    holidaysThisMonth: (count: number) =>
      `${count} festivo${count === 1 ? "" : "s"} este mes`,
    noHolidays: "No hay festivos este mes.",
    national: "Nacional",
    unknownError: "Error desconocido",
    month: "Mes",
    year: "Año",
    selectMonth: "Seleccionar mes",
    selectYear: "Seleccionar año",
    loadingYears: "Cargando años...",
  },
  en: {
    holidaysThisMonth: (count: number) =>
      `${count} holiday${count === 1 ? "" : "s"} this month`,
    noHolidays: "No holidays this month.",
    national: "National",
    unknownError: "Unknown error",
    month: "Month",
    year: "Year",
    selectMonth: "Select month",
    selectYear: "Select year",
    loadingYears: "Loading years...",
  },
} as const;

export function getHolidaysScreenCopy() {
  const locale = getDeviceLocale();
  return locale.startsWith("es") ? COPY.es : COPY.en;
}
