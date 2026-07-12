import { Image, Text, View } from "react-native";
import { formatMonthName } from "../utils/dateFormat";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type HolidayHeaderProps = {
  month: number;
  year: number;
  holidayCount: number;
  yearHolidayCount: number;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
};

export function HolidayHeader({
  month,
  year,
  holidayCount,
  yearHolidayCount,
  copy,
}: HolidayHeaderProps) {
  return (
    <View className="pt-2">
      <View className="flex-row items-center gap-3 mb-14">
        <Image
          source={require("../../assets/icon.png")}
          className="h-14 w-14 rounded-2xl"
          resizeMode="contain"
          accessibilityLabel="OffDay"
        />
        <Text className="text-3xl font-medium tracking-wide text-brand-ink">
          OffDay
        </Text>
      </View>

      <View className="mt-5 flex-row items-end gap-3">
        <Text className="mb-1 capitalize text-[34px] mr-3 leading-[36px] text-brand-ink">
          {formatMonthName(month)}
        </Text>
        <Text className="mb-0 text-[64px] font-bold leading-[66px] text-brand-ink">
          {year}
        </Text>
      </View>

      <Text className="mt-2 text-lg font-medium text-brand-ink">
        {copy.holidaysThisMonth(holidayCount)}
      </Text>
      <Text className="mt-1 text-base font-medium text-brand-ink/85">
        {copy.holidaysThisYear(yearHolidayCount, year)}
      </Text>
    </View>
  );
}
