import { getDeviceLocale } from "./getDeviceLocale";

const COPY = {
  es: {
    holidaysThisMonth: (count: number) =>
      `${count} festivo${count === 1 ? "" : "s"} este mes`,
    holidaysThisYear: (count: number, year: number) =>
      `${count} festivo${count === 1 ? "" : "s"} en ${year}`,
    noHolidays: "No hay festivos este mes.",
    national: "Nacional",
    regional: "Regional",
    unknownError: "Error desconocido",
    month: "Mes",
    year: "Año",
    selectCountry: "Seleccionar país",
    searchCountry: "Buscar país o código",
    loadingCountries: "Cargando países...",
    noCountries: "No se encontraron países.",
    selectMonth: "Seleccionar mes",
    selectYear: "Seleccionar año",
    loadingYears: "Cargando años...",
    insightTitle: "Dato del mes",
    insightLoading: "Generando dato curioso...",
    insightError: "No se pudo generar el dato curioso.",
    insightMissingKey:
      "Añade EXPO_PUBLIC_OPENAI_API_KEY en tu archivo .env y reinicia Expo.",
    holidayTypeLabels: {
      Public: "Público",
      Bank: "Bancario",
      School: "Escolar",
      Authorities: "Autoridades",
      Optional: "Opcional",
      Observance: "Conmemorativo",
    },
  },
  en: {
    holidaysThisMonth: (count: number) =>
      `${count} holiday${count === 1 ? "" : "s"} this month`,
    holidaysThisYear: (count: number, year: number) =>
      `${count} holiday${count === 1 ? "" : "s"} in ${year}`,
    noHolidays: "No holidays this month.",
    national: "National",
    regional: "Regional",
    unknownError: "Unknown error",
    month: "Month",
    year: "Year",
    selectCountry: "Select country",
    searchCountry: "Search country or code",
    loadingCountries: "Loading countries...",
    noCountries: "No countries found.",
    selectMonth: "Select month",
    selectYear: "Select year",
    loadingYears: "Loading years...",
    insightTitle: "Month insight",
    insightLoading: "Generating a curious fact...",
    insightError: "Could not generate the month insight.",
    insightMissingKey:
      "Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file and restart Expo.",
    holidayTypeLabels: {
      Public: "Public",
      Bank: "Bank",
      School: "School",
      Authorities: "Authorities",
      Optional: "Optional",
      Observance: "Observance",
    },
  },
} as const;

export function getHolidaysScreenCopy() {
  const locale = getDeviceLocale();
  return locale.startsWith("es") ? COPY.es : COPY.en;
}
