import { View } from "react-native";
import { useHolidaysScreen } from "../hooks/useHolidaysScreen";
import { useMonthInsight } from "../hooks/useMonthInsight";
import { MONTH_OPTIONS } from "../utils/dateFormat";
import { HolidayFilterSheet } from "./HolidayFilterSheet";
import { HolidayFilters } from "./HolidayFilters";
import { HolidayHeader } from "./HolidayHeader";
import { HolidayList } from "./HolidayList";

export function HolidaysScreen() {
  const {
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
    openMonthSheet,
    openYearSheet,
    selectMonth,
    selectYear,
  } = useHolidaysScreen();

  const {
    insight,
    loading: insightLoading,
    error: insightError,
  } = useMonthInsight({
    month,
    year,
    yearHolidays,
    holidaysReady: !loading,
    holidaysError: error,
  });

  const yearOptions = availableYears.map((value) => ({
    value,
    label: String(value),
  }));

  return (
    <>
      <View className="flex-1">
        <View className="px-6">
          <HolidayHeader
            month={month}
            year={year}
            holidayCount={holidays.length}
            copy={copy}
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
            listKey={`${month}-${year}`}
            copy={copy}
            insight={insight}
            insightLoading={insightLoading}
            insightError={insightError}
          />
        </View>
      </View>

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
        loading={yearsLoading}
        loadingLabel={copy.loadingYears}
        onDismiss={() => yearSheet.setMounted(false)}
        onSelect={selectYear}
      />
    </>
  );
}
