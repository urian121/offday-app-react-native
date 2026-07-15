import { ActivityIndicator, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type MonthInsightProps = {
  insight: string | null;
  loading: boolean;
  error: string | null;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
};

/** Dibuja un bombillo para identificar visualmente el dato curioso. */
function LightbulbIcon() {
  return (
    <Svg
      width={23}
      height={23}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityRole="image"
      accessibilityLabel="Dato curioso"
    >
      <Path
        d="M9 18h6M10 22h4M15.09 14c.18-.66.66-1.18 1.11-1.66a6 6 0 1 0-8.4 0c.45.48.93 1 1.11 1.66Z"
        stroke="#C4715A"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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
    <View className="mt-5 rounded-2xl bg-brand-surface/80 px-5 py-5">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-lg font-medium uppercase tracking-[2px] text-brand-muted">
          {copy.insightTitle}
        </Text>
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-accent-soft/50">
          <LightbulbIcon />
        </View>
      </View>
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
