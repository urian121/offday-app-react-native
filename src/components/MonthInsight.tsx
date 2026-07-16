import { ActivityIndicator, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type MonthInsightProps = {
  insight: string | null;
  loading: boolean;
  error: string | null;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
};

/** Traduce códigos técnicos del servicio de IA a mensajes para la interfaz. */
function resolveErrorMessage(
  error: string,
  copy: ReturnType<typeof getHolidaysScreenCopy>
): string {
  if (error === "OPENAI_API_KEY_MISSING") {
    return copy.insightMissingKey;
  }

  return copy.insightError;
}

/** Presenta el estado de carga, error o contenido del insight mensual. */
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

  const message = error ? resolveErrorMessage(error, copy) : insight;

  return (
    <View className="mt-4 rounded-[14px] bg-brand-gradient-start px-4 py-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-[15px] font-medium uppercase tracking-[2px] text-brand-brown">
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
          error ? "text-base text-brand-brown" : "text-[16px] text-brand-deep"
        }`}
      >
        {message}
      </Text>
    </View>
  );
}
