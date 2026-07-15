import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppLoadingScreen } from "./src/components/AppLoadingScreen";
import { HolidaysScreen } from "./src/components/HolidaysScreen";
import { useSplashScreen } from "./src/hooks/useSplashScreen";
import {
  APP_GRADIENT_COLORS,
  APP_GRADIENT_LOCATIONS,
} from "./src/utils/appGradient";
import "./global.css";

/** Configura los proveedores nativos y el árbol principal de la aplicación. */
export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <BottomSheetModalProvider>
          <AppContent />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/** Coordina la pantalla principal y la transición del overlay de carga. */
function AppContent() {
  const [contentReady, setContentReady] = useState(false);
  const { onLoadingScreenLayout, showLoadingOverlay } =
    useSplashScreen(contentReady);

  return (
    <View className="flex-1 bg-brand-cream">
      <View className="flex-1">
        <View className="absolute inset-x-0 top-0 h-[55%]">
          <LinearGradient
            colors={APP_GRADIENT_COLORS}
            locations={APP_GRADIENT_LOCATIONS}
            className="size-full"
          />
        </View>
        <SafeAreaView className="flex-1 w-full" edges={["top", "left", "right"]}>
          <HolidaysScreen onReady={() => setContentReady(true)} />
        </SafeAreaView>
      </View>

      {showLoadingOverlay ? (
        <Animated.View
          className="absolute inset-0"
          exiting={FadeOut.duration(280)}
        >
          <AppLoadingScreen onLayout={onLoadingScreenLayout} />
        </Animated.View>
      ) : null}
    </View>
  );
}
