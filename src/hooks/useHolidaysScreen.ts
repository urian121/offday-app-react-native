import { useEffect, useState } from "react";
import { Holiday } from "../interface/holiday";
import { getAvailableYears, getHolidays } from "../services/holidaysService";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";
import { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";
import { useLazyBottomSheet } from "./useLazyBottomSheet";

const defaults = getDefaultHolidayQueryParams();

export function useHolidaysScreen() {
  const copy = getHolidaysScreenCopy();
  const monthSheet = useLazyBottomSheet();
  const yearSheet = useLazyBottomSheet();

  const [month, setMonth] = useState(defaults.month);
  const [year, setYear] = useState(defaults.year);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearsLoading, setYearsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getHolidays({ month, year })
      .then(setHolidays)
      .catch((err) =>
        setError(err instanceof Error ? err.message : copy.unknownError)
      )
      .finally(() => setLoading(false));
  }, [month, year]);

  const openYearSheet = async () => {
    yearSheet.open();

    if (availableYears.length > 0) {
      return;
    }

    setYearsLoading(true);

    try {
      const years = await getAvailableYears(defaults.countryCode);
      setAvailableYears(years);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.unknownError);
    } finally {
      setYearsLoading(false);
    }
  };

  const selectMonth = (value: number) => {
    setMonth(value);
    monthSheet.dismiss();
  };

  const selectYear = (value: number) => {
    setYear(value);
    yearSheet.dismiss();
  };

  return {
    copy,
    month,
    year,
    holidays,
    availableYears,
    loading,
    yearsLoading,
    error,
    monthSheet,
    yearSheet,
    openMonthSheet: monthSheet.open,
    openYearSheet,
    selectMonth,
    selectYear,
  };
}
