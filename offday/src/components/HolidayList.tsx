import { memo, useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Holiday } from "../interface";
import { formatHolidayDay, formatWeekdayShort } from "../utils/dateFormat";
import {
  formatSubdivisionCodes,
  getHolidayTypeLabel,
  isRegionalHoliday,
} from "../utils/holidayMeta";
import type { HolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";
import { getHolidayDisplayName } from "../utils/getHolidayDisplayName";
import { MonthInsight } from "./MonthInsight";
import { PlanRestCard } from "./PlanRestCard";

type HolidayListProps = {
  holidays: Holiday[];
  loading: boolean;
  error: string | null;
  listKey: string;
  copy: HolidaysScreenCopy;
  insight: string | null;
};

const STAGGER_MS = 75;
const ENTER_DURATION = 320;
const CHIP_STYLES = {
  accent: "bg-brand-national",
  muted: "bg-brand-type-chip",
  neutral: "bg-brand-type-chip",
} as const;
const CHIP_TEXT_STYLES = {
  accent: "text-brand-deep",
  muted: "text-brand-brown",
  neutral: "text-brand-brown",
} as const;

/** Renderiza una etiqueta compacta de alcance o tipo de festivo. */
function MetaChip({
  label,
  variant,
}: {
  label: string;
  variant: "accent" | "muted" | "neutral";
}) {
  return (
    <View className={`rounded-md px-2.5 py-1 ${CHIP_STYLES[variant]}`}>
      <Text className={`text-[13px] font-medium ${CHIP_TEXT_STYLES[variant]}`}>
        {label}
      </Text>
    </View>
  );
}

/** Presenta fecha, nombre, alcance, tipos y subdivisiones de un festivo. */
const HolidayCard = memo(function HolidayCard({
  holiday,
  copy,
}: {
  holiday: Holiday;
  copy: HolidaysScreenCopy;
}) {
  const regional = isRegionalHoliday(holiday);
  const subdivisions = regional
    ? formatSubdivisionCodes(holiday.subdivisionCodes)
    : null;

  return (
    <View className="flex-row gap-3 rounded-[14px] bg-brand-holiday-card px-3 py-3">
      <View className="w-14 items-center justify-center rounded-[10px] bg-brand-type-chip/35 py-2">
        <Text className="text-[26px] font-semibold text-brand-ink">
          {formatHolidayDay(holiday.date)}
        </Text>
        <Text className="mt-0.5 text-[12px] font-medium uppercase tracking-wide text-brand-weekday">
          {formatWeekdayShort(holiday.date)}
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <Text className="text-[17px] font-medium leading-[22px] text-brand-ink">
          {getHolidayDisplayName(holiday)}
        </Text>

        <View className="mt-2 flex-row flex-wrap gap-1.5">
          <MetaChip
            label={regional ? copy.regional : copy.national}
            variant={regional ? "muted" : "accent"}
          />
          {holiday.holidayTypes.map((type) => (
            <MetaChip
              key={type}
              label={getHolidayTypeLabel(type, copy)}
              variant="neutral"
            />
          ))}
        </View>

        {subdivisions ? (
          <Text className="mt-1.5 text-[12px] leading-4 text-brand-brown">
            {subdivisions}
          </Text>
        ) : null}
      </View>
    </View>
  );
});

/** Añade la animación escalonada de entrada a cada tarjeta. */
const AnimatedHolidayItem = memo(function AnimatedHolidayItem({
  holiday,
  index,
  copy,
}: {
  holiday: Holiday;
  index: number;
  copy: HolidaysScreenCopy;
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
      <HolidayCard holiday={holiday} copy={copy} />
    </Animated.View>
  );
});

/** Construye una clave estable incluso para festivos regionales coincidentes. */
function getHolidayKey(holiday: Holiday): string {
  return [
    holiday.countryCode,
    holiday.date,
    holiday.name,
    holiday.subdivisionCodes?.join(",") ?? "national",
    holiday.holidayTypes.join(","),
  ].join("-");
}

/** Muestra el título de la sección dentro del contenido desplazable. */
function HolidayListTitle({ title }: { title: string }) {
  return (
    <Text className="mb-4 text-[20px] font-semibold text-brand-ink">
      {title}
    </Text>
  );
}

/** Footer con plan de descanso + insight (aislado de las filas memoizadas). */
const HolidayListFooter = memo(function HolidayListFooter({
  copy,
  insight,
}: {
  copy: HolidaysScreenCopy;
  insight: string | null;
}) {
  return (
    <View>
      <PlanRestCard copy={copy} />
      <MonthInsight insight={insight} copy={copy} />
    </View>
  );
});

/** Renderiza estados de carga/error y la lista mensual con su insight. */
export function HolidayList({
  holidays,
  loading,
  error,
  listKey,
  copy,
  insight,
}: HolidayListProps) {
  const insets = useSafeAreaInsets();
  const listBottomPadding = Math.max(insets.bottom, 16) + 28;

  const renderItem = useCallback(
    ({ item, index }: { item: Holiday; index: number }) => (
      <AnimatedHolidayItem holiday={item} index={index} copy={copy} />
    ),
    [copy]
  );

  const listFooter = useMemo(
    () => <HolidayListFooter copy={copy} insight={insight} />,
    [copy, insight]
  );

  const listHeader = useMemo(
    () => <HolidayListTitle title={copy.holidaysTitle} />,
    [copy.holidaysTitle]
  );

  if (loading) {
    return (
      <View>
        <HolidayListTitle title={copy.holidaysTitle} />
        <View className="items-center py-16">
          <ActivityIndicator color="#633806" />
          <Text className="mt-3 text-center text-base text-brand-brown">
            {copy.loadingHolidays}
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <HolidayListTitle title={copy.holidaysTitle} />
        <View className="rounded-[14px] bg-brand-holiday-card px-4 py-4">
          <Text className="text-[15px] leading-5 text-brand-ink">{error}</Text>
        </View>
      </View>
    );
  }

  if (holidays.length === 0) {
    return (
      <View style={{ paddingBottom: listBottomPadding }}>
        <HolidayListTitle title={copy.holidaysTitle} />
        <View className="rounded-[14px] bg-brand-holiday-card px-5 py-10">
          <Text className="text-center text-[17px] leading-5 text-brand-brown">
            {copy.noHolidays}
          </Text>
        </View>
        <MonthInsight insight={insight} copy={copy} />
      </View>
    );
  }

  return (
    <FlatList
      key={listKey}
      data={holidays}
      keyExtractor={getHolidayKey}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "transparent" }}
      contentContainerStyle={{ paddingBottom: listBottomPadding }}
      ListHeaderComponent={listHeader}
      ListFooterComponent={listFooter}
      renderItem={renderItem}
    />
  );
}
