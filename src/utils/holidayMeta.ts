import type { Holiday, HolidayType } from "../interface/holiday";
import type { getHolidaysScreenCopy } from "./getHolidaysScreenCopy";

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

export function getHolidayTypeLabel(
  type: HolidayType,
  copy: ReturnType<typeof getHolidaysScreenCopy>
): string {
  return copy.holidayTypeLabels[type] ?? type;
}

export function isRegionalHoliday(holiday: Holiday): boolean {
  return !holiday.nationalHoliday;
}
