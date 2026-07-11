import { getLocales } from "expo-localization";

export function getDeviceLocale(): string {
  return getLocales()[0]?.languageTag ?? "en-US";
}

export function getDeviceLanguageCode(): string {
  return getLocales()[0]?.languageCode ?? "en";
}

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
