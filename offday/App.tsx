import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppLoadingScreen } from "./src/components/AppLoadingScreen";
import { HolidaysScreen } from "./src/components/HolidaysScreen";
import { useSplashScreen } from "./src/hooks/useSplashScreen";
import "./global.css";
import * as Sentry from '@sentry/react-native';

const APP_BACKGROUND = "#fff5ea";

Sentry.init({
  dsn: "https://7ccf490b0bb706724a6add6fce92e53b@o4511764979122176.ingest.us.sentry.io/4511765040136192",

  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

/** Configura los proveedores nativos y el árbol principal de la aplicación. */
export default Sentry.wrap(function App() {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(APP_BACKGROUND);
  }, []);

  return (
    <GestureHandlerRootView
      className="flex-1 bg-brand-base"
      style={{ backgroundColor: APP_BACKGROUND }}
    >
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <BottomSheetModalProvider>
          <AppContent />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});

/** Coordina la pantalla principal y la transición del overlay de carga. */
function AppContent() {
  const [contentReady, setContentReady] = useState(false);
  const { onLoadingScreenLayout, showLoadingOverlay } =
    useSplashScreen(contentReady);

  return (
    <View
      className="flex-1 bg-brand-base"
      style={{ backgroundColor: APP_BACKGROUND }}
    >
      <SafeAreaView className="flex-1 w-full" edges={["top", "left", "right"]}>
        <HolidaysScreen onReady={() => setContentReady(true)} />
      </SafeAreaView>

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
