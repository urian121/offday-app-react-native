import { ActivityIndicator, Text, View } from "react-native";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type MonthInsightProps = {
  insight: string | null;
  loading: boolean;
  error: string | null;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
};

function resolveErrorMessage(
  error: string,
  copy: ReturnType<typeof getHolidaysScreenCopy>
): string {
  if (error === "OPENAI_API_KEY_MISSING") {
    return copy.insightMissingKey;
  }

  if (error === "OPENAI_EMPTY_RESPONSE") {
    return copy.insightError;
  }

  return copy.insightError;
}

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
        <Text className="mt-3 text-center text-sm text-brand-muted">
          {copy.insightLoading}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-5 rounded-2xl bg-brand-surface/40 px-5 py-5">
        <Text className="text-[11px] font-medium uppercase tracking-[2px] text-brand-muted">
          {copy.insightTitle}
        </Text>
        <Text className="mt-2 text-sm leading-5 text-brand-muted">
          {resolveErrorMessage(error, copy)}
        </Text>
      </View>
    );
  }

  if (!insight) {
    return null;
  }

  return (
    <View className="mt-5 rounded-2xl bg-brand-surface/40 px-5 py-5">
      <Text className="text-[11px] font-medium uppercase tracking-[2px] text-brand-muted">
        {copy.insightTitle}
      </Text>
      <Text className="mt-2 text-[15px] leading-6 text-brand-ink">{insight}</Text>
    </View>
  );
}
