import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type PlanRestCardProps = {
  copy: ReturnType<typeof getHolidaysScreenCopy>;
};

/** Dibuja un calendario con una estrella para representar días de descanso. */
function RestCalendarIcon() {
  return (
    <Svg
      width={76}
      height={62}
      viewBox="0 0 76 62"
      fill="none"
      accessibilityRole="image"
      accessibilityLabel="Calendario de descanso"
    >
      <Path
        d="M14 14.5h43a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4v-34a4 4 0 0 1 4-4ZM10 25h51M21 8v13M50 8v13"
        stroke="#E8A33D"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m35.5 31.5 3.1 6.2 6.8 1-4.9 4.8 1.2 6.8-6.2-3.2-6.1 3.2 1.2-6.8-5-4.8 6.9-1 3-6.2Z"
        stroke="#E8A33D"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M65 8v8M61 12h8M69 22v5M66.5 24.5h5"
        stroke="#E8A33D"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

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
      <RestCalendarIcon />
    </View>
  );
}
