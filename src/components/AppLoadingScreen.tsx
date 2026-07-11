import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { getAppCopy } from "../utils/getAppCopy";

type AppLoadingScreenProps = {
  onLayout?: () => void;
};

export function AppLoadingScreen({ onLayout }: AppLoadingScreenProps) {
  const copy = getAppCopy();

  return (
    <View className="absolute inset-0 z-50" onLayout={onLayout}>
      <LinearGradient
        colors={["#DAA428", "#E9C980", "#F3DEB1", "#FFFFFF"]}
        locations={[0, 0.15, 0.45, 1]}
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
