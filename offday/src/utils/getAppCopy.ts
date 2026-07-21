import { getDeviceLocale } from "./getDeviceLocale";

const COPY = {
  es: {
    appName: "FestiDías",
    appLoading: "Cargando...",
  },
  en: {
    appName: "FestiDías",
    appLoading: "Loading...",
  },
} as const;

/** Selecciona los textos globales según el idioma del dispositivo. */
export function getAppCopy() {
  const locale = getDeviceLocale();
  return locale.startsWith("es") ? COPY.es : COPY.en;
}
