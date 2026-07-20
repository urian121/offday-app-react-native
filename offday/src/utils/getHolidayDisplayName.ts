import { Holiday } from "../interface";
import { getDeviceLanguageCode } from "./getDeviceLocale";

/** Elige entre el nombre inglés y el nombre local según el idioma del teléfono. */
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
