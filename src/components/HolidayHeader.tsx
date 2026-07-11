import { Image, Text, View } from "react-native";
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
        <Text className="mb-1 capitalize text-[34px] leading-[36px] text-brand-ink">
          {formatMonthName(month)}
        </Text>
        <Text className="text-[52px] leading-[54px] text-brand-muted">
          {year}
        </Text>
      </View>

      <Text className="mt-2 text-lg text-brand-muted">
        {copy.holidaysThisMonth(holidayCount)}
      </Text>
    </View>
  );
}
