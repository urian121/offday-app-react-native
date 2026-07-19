import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Image, Text, View } from "react-native";
import {
  APP_GRADIENT_COLORS,
  APP_GRADIENT_LOCATIONS,
} from "../utils/appGradient";
import { getAppCopy } from "../utils/getAppCopy";

type AppLoadingScreenProps = {
  onLayout?: () => void;
};

/** Muestra el estado de carga inicial mientras se obtienen los festivos. */
export function AppLoadingScreen({ onLayout }: AppLoadingScreenProps) {
  const copy = getAppCopy();

  return (
    <View className="absolute inset-0 z-50" onLayout={onLayout}>
      <LinearGradient
        colors={APP_GRADIENT_COLORS}
        locations={APP_GRADIENT_LOCATIONS}
        className="flex-1 items-center justify-center px-8"
      >
        <Image
          source={require("../../assets/splash-icon.png")}
          className="h-28 w-28"
          resizeMode="contain"
        />
        <Text className="mt-6 text-center text-[15px] leading-6 text-brand-ink">
          {copy.appLoading}
        </Text>
        <ActivityIndicator className="mt-5" color="#7A7269" />
      </LinearGradient>
    </View>
  );
}
