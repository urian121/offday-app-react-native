import { getLocales } from "expo-localization";

/** Devuelve la etiqueta completa del locale principal del dispositivo. */
export function getDeviceLocale(): string {
  return getLocales()[0]?.languageTag ?? "en-US";
}

/** Devuelve el código de idioma principal del dispositivo. */
export function getDeviceLanguageCode(): string {
  return getLocales()[0]?.languageCode ?? "en";
}
