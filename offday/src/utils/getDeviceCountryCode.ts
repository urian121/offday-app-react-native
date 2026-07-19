import { getLocales } from "expo-localization";

/** Valida que un valor tenga formato ISO 3166-1 alpha-2. */
function isCountryCode(value: string | null | undefined): value is string {
  return Boolean(value && /^[a-z]{2}$/i.test(value));
}

/** Resuelve un código ISO alpha-2 desde la configuración regional del teléfono. */
export function getDeviceCountryCode(): string {
  const locale = getLocales()[0];

  if (isCountryCode(locale?.regionCode)) {
    return locale.regionCode.toUpperCase();
  }

  const regionFromTag = locale?.languageTag
    .split("-")
    .slice(1)
    .find(isCountryCode);

  if (regionFromTag) {
    return regionFromTag.toUpperCase();
  }

  return "US";
}
