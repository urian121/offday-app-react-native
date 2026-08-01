import type { Country } from "../interface";
import { NAGER_COUNTRIES_URL } from "../utils/nagerConfig";
import { reportNagerFailure } from "./nagerAlertService";

let countriesCache: Country[] | null = null;

/** Obtiene y cachea la lista de países soportados por Nager.Date. */
export async function getAvailableCountries(
  signal?: AbortSignal
): Promise<Country[]> {
  if (countriesCache) {
    return countriesCache;
  }

  try {
    const response = await fetch(NAGER_COUNTRIES_URL, { signal });

    if (!response.ok) {
      reportNagerFailure({
        source: "countries",
        status: response.status,
        message: `Error al obtener países: ${response.status}`,
      });
      throw new Error(`Error al obtener países: ${response.status}`);
    }

    const countries: Country[] = await response.json();
    countriesCache = countries;
    return countries;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    if (
      !(
        error instanceof Error &&
        error.message.startsWith("Error al obtener países:")
      )
    ) {
      reportNagerFailure({
        source: "countries",
        message: error instanceof Error ? error.message : "NETWORK_ERROR",
      });
    }

    throw error;
  }
}
