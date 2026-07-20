import { ActivityIndicator, Image, Text, View } from "react-native";
import { getAppCopy } from "../utils/getAppCopy";

type AppLoadingScreenProps = {
  onLayout?: () => void;
};

/** Muestra el estado de carga inicial mientras se obtienen los festivos. */
export function AppLoadingScreen({ onLayout }: AppLoadingScreenProps) {
  const copy = getAppCopy();

  return (
    <View
      className="absolute inset-0 z-50 items-center justify-center bg-[#E9C980] px-8"
      onLayout={onLayout}
    >
      <Image
        source={require("../../assets/splash-icon.png")}
        className="h-[180px] w-[180px]"
        resizeMode="contain"
      />
      <Text className="mt-6 text-center text-[28px] font-semibold tracking-wide text-brand-deep">
        {copy.appName}
      </Text>
      <Text className="mt-2 text-center text-base text-brand-brown">
        {copy.appLoading}
      </Text>
      <ActivityIndicator className="mt-5" color="#633806" />
    </View>
  );
}
