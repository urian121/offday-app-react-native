import { useEffect, useState } from "react";
import { Holiday } from "../interface/holiday";
import { getAvailableYears, getHolidaysForYear } from "../services/holidaysService";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";
import { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";
import { useLazyBottomSheet } from "./useLazyBottomSheet";

const defaults = getDefaultHolidayQueryParams();

function filterHolidaysByMonth(holidays: Holiday[], month: number): Holiday[] {
  return holidays.filter((holiday) => {
    const [, monthStr] = holiday.date.split("-");
    return Number(monthStr) === month;
  });
}

export function useHolidaysScreen() {
  const copy = getHolidaysScreenCopy();
  const monthSheet = useLazyBottomSheet();
  const yearSheet = useLazyBottomSheet();

  const [month, setMonth] = useState(defaults.month);
  const [year, setYear] = useState(defaults.year);
  const [yearHolidays, setYearHolidays] = useState<Holiday[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearsLoading, setYearsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getHolidaysForYear({ year })
      .then((data) => {
        setYearHolidays(data);
        setHolidays(filterHolidaysByMonth(data, month));
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : copy.unknownError)
      )
      .finally(() => setLoading(false));
  }, [year]);

  useEffect(() => {
    setHolidays(filterHolidaysByMonth(yearHolidays, month));
  }, [month, yearHolidays]);

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
    yearHolidays,
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
