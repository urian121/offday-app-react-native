import Constants from "expo-constants";

type ExpoExtra = {
  openaiApiKey?: string;
  openaiModel?: string;
};

/** Lee la configuración de OpenAI desde el entorno o el `extra` del build. */
export function getOpenAIConfig() {
  const extra = Constants.expoConfig?.extra as ExpoExtra | undefined;

  // En `expo start`, Metro inyecta EXPO_PUBLIC_*.
  // En EAS Build (local/cloud), esas vars a menudo no llegan al JS;
  // app.config.js las copia a `extra` al evaluar la config.
  const apiKey =
    process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() ||
    extra?.openaiApiKey?.trim() ||
    "";

  const model =
    process.env.EXPO_PUBLIC_OPENAI_MODEL?.trim() ||
    extra?.openaiModel?.trim() ||
    "gpt-4o-mini";

  return { apiKey, model };
}
