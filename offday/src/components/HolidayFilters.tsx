import { Pressable, Text, View } from "react-native";
import { formatMonthName } from "../utils/dateFormat";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type HolidayFiltersProps = {
  month: number;
  year: number;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
  onMonthPress: () => void;
  onYearPress: () => void;
};

/** Renderiza una mitad interactiva del selector de mes y año. */
function FilterSegment({
  label,
  value,
  onPress,
  className = "",
}: {
  label: string;
  value: string;
  onPress: () => void;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 px-4 py-3 active:opacity-75 ${className}`}
    >
      <Text className="text-xl font-medium uppercase tracking-wider text-brand-base">
        {label}
      </Text>
      <Text className="mt-1 text-lg font-medium capitalize text-brand-deep">
        {value}
      </Text>
    </Pressable>
  );
}

/** Agrupa los accesos a los selectores de mes y año. */
export function HolidayFilters({
  month,
  year,
  copy,
  onMonthPress,
  onYearPress,
}: HolidayFiltersProps) {
  return (
    <View className="mt-6 overflow-hidden rounded-[14px] bg-brand-filter-surface">
      <View className="flex-row">
        <FilterSegment
          label={copy.month}
          value={formatMonthName(month)}
          onPress={onMonthPress}
        />
        <View className="my-3 w-px bg-brand-deep/10" />
        <FilterSegment
          label={copy.year}
          value={String(year)}
          onPress={onYearPress}
        />
      </View>
    </View>
  );
}
