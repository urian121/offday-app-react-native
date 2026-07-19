import { getLocales } from "expo-localization";

/** Devuelve la etiqueta completa del locale principal del dispositivo. */
export function getDeviceLocale(): string {
  return getLocales()[0]?.languageTag ?? "en-US";
}

/** Devuelve el código de idioma principal del dispositivo. */
export function getDeviceLanguageCode(): string {
  return getLocales()[0]?.languageCode ?? "en";
}

/** Obtiene el nombre localizado de un idioma con fallback a su código. */
export function getLanguageDisplayName(
  languageCode: string,
  locale: string = getDeviceLocale()
): string {
  try {
    return (
      new Intl.DisplayNames([locale], { type: "language" }).of(languageCode) ??
      languageCode
    );
  } catch {
    return languageCode;
  }
}
