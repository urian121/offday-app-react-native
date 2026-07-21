import { getCalendars, getLocales } from "expo-localization";
import { TIME_ZONE_COUNTRY_CODES } from "./timeZoneCountryCodes";

/** Valida que un valor tenga formato ISO 3166-1 alpha-2. */
function isCountryCode(value: string | null | undefined): value is string {
  return Boolean(value && /^[a-z]{2}$/i.test(value));
}

/** Obtiene la zona horaria del dispositivo con fallback a Intl. */
function getDeviceTimeZone(): string | null {
  const calendarTimeZone = getCalendars()[0]?.timeZone;

  if (calendarTimeZone) {
    return calendarTimeZone;
  }

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    return null;
  }
}

/** Extrae la región de la etiqueta de un idioma (ej. "es-MX" -> "MX"). */
function getRegionFromLanguageTag(
  languageTag: string | null | undefined
): string | undefined {
  return languageTag?.split("-").slice(1).find(isCountryCode);
}

/**
 * Resuelve el país del dispositivo (ISO alpha-2) con esta prioridad:
 * 1. Zona horaria (refleja dónde está el dispositivo, sin depender del idioma).
 * 2. Región configurada en el sistema (`regionCode`) en cualquiera de los
 *    idiomas agregados al teléfono.
 * 3. Región embebida en la etiqueta de cualquiera de esos idiomas (ej. "es-MX").
 * 4. "CO" (Colombia) como último recurso.
 */
export function getDeviceCountryCode(): string {
  const timeZone = getDeviceTimeZone();
  const countryFromTimeZone = timeZone
    ? TIME_ZONE_COUNTRY_CODES[timeZone]
    : undefined;

  if (isCountryCode(countryFromTimeZone)) {
    return countryFromTimeZone.toUpperCase();
  }

  const locales = getLocales();

  for (const locale of locales) {
    if (isCountryCode(locale?.regionCode)) {
      return locale.regionCode.toUpperCase();
    }
  }

  for (const locale of locales) {
    const regionFromTag = getRegionFromLanguageTag(locale?.languageTag);

    if (regionFromTag) {
      return regionFromTag.toUpperCase();
    }
  }

  return "CO";
}
