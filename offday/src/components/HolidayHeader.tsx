import getCountryFlag from "country-flag-icons/unicode";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { Country } from "../interface/country";
import { formatCurrentDate, formatMonthName } from "../utils/dateFormat";
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

/** Muestra marca, país activo, periodo y conteos de festivos. */
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
    <View className="relative pt-2">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-2.5">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-brand-calendar-surface">
            <Ionicons
              name="calendar"
              size={22}
              color="#412402"
              accessibilityLabel="Logo de OffDay"
            />
          </View>
          <Text className="text-[22px] font-semibold tracking-wide text-brand-ink">
            OffDay
          </Text>
        </View>

        <Pressable
          onPress={onCountryPress}
          className="max-w-[56%] flex-row items-center gap-1.5 rounded-xl bg-white/35 px-2.5 py-2 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={country?.name ?? copy.selectCountry}
        >
          {country ? (
            <Text
              className="text-xl"
              accessibilityLabel={`Bandera de ${country.name}`}
            >
              {getCountryFlag(country.countryCode)}
            </Text>
          ) : null}

          <View className="min-w-0 shrink">
            <Text
              className="text-[13px] font-medium text-brand-deep"
              numberOfLines={1}
            >
              {country?.name ?? copy.selectCountry}
            </Text>
          </View>
        </Pressable>
      </View>

      <Text className="mt-5 text-[16px] font-medium text-brand-brown">
        {copy.today} {formatCurrentDate()}
      </Text>

      <View className="mt-1 flex-row items-end gap-3">
        <Text className="mb-1 mr-1 capitalize text-[32px] leading-[36px] text-brand-ink">
          {formatMonthName(month)}
        </Text>
        <Text className="text-[56px] font-bold leading-[58px] text-brand-ink">
          {year}
        </Text>
      </View>

      <Text
        className="mt-2 text-[15px] font-medium text-brand-brown"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {copy.holidaysSummary(holidayCount, yearHolidayCount, year)}
      </Text>
    </View>
  );
}
