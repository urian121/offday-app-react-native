import { getLocales } from "expo-localization";

export function getDeviceLocale(): string {
  return getLocales()[0]?.languageTag ?? "en-US";
}
