import Replicate from "replicate";

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/** Modelo principal (ChatGPT). */
export const REPLICATE_MODEL =
  process.env.REPLICATE_MODEL?.trim() || "openai/gpt-4.1-mini";

/** Modelo alternativo si falla el principal (Gemini). */
export const REPLICATE_FALLBACK_MODEL =
  process.env.REPLICATE_FALLBACK_MODEL?.trim() || "google/gemini-2.5-flash";

/** Arma el input según el proveedor del modelo en Replicate. */
export function buildModelInput(model, { prompt, systemPrompt }) {
  const isGoogle = model.startsWith("google/");

  if (isGoogle) {
    return {
      prompt,
      system_instruction: systemPrompt,
      temperature: 0.7,
      max_output_tokens: 180,
      // Evita “thinking” largo: queremos un insight corto y barato.
      thinking_budget: 0,
    };
  }

  return {
    prompt,
    system_prompt: systemPrompt,
    temperature: 0.7,
    max_completion_tokens: 180,
  };
}

/** Normaliza la salida de Replicate (string | string[] | objeto) a texto. */
export function extractReplicateText(output) {
  if (typeof output === "string") {
    return output.trim();
  }

  if (Array.isArray(output)) {
    return output.map(String).join("").trim();
  }

  if (output && typeof output === "object") {
    if (typeof output.text === "string") {
      return output.text.trim();
    }

    if (typeof output.output === "string") {
      return output.output.trim();
    }
  }

  return "";
}
