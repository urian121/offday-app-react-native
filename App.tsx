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
import "./global.css";

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <AppContent />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const [contentReady, setContentReady] = useState(false);
  const { onLayoutRootView, onLoadingScreenLayout, showLoadingOverlay } =
    useSplashScreen(contentReady);

  return (
    <View className="flex-1 bg-brand-cream">
      <View className="flex-1" onLayout={onLayoutRootView}>
        <View className="absolute inset-x-0 top-0 h-[55%]">
          <LinearGradient
            colors={["#DAA428", "#E9C980", "#F3DEB1", "#FFFFFF"]}
            locations={[0, 0.15, 0.45, 1]}
            className="size-full"
          />
        </View>
        <SafeAreaView className="flex-1 w-full">
          <StatusBar style="dark" hidden={true} />
          <HolidaysScreen onReady={() => setContentReady(true)} />
        </SafeAreaView>
      </View>

      {showLoadingOverlay ? (
        <Animated.View className="absolute inset-0" exiting={FadeOut.duration(280)}>
          <AppLoadingScreen onLayout={onLoadingScreenLayout} />
        </Animated.View>
      ) : null}
    </View>
  );
}
