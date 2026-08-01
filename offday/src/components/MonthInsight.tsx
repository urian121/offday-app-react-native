import { ActivityIndicator, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { HolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type MonthInsightProps = {
  insight: string | null;
  loading: boolean;
  error: string | null;
  copy: HolidaysScreenCopy;
};

/** Presenta el estado de carga, contenido o aviso genérico del insight mensual. */
export function MonthInsight({
  insight,
  loading,
  error,
  copy,
}: MonthInsightProps) {
  if (loading) {
    return (
      <View className="mt-4 items-center rounded-[14px] bg-brand-gradient-start px-5 py-6">
        <ActivityIndicator color="#633806" />
        <Text className="mt-3 text-center text-base text-brand-brown">
          {copy.insightLoading}
        </Text>
      </View>
    );
  }

  if (!error && !insight) {
    return null;
  }

  // Ante cualquier fallo de IA/API: mensaje genérico, sin detalles técnicos.
  const message = error ? copy.insightUnavailable : insight;

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
      <Text
        className={`mt-2 leading-6 ${
          error ? "text-base text-brand-brown" : "text-[17px] text-brand-deep"
        }`}
      >
        {message}
      </Text>
    </View>
  );
}
