import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

/** Sustituye el splash nativo por el overlay hasta completar la carga inicial. */
export function useSplashScreen(isContentReady: boolean) {
  /** Oculta el splash nativo cuando el overlay de React ya está dibujado. */
  const onLoadingScreenLayout = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  return {
    onLoadingScreenLayout,
    showLoadingOverlay: !isContentReady,
  };
}
