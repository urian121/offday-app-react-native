import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

export function useSplashScreen(isContentReady: boolean) {
  const onLoadingScreenLayout = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  const onLayoutRootView = useCallback(() => {}, []);

  return {
    onLayoutRootView,
    onLoadingScreenLayout,
    showLoadingOverlay: !isContentReady,
  };
}
