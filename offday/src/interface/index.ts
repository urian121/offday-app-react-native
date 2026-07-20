/** País disponible en Nager.Date (código ISO y nombre). */
export interface Country {
  countryCode: string;
  name: string;
}

/** Tipos de festivo que devuelve la API Nager.Date v4. */
export type HolidayType =
  | "Public"
  | "Bank"
  | "School"
  | "Authorities"
  | "Optional"
  | "Observance";

/** Festivo enriquecido con datos v4 y nombre local opcional de v3. */
export interface Holiday {
  date: string;
  name: string;
  localName?: string | null;
  countryCode: string;
  nationalHoliday: boolean;
  subdivisionCodes: string[] | null;
  holidayTypes: HolidayType[];
}

/** Nombre local de un festivo obtenido desde Nager.Date v3. */
export interface HolidayLocalNameSource {
  date: string;
  localName: string;
}

/** Parámetros para consultar festivos por país, año y mes. */
export interface HolidayQueryParams {
  countryCode: string;
  year: number;
  month: number;
}

/** Resumen mensual de festivos enviado al backend para el insight. */
export interface MonthHolidaySummary {
  month: number;
  monthName: string;
  count: number;
  holidays: Array<{
    name: string;
    date: string;
    national: boolean;
    types: string[];
  }>;
}

/** Estadísticas anuales del país usadas para generar el dato del mes. */
export interface YearHolidayStats {
  countryCode: string;
  year: number;
  selectedMonth: number;
  selectedMonthName: string;
  yearTotal: number;
  months: MonthHolidaySummary[];
}
