import getCountryFlag from "country-flag-icons/unicode";
import { Pressable, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
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

/** Dibuja el calendario compacto que identifica a OffDay. */
function BrandCalendarIcon() {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityRole="image"
      accessibilityLabel="Logo de OffDay"
    >
      <Path
        d="M6.5 3v3M17.5 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="#412402"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={15} r={2.1} fill="#412402" />
    </Svg>
  );
}

/** Reproduce el control visual de ajustes incluido en el mockup. */
function SettingsIcon() {
  return (
    <Svg
      width={19}
      height={19}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityRole="image"
      accessibilityLabel="Ajustes"
    >
      <Circle cx={12} cy={12} r={3} stroke="#412402" strokeWidth={1.7} />
      <Path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.1 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.3v-4h.09A1.7 1.7 0 0 0 4 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.4 4.1a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.3h4v.09A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8.4a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.09v4h-.09A1.7 1.7 0 0 0 19.4 15Z"
        stroke="#412402"
        strokeWidth={1.35}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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
            <BrandCalendarIcon />
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

      <View className="absolute right-0 top-14 h-10 w-10 items-center justify-center rounded-full bg-white/35">
        <SettingsIcon />
      </View>

      <Text className="mt-11 text-[16px] font-medium text-brand-brown">
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
