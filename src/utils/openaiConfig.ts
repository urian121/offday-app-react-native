export function getOpenAIConfig() {
  return {
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() ?? "",
    model: process.env.EXPO_PUBLIC_OPENAI_MODEL?.trim() || "gpt-4o-mini",
  };
}
