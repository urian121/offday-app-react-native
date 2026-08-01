import Constants from "expo-constants";
import { isAbsoluteHttpUrl } from "./resolveHttpUrl";

type ExpoExtra = {
  apiUrl?: string;
};

/** Lee la URL base del backend Offday desde el entorno o el `extra` del build. */
export function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as ExpoExtra | undefined;

  const candidate =
    (typeof process.env.EXPO_PUBLIC_API_URL === "string"
      ? process.env.EXPO_PUBLIC_API_URL.trim()
      : "") ||
    (typeof extra?.apiUrl === "string" ? extra.apiUrl.trim() : "") ||
    "";

  if (!candidate || !isAbsoluteHttpUrl(candidate)) {
    return "";
  }

  return candidate.replace(/\/$/, "");
}
