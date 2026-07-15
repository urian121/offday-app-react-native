import { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { useHolidaysScreen } from "../hooks/useHolidaysScreen";
import { useMonthInsight } from "../hooks/useMonthInsight";
import { MONTH_OPTIONS } from "../utils/dateFormat";
import { CountryFilterSheet } from "./CountryFilterSheet";
import { HolidayFilterSheet } from "./HolidayFilterSheet";
import { HolidayFilters } from "./HolidayFilters";
import { HolidayHeader } from "./HolidayHeader";
import { HolidayList } from "./HolidayList";

type HolidaysScreenProps = {
  onReady?: () => void;
};

/** Orquesta los datos, filtros, lista y selectores de la pantalla principal. */
export function HolidaysScreen({ onReady }: HolidaysScreenProps) {
  const hasReportedReady = useRef(false);
  const {
    copy,
    month,
    year,
    countryCode,
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
    openMonthSheet,
    openYearSheet,
    openCountrySheet,
    selectMonth,
    selectYear,
    selectCountry,
  } = useHolidaysScreen();

  const {
    insight,
    loading: insightLoading,
    error: insightError,
  } = useMonthInsight({
    month,
    year,
    countryCode,
    yearHolidays,
    holidaysReady,
    holidaysError: error,
  });

  useEffect(() => {
    if (!loading && !hasReportedReady.current) {
      hasReportedReady.current = true;
      onReady?.();
    }
  }, [loading, onReady]);

  const yearOptions = useMemo(
    () =>
      availableYears.map((value) => ({
        value,
        label: String(value),
      })),
    [availableYears]
  );

  return (
    <>
      <View className="flex-1">
        <View className="px-6">
          <HolidayHeader
            month={month}
            year={year}
            country={country}
            holidayCount={holidays.length}
            yearHolidayCount={yearHolidays.length}
            copy={copy}
            onCountryPress={openCountrySheet}
          />
          <HolidayFilters
            month={month}
            year={year}
            copy={copy}
            onMonthPress={openMonthSheet}
            onYearPress={openYearSheet}
          />
        </View>

        <View className="mt-7 flex-1 rounded-t-[32px] bg-brand-base/95 px-6 pt-7">
          <HolidayList
            holidays={holidays}
            loading={loading}
            error={error}
            listKey={`${countryCode}-${month}-${year}`}
            copy={copy}
            insight={insight}
            insightLoading={insightLoading}
            insightError={insightError}
          />
        </View>
      </View>

      <CountryFilterSheet
        sheetRef={countrySheet.ref}
        visible={countrySheet.mounted}
        countries={countries}
        selectedCountryCode={countryCode}
        loading={countriesLoading}
        copy={copy}
        onDismiss={() => countrySheet.setMounted(false)}
        onSelect={selectCountry}
      />

      <HolidayFilterSheet
        sheetRef={monthSheet.ref}
        visible={monthSheet.mounted}
        title={copy.selectMonth}
        options={MONTH_OPTIONS}
        selected={month}
        onDismiss={() => monthSheet.setMounted(false)}
        onSelect={selectMonth}
        capitalizeLabels
      />

      <HolidayFilterSheet
        sheetRef={yearSheet.ref}
        visible={yearSheet.mounted}
        title={copy.selectYear}
        options={yearOptions}
        selected={year}
        onDismiss={() => yearSheet.setMounted(false)}
        onSelect={selectYear}
      />
    </>
  );
}
