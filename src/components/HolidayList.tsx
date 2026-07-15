import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Holiday } from "../interface/holiday";
import { formatHolidayDay, formatWeekdayShort } from "../utils/dateFormat";
import {
  formatSubdivisionCodes,
  getHolidayTypeLabel,
  isRegionalHoliday,
} from "../utils/holidayMeta";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";
import { getHolidayDisplayName } from "../utils/getHolidayDisplayName";
import { MonthInsight } from "./MonthInsight";
import { PlanRestCard } from "./PlanRestCard";

type HolidayListProps = {
  holidays: Holiday[];
  loading: boolean;
  error: string | null;
  listKey: string;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
  insight: string | null;
  insightLoading: boolean;
  insightError: string | null;
};

const STAGGER_MS = 75;
const ENTER_DURATION = 320;
const CHIP_STYLES = {
  accent: "bg-brand-accent-soft/60",
  muted: "bg-brand-surface/90",
  neutral: "bg-white/70",
} as const;
const CHIP_TEXT_STYLES = {
  accent: "text-brand-accent",
  muted: "text-brand-ink",
  neutral: "text-brand-muted",
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
      <Text
        className={`text-[13px] font-medium ${CHIP_TEXT_STYLES[variant]}`}
      >
        {label}
      </Text>
    </View>
  );
}

/** Presenta fecha, nombre, alcance, tipos y subdivisiones de un festivo. */
function HolidayCard({
  holiday,
  copy,
}: {
  holiday: Holiday;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
}) {
  const regional = isRegionalHoliday(holiday);
  const subdivisions = regional
    ? formatSubdivisionCodes(holiday.subdivisionCodes)
    : null;

  return (
    <View className="flex-row gap-4 rounded-2xl bg-white/50 px-4 py-4">
      <View className="w-14 items-center rounded-xl bg-brand-surface/80 py-2.5">
        <Text className="text-2xl font-semibold text-brand-ink">
          {formatHolidayDay(holiday.date)}
        </Text>
        <Text className="mt-0.5 text-[11px] uppercase tracking-wide text-brand-muted">
          {formatWeekdayShort(holiday.date)}
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <Text className="text-[17px] font-medium leading-6 text-brand-ink">
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
          <Text className="mt-1.5 text-[11px] leading-4 text-brand-muted">
            {subdivisions}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/** Añade la animación escalonada de entrada a cada tarjeta. */
function AnimatedHolidayItem({
  holiday,
  index,
  copy,
}: {
  holiday: Holiday;
  index: number;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
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
}

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
    <Text className="mb-5 text-xl font-semibold text-brand-ink">{title}</Text>
  );
}

/** Renderiza estados de carga/error y la lista mensual con su insight. */
export function HolidayList({
  holidays,
  loading,
  error,
  listKey,
  copy,
  insight,
  insightLoading,
  insightError,
}: HolidayListProps) {
  if (loading) {
    return (
      <View>
        <HolidayListTitle title={copy.holidaysTitle} />
        <View className="items-center py-16">
          <ActivityIndicator color="#7A7269" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <HolidayListTitle title={copy.holidaysTitle} />
        <View className="rounded-2xl bg-brand-accent-soft/35 px-4 py-4">
          <Text className="text-sm leading-5 text-brand-ink">{error}</Text>
        </View>
      </View>
    );
  }

  const insightContent = (
    <MonthInsight
      insight={insight}
      loading={insightLoading}
      error={insightError}
      copy={copy}
    />
  );
  const listFooter = (
    <View>
      <PlanRestCard copy={copy} />
      {insightContent}
    </View>
  );

  if (holidays.length === 0) {
    return (
      <View>
        <HolidayListTitle title={copy.holidaysTitle} />
        <View className="rounded-2xl bg-brand-surface/50 px-5 py-10">
          <Text className="text-center text-sm leading-5 text-brand-muted">
            {copy.noHolidays}
          </Text>
        </View>
        {insightContent}
      </View>
    );
  }

  return (
    <FlatList
      key={listKey}
      data={holidays}
      keyExtractor={getHolidayKey}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
      ListHeaderComponent={<HolidayListTitle title={copy.holidaysTitle} />}
      ListFooterComponent={listFooter}
      renderItem={({ item, index }) => (
        <AnimatedHolidayItem holiday={item} index={index} copy={copy} />
      )}
    />
  );
}
