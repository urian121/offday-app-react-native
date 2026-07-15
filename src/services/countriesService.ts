import type { Country } from "../interface/country";

const AVAILABLE_COUNTRIES_URL =
  "https://date.nager.at/api/v3/AvailableCountries";

let countriesCache: Country[] | null = null;

/** Obtiene y cachea la lista de países soportados por Nager.Date. */
export async function getAvailableCountries(
  signal?: AbortSignal
): Promise<Country[]> {
  if (countriesCache) {
    return countriesCache;
  }

  const response = await fetch(AVAILABLE_COUNTRIES_URL, { signal });

  if (!response.ok) {
    throw new Error(`Error al obtener países: ${response.status}`);
  }

  const countries: Country[] = await response.json();
  countriesCache = countries;
  return countries;
}
