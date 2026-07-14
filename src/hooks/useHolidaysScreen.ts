import { useEffect, useState } from "react";
import type { Country } from "../interface/country";
import { Holiday } from "../interface/holiday";
import { getAvailableCountries } from "../services/countriesService";
import { getHolidaysForYear } from "../services/holidaysService";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";
import { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";
import { useLazyBottomSheet } from "./useLazyBottomSheet";

const defaults = getDefaultHolidayQueryParams();

const YEARS_BACK = 1;
const YEARS_FORWARD = 5;

function buildYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: YEARS_BACK + YEARS_FORWARD + 1 },
    (_, index) => currentYear - YEARS_BACK + index
  );
}

function filterHolidaysByMonth(holidays: Holiday[], month: number): Holiday[] {
  return holidays.filter((holiday) => {
    const [, monthStr] = holiday.date.split("-");
    return Number(monthStr) === month;
  });
}

export function useHolidaysScreen() {
  const copy = getHolidaysScreenCopy();
  const countrySheet = useLazyBottomSheet();
  const monthSheet = useLazyBottomSheet();
  const yearSheet = useLazyBottomSheet();

  const [month, setMonth] = useState(defaults.month);
  const [year, setYear] = useState(defaults.year);
  const [yearHolidays, setYearHolidays] = useState<Holiday[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [availableYears] = useState<number[]>(buildYearOptions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAvailableCountries()
      .then((data) => {
        setCountries(data);
        setCountry(
          data.find(
            (item) => item.countryCode === defaults.countryCode.toUpperCase()
          ) ?? {
            countryCode: defaults.countryCode,
            name: defaults.countryCode,
          }
        );
      })
      .catch(() => {
        setCountry({
          countryCode: defaults.countryCode,
          name: defaults.countryCode,
        });
      })
      .finally(() => setCountriesLoading(false));
  }, []);

  const selectedCountryCode = country?.countryCode ?? defaults.countryCode;

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getHolidaysForYear({ year, countryCode: selectedCountryCode })
      .then((data) => {
        if (!cancelled) {
          setYearHolidays(data);
          setHolidays(filterHolidaysByMonth(data, month));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : copy.unknownError);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCountryCode, year]);

  useEffect(() => {
    setHolidays(filterHolidaysByMonth(yearHolidays, month));
  }, [month, yearHolidays]);

  const selectMonth = (value: number) => {
    setMonth(value);
    monthSheet.dismiss();
  };

  const selectYear = (value: number) => {
    setYear(value);
    yearSheet.dismiss();
  };

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
