import { getDeviceLocale } from "./getDeviceLocale";

const COPY = {
  es: {
    today: "Hoy",
    holidaysSummary: (monthCount: number, yearCount: number, year: number) => ({
      monthCount,
      monthPhrase: ` festivo${monthCount === 1 ? "" : "s"} este mes - `,
      yearCount,
      yearPhrase: ` en todo ${year}`,
    }),
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
    insightUnavailable:
      "No hay información o dato curioso disponible sobre este mes.",
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
    holidaysSummary: (monthCount: number, yearCount: number, year: number) => ({
      monthCount,
      monthPhrase: ` holiday${monthCount === 1 ? "" : "s"} this month · `,
      yearCount,
      yearPhrase: ` throughout ${year}`,
    }),
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
    insightUnavailable:
      "There is no information or curious fact available for this month.",
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

type HolidaysScreenCopyMap = typeof COPY;
export type HolidaysScreenCopy = HolidaysScreenCopyMap[keyof HolidaysScreenCopyMap];

/** Selecciona los textos de pantalla según el idioma del dispositivo. */
export function getHolidaysScreenCopy(): HolidaysScreenCopy {
  const locale = getDeviceLocale();
  return locale.startsWith("es") ? COPY.es : COPY.en;
}
