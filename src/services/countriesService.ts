import type { Country } from "../interface/country";

const AVAILABLE_COUNTRIES_URL =
  "https://date.nager.at/api/v3/AvailableCountries";

let countriesCache: Country[] | null = null;

export async function getAvailableCountries(): Promise<Country[]> {
  if (countriesCache) {
    return countriesCache;
  }

  const response = await fetch(AVAILABLE_COUNTRIES_URL);

  if (!response.ok) {
    throw new Error(`Error al obtener países: ${response.status}`);
  }

  const countries: Country[] = await response.json();
  countriesCache = countries;
  return countries;
}

export async function getCountryByCode(
  countryCode: string
): Promise<Country | null> {
  const code = countryCode.toUpperCase();
  const countries = await getAvailableCountries();

  return countries.find((country) => country.countryCode === code) ?? null;
}
