import { useEffect, useMemo, useState } from "react";
import type { Country } from "../interface";
import { Holiday } from "../interface";
import { getAvailableCountries } from "../services/countriesService";
import { getHolidaysForYear } from "../services/holidaysService";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";
import { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";
import { filterHolidaysByMonth } from "../utils/holidayDate";
import { useLazyBottomSheet } from "./useLazyBottomSheet";

const YEARS_BACK = 1;
const YEARS_FORWARD = 5;

/** Genera el rango local del selector: año actual -1 hasta año actual +5. */
function buildYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: YEARS_BACK + YEARS_FORWARD + 1 },
    (_, index) => currentYear - YEARS_BACK + index
  );
}

/** Coordina filtros, países, festivos y estados de los bottom sheets. */
export function useHolidaysScreen() {
  const copy = getHolidaysScreenCopy();
  const countrySheet = useLazyBottomSheet();
  const monthSheet = useLazyBottomSheet();
  const yearSheet = useLazyBottomSheet();

  const defaults = useMemo(getDefaultHolidayQueryParams, []);
  const [month, setMonth] = useState(defaults.month);
  const [year, setYear] = useState(defaults.year);
  const [yearHolidays, setYearHolidays] = useState<Holiday[]>([]);
  const [country, setCountry] = useState<Country>({
    countryCode: defaults.countryCode,
    name: defaults.countryCode,
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [isFetchingHolidays, setIsFetchingHolidays] = useState(true);
  const [settledQueryKey, setSettledQueryKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getAvailableCountries(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) {
          return;
        }

        setCountries(data);
        setCountry(
          data.find(
            (item) => item.countryCode === defaults.countryCode.toUpperCase()
          ) ??
            data.find((item) => item.countryCode === "CO") ??
            data[0] ?? {
              countryCode: defaults.countryCode,
              name: defaults.countryCode,
            }
        );
      })
      .catch(() => {
        if (controller.signal.aborted) {
          return;
        }

        setCountry({
          countryCode: defaults.countryCode,
          name: defaults.countryCode,
        });
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCountriesLoading(false);
        }
      });

    return () => controller.abort();
  }, [defaults]);

  const selectedCountryCode = country.countryCode;
  const queryKey = `${selectedCountryCode}-${year}`;
  const availableYears = useMemo(buildYearOptions, []);
  const holidays = useMemo(
    () => filterHolidaysByMonth(yearHolidays, month),
    [month, yearHolidays]
  );
  const loading = isFetchingHolidays || settledQueryKey !== queryKey;
  const holidaysReady = !loading && !error;

  useEffect(() => {
    const controller = new AbortController();

    setIsFetchingHolidays(true);
    setError(null);
    setYearHolidays([]);

    getHolidaysForYear(
      { year, countryCode: selectedCountryCode },
      controller.signal
    )
      .then((data) => {
        if (!controller.signal.aborted) {
          setYearHolidays(data);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : copy.unknownError);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSettledQueryKey(queryKey);
          setIsFetchingHolidays(false);
        }
      });

    return () => controller.abort();
  }, [queryKey, selectedCountryCode, year]);

  /** Actualiza el mes activo y cierra su selector. */
  const selectMonth = (value: number) => {
    setMonth(value);
    monthSheet.dismiss();
  };

  /** Actualiza el año activo y cierra su selector. */
  const selectYear = (value: number) => {
    setYear(value);
    yearSheet.dismiss();
  };

  /** Actualiza el país activo y cierra su selector. */
  const selectCountry = (countryCode: string) => {
    const selectedCountry = countries.find(
      (item) => item.countryCode === countryCode
    );

    if (selectedCountry) {
      setCountry(selectedCountry);
    }

    countrySheet.dismiss();
  };

  return {
    copy,
    month,
    year,
    countryCode: selectedCountryCode,
    country,
    countries,
    countriesLoading,
    yearHolidays,
    holidays,
    availableYears,
    loading,
    holidaysReady,
    error,
    countrySheet,
    monthSheet,
    yearSheet,
    openCountrySheet: countrySheet.open,
    openMonthSheet: monthSheet.open,
    openYearSheet: yearSheet.open,
    selectMonth,
    selectYear,
    selectCountry,
  };
}
