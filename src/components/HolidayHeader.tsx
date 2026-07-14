import getCountryFlag from "country-flag-icons/unicode";
import { Image, Pressable, Text, View } from "react-native";
import type { Country } from "../interface/country";
import { formatMonthName } from "../utils/dateFormat";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type HolidayHeaderProps = {
  month: number;
  year: number;
  country: Country | null;
  holidayCount: number;
  yearHolidayCount: number;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
  onCountryPress: () => void;
};

export function HolidayHeader({
  month,
  year,
  country,
  holidayCount,
  yearHolidayCount,
  copy,
  onCountryPress,
}: HolidayHeaderProps) {
  return (
    <View className="pt-2">
      <View className="mb-14 flex-row items-center justify-between gap-4">
        <View className="flex-row items-center gap-3">
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

        <Pressable
          onPress={onCountryPress}
          className="max-w-[44%] flex-row items-center gap-2 rounded-xl bg-white/40 px-3 py-2 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={country?.name ?? copy.selectCountry}
        >
          {country ? (
            <Text
              className="text-2xl"
              accessibilityLabel={`Bandera de ${country.name}`}
            >
              {getCountryFlag(country.countryCode)}
            </Text>
          ) : null}

          <View className="min-w-0 flex-1 items-end">
            <Text
              className="text-right text-sm font-medium text-brand-ink"
              numberOfLines={1}
            >
              {country?.name ?? country?.countryCode.toUpperCase()}
            </Text>
          </View>
        </Pressable>
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
