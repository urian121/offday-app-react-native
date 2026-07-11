import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Holiday } from "../interface/holiday";
import { formatHolidayDay, formatWeekdayShort } from "../utils/dateFormat";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type HolidayListProps = {
  holidays: Holiday[];
  loading: boolean;
  error: string | null;
  listKey: string;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
};

const STAGGER_MS = 75;
const ENTER_DURATION = 320;

function HolidayCard({
  holiday,
  nationalLabel,
}: {
  holiday: Holiday;
  nationalLabel: string;
}) {
  return (
    <View className="flex-row gap-4 rounded-2xl bg-white/50 px-4 py-4">
      <View className="w-12 items-center rounded-xl bg-brand-surface/80 py-2">
        <Text className="text-lg font-medium text-brand-ink">
          {formatHolidayDay(holiday.date)}
        </Text>
        <Text className="mt-0.5 text-[10px] uppercase tracking-wide text-brand-muted">
          {formatWeekdayShort(holiday.date)}
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <Text className="text-[15px] leading-5 text-brand-ink">{holiday.name}</Text>
        {holiday.nationalHoliday ? (
          <View className="mt-2 self-start rounded-md bg-brand-accent-soft/60 px-2 py-0.5">
            <Text className="text-[11px] text-brand-accent">{nationalLabel}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function AnimatedHolidayItem({
  holiday,
  index,
  nationalLabel,
}: {
  holiday: Holiday;
  index: number;
  nationalLabel: string;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * STAGGER_MS)
        .duration(ENTER_DURATION)
        .springify()
        .damping(20)
        .stiffness(180)}
      className="mb-3"
    >
      <HolidayCard holiday={holiday} nationalLabel={nationalLabel} />
    </Animated.View>
  );
}

export function HolidayList({
  holidays,
  loading,
  error,
  listKey,
  copy,
}: HolidayListProps) {
  if (loading) {
    return (
      <View className="items-center py-16">
        <ActivityIndicator color="#7A7269" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="rounded-2xl bg-brand-accent-soft/35 px-4 py-4">
        <Text className="text-sm leading-5 text-brand-ink">{error}</Text>
      </View>
    );
  }

  if (holidays.length === 0) {
    return (
      <View className="rounded-2xl bg-brand-surface/50 px-5 py-10">
        <Text className="text-center text-sm leading-5 text-brand-muted">
          {copy.noHolidays}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      key={listKey}
      data={holidays}
      keyExtractor={(item) => item.date + item.name}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
      renderItem={({ item, index }) => (
        <AnimatedHolidayItem
          holiday={item}
          index={index}
          nationalLabel={copy.national}
        />
      )}
    />
  );
}
