import { Holiday } from "../interface/holiday";
import { getDeviceLanguageCode } from "./getDeviceLocale";

export function getHolidayDisplayName(holiday: Holiday): string {
  const languageCode = getDeviceLanguageCode();

  if (languageCode === "en") {
    return holiday.name;
  }

  if (holiday.localName) {
    return holiday.localName;
  }

  return holiday.name;
}
