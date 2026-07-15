import { ActivityIndicator, Text, View } from "react-native";
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
      <View className="mt-5 items-center rounded-2xl bg-brand-surface/40 px-5 py-6">
        <ActivityIndicator color="#7A7269" />
        <Text className="mt-3 text-center text-base text-brand-muted">
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
    <View className="mt-5 rounded-2xl bg-brand-surface/40 px-5 py-5">
      <Text className="text-sm font-medium uppercase tracking-[2px] text-brand-muted">
        {copy.insightTitle}
      </Text>
      <Text
        className={`mt-2 leading-6 ${
          error ? "text-base text-brand-muted" : "text-[17px] text-brand-ink"
        }`}
      >
        {message}
      </Text>
    </View>
  );
}
