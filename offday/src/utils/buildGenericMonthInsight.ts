import type { YearHolidayStats } from "../interface";
import { getDeviceLanguageCode } from "./getDeviceLocale";

type TemporalRelation = "past" | "present" | "future";

/** Relación temporal del mes seleccionado respecto a hoy. */
function getTemporalRelation(year: number, month: number): TemporalRelation {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "past";
  }

  if (year === currentYear && month === currentMonth) {
    return "present";
  }

  return "future";
}

function holidayWord(count: number, language: "es" | "en"): string {
  if (language === "es") {
    return count === 1 ? "festivo" : "festivos";
  }

  return count === 1 ? "holiday" : "holidays";
}

function monthVerbEs(relation: TemporalRelation): string {
  if (relation === "past") return "tuvo";
  if (relation === "present") return "tiene";
  return "tendrá";
}

function thereBeEn(relation: TemporalRelation, count: number): string {
  const plural = count !== 1;

  if (relation === "past") {
    return plural ? "there were" : "there was";
  }

  if (relation === "present") {
    return plural ? "there are" : "there is";
  }

  return "there will be";
}

function findPeakMonth(
  months: YearHolidayStats["months"],
  selectedMonth: number
) {
  let peak = months[0] ?? null;

  for (const entry of months) {
    if (!peak || entry.count > peak.count) {
      peak = entry;
    }
  }

  if (peak && peak.month === selectedMonth && months.length > 1) {
    const other = [...months]
      .filter((entry) => entry.month !== selectedMonth)
      .sort((a, b) => b.count - a.count)[0];

    if (other && other.count > 0) {
      return other;
    }
  }

  return peak;
}

/** Nombres de festivos del mes para el texto genérico (máx. 2). */
function holidayNamesBit(
  names: string[],
  monthCount: number,
  language: "es" | "en"
): string {
  if (names.length === 0) {
    return "";
  }

  if (monthCount === 1 || names.length === 1) {
    return ` (${names[0]})`;
  }

  const shown = names.slice(0, 2).join(language === "es" ? " y " : " and ");

  if (language === "es") {
    return `, entre ellos ${shown}`;
  }

  return `, including ${shown}`;
}

/**
 * Dato del mes local (sin IA) a partir de los festivos ya cargados.
 * Garantiza texto útil aunque falle o tarde el backend.
 */
export function buildGenericMonthInsight(
  stats: YearHolidayStats,
  languageCode = getDeviceLanguageCode()
): string {
  const language = languageCode.toLowerCase().startsWith("es") ? "es" : "en";
  const relation = getTemporalRelation(stats.year, stats.selectedMonth);
  const monthCount =
    stats.months.find((entry) => entry.month === stats.selectedMonth)?.count ??
    stats.selectedHolidays.length;
  const yearTotal = stats.yearTotal;
  const monthName = stats.selectedMonthName;
  const year = stats.year;
  const word = holidayWord(monthCount, language);
  const peak = findPeakMonth(stats.months, stats.selectedMonth);
  const names = stats.selectedHolidays.map((holiday) => holiday.name);
  const holidayBit = holidayNamesBit(names, monthCount, language);

  if (language === "es") {
    const verb = monthVerbEs(relation);
    const contrast =
      peak && peak.count > monthCount
        ? ` En cambio, ${peak.monthName} concentra ${peak.count} ${holidayWord(peak.count, "es")}.`
        : yearTotal > 0
          ? ` En total, ${year} suma ${yearTotal} ${holidayWord(yearTotal, "es")}.`
          : "";

    return `En ${monthName} de ${year} ${verb} ${monthCount} ${word}${holidayBit}.${contrast}`.trim();
  }

  const thereBe = thereBeEn(relation, monthCount);
  const contrast =
    peak && peak.count > monthCount
      ? ` By contrast, ${peak.monthName} has ${peak.count} ${holidayWord(peak.count, "en")}.`
      : yearTotal > 0
        ? ` Overall, ${year} has ${yearTotal} ${holidayWord(yearTotal, "en")}.`
        : "";

  return `In ${monthName} ${year} ${thereBe} ${monthCount} ${word}${holidayBit}.${contrast}`.trim();
}
