import { getDeviceLocale } from "./getDeviceLocale";

const COPY = {
  es: {
    appLoading: "La app OffDay está cargando...",
  },
  en: {
    appLoading: "OffDay is loading...",
  },
} as const;

export function getAppCopy() {
  const locale = getDeviceLocale();
  return locale.startsWith("es") ? COPY.es : COPY.en;
}
