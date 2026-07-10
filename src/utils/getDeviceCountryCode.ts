import { getLocales } from "expo-localization";

export function getDeviceCountryCode(): string {
  const locale = getLocales()[0];

  if (locale?.regionCode) {
    return locale.regionCode.toUpperCase();
  }

  if (locale?.languageRegionCode) {
    return locale.languageRegionCode.toUpperCase();
  }

  const regionFromTag = locale?.languageTag.split("-")[1];
  if (regionFromTag && /^[a-z]{2}$/i.test(regionFromTag)) {
    return regionFromTag.toUpperCase();
  }

  return "US";
}
