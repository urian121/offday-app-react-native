import type { Holiday, HolidayType } from "../interface/holiday";
import type { getHolidaysScreenCopy } from "./getHolidaysScreenCopy";

/** Resume códigos regionales y marca cuántos quedaron ocultos. */
export function formatSubdivisionCodes(
  codes: string[] | null,
  maxVisible = 3
): string | null {
  if (!codes?.length) {
    return null;
  }

  if (codes.length <= maxVisible) {
    return codes.join(", ");
  }

  const visible = codes.slice(0, maxVisible).join(", ");
  return `${visible} +${codes.length - maxVisible}`;
}

/** Traduce un tipo de festivo usando el copy activo de la pantalla. */
export function getHolidayTypeLabel(
  type: HolidayType,
  copy: ReturnType<typeof getHolidaysScreenCopy>
): string {
  return copy.holidayTypeLabels[type] ?? type;
}

/** Indica si un festivo aplica solo a una o varias subdivisiones. */
export function isRegionalHoliday(holiday: Holiday): boolean {
  return !holiday.nationalHoliday;
}
