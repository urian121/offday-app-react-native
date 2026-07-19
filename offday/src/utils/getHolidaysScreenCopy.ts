import { getDeviceLocale } from "./getDeviceLocale";

const COPY = {
  es: {
    today: "Hoy",
    holidaysSummary: (monthCount: number, yearCount: number, year: number) =>
      `${monthCount} festivo${monthCount === 1 ? "" : "s"} este mes - ${yearCount} en todo ${year}`,
    holidaysTitle: "Días festivos este mes",
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
    restPlanTitle: "Planifica tu descanso",
    restPlanSubtitle:
      "Transforma cada festivo en la excusa perfecta para desconectar, compartir en familia, conectar con la naturaleza, escaparte con amigos y recargar energías.",
    insightTitle: "Dato del mes",
    insightLoading: "Generando dato curioso...",
    insightError: "No se pudo generar el dato curioso.",
    insightMissingApiUrl:
      "Falta EXPO_PUBLIC_API_URL en el build. Revisa tu .env y reinicia Expo.",
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
    holidaysSummary: (monthCount: number, yearCount: number, year: number) =>
      `${monthCount} holiday${monthCount === 1 ? "" : "s"} this month · ${yearCount} throughout ${year}`,
    holidaysTitle: "Public holidays",
    noHolidays: "No holidays this month.",
    national: "National",
    regional: "Regional",
    unknownError: "Unknown error",
    month: "Month",
    year: "Year",
    selectCountry: "Seleccionar país",
    searchCountry: "Buscar país",
    loadingCountries: "Cargando países...",
    noCountries: "No se encontraron países.",
    selectMonth: "Select month",
    selectYear: "Select year",
    restPlanTitle: "Plan your time off",
    restPlanSubtitle: "Turn holidays into moments to recharge.",
    insightTitle: "Month insight",
    insightLoading: "Generating a curious fact...",
    insightError: "Could not generate the month insight.",
    insightMissingApiUrl:
      "EXPO_PUBLIC_API_URL is missing from this build. Check your .env and restart Expo.",
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
