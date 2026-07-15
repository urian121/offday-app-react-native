import { getDeviceLocale } from "./getDeviceLocale";

const COPY = {
  es: {
    today: "Hoy",
    holidaysSummary: (
      monthCount: number,
      yearCount: number,
      year: number
    ) =>
      `${monthCount} festivo${monthCount === 1 ? "" : "s"} este mes · ${yearCount} en todo ${year}`,
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
    today: "Today",
    holidaysSummary: (
      monthCount: number,
      yearCount: number,
      year: number
    ) =>
      `${monthCount} holiday${monthCount === 1 ? "" : "s"} this month · ${yearCount} throughout ${year}`,
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

/** Selecciona los textos de pantalla según el idioma del dispositivo. */
export function getHolidaysScreenCopy() {
  const locale = getDeviceLocale();
  return locale.startsWith("es") ? COPY.es : COPY.en;
}
