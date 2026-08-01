import { Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { HolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type MonthInsightProps = {
  insight: string | null;
  copy: HolidaysScreenCopy;
};

/** Muestra el dato curioso solo cuando ya hay texto (sin loading ni vacío). */
export function MonthInsight({ insight, copy }: MonthInsightProps) {
  if (!insight) {
    return null;
  }

  return (
    <View className="mt-4 rounded-[14px] bg-brand-gradient-start px-4 py-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-[20px] font-semibold uppercase tracking-[2px] text-brand-brown">
          {copy.insightTitle}
        </Text>
        <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-brand-calendar-surface">
          <Ionicons
            name="bulb-outline"
            size={20}
            color="#412402"
            accessibilityLabel="Dato curioso"
          />
        </View>
      </View>
      <Text className="mt-2 text-[17px] leading-6 text-brand-deep">
        {insight}
      </Text>
    </View>
  );
}
