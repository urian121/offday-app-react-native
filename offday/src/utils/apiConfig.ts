import Constants from "expo-constants";

type ExpoExtra = {
  apiUrl?: string;
};

/** Lee la URL base del backend Offday desde el entorno o el `extra` del build. */
export function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as ExpoExtra | undefined;

  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL?.trim() ||
    extra?.apiUrl?.trim() ||
    "";

  return apiUrl.replace(/\/$/, "");
}
