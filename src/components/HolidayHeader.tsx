import { Text, View } from "react-native";
import { formatMonthName } from "../utils/dateFormat";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type HolidayHeaderProps = {
  month: number;
  year: number;
  holidayCount: number;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
};

export function HolidayHeader({
  month,
  year,
  holidayCount,
  copy,
}: HolidayHeaderProps) {
  return (
    <View className="pt-10">
      <Text className="text-[11px] font-medium uppercase tracking-[3px] text-brand-muted">
        OffDay
      </Text>

      <View className="mt-5 flex-row items-end gap-3">
        <Text className="capitalize text-[40px] leading-[42px] text-brand-ink">
          {formatMonthName(month)}
        </Text>
        <Text className="mb-1.5 text-lg text-brand-muted">{year}</Text>
      </View>

      <Text className="mt-2 text-sm text-brand-muted">
        {copy.holidaysThisMonth(holidayCount)}
      </Text>
    </View>
  );
}
