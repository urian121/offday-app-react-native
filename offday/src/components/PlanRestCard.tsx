import { Text, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type PlanRestCardProps = {
  copy: ReturnType<typeof getHolidaysScreenCopy>;
};

/** Invita a organizar el descanso aprovechando los festivos del mes. */
export function PlanRestCard({ copy }: PlanRestCardProps) {
  return (
    <View className="flex-row items-center overflow-hidden rounded-[14px] bg-brand-rest-surface px-4 py-4">
      <View className="min-w-0 flex-1 pr-3">
        <Text className="text-[16px] font-semibold text-brand-base">
          {copy.restPlanTitle}
        </Text>
        <Text className="mt-1 text-[14px] leading-[19px] text-brand-rest-muted">
          {copy.restPlanSubtitle}
        </Text>
      </View>
      <MaterialDesignIcons
        name="calendar-star"
        size={40}
        color="#E8A33D"
        accessibilityLabel="Calendario de descanso"
      />
    </View>
  );
}
