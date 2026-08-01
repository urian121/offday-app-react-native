import { resolveHttpUrl } from "../utils/resolveHttpUrl";

/** Base Nager.Date v4 (calendario canónico). */
export const NAGER_V4_BASE_URL = resolveHttpUrl(
  process.env.EXPO_PUBLIC_NAGER_V4_URL,
  "https://date.nager.at/api/v4/Holidays"
);

/** Base Nager.Date v3 (nombres locales). */
export const NAGER_V3_BASE_URL = resolveHttpUrl(
  process.env.EXPO_PUBLIC_NAGER_V3_URL,
  "https://date.nager.at/api/v3/PublicHolidays"
);

/** Lista de países Nager.Date v3. */
export const NAGER_COUNTRIES_URL = resolveHttpUrl(
  process.env.EXPO_PUBLIC_NAGER_COUNTRIES_URL,
  "https://date.nager.at/api/v3/AvailableCountries"
);
