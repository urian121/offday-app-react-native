import { getDeviceLocale } from "./getDeviceLocale";

const COPY = {
  es: {
    appName: "OffDay",
    appLoading: "Cargando...",
  },
  en: {
    appName: "OffDay",
    appLoading: "Loading...",
  },
} as const;

/** Selecciona los textos globales según el idioma del dispositivo. */
export function getAppCopy() {
  const locale = getDeviceLocale();
  return locale.startsWith("es") ? COPY.es : COPY.en;
}
