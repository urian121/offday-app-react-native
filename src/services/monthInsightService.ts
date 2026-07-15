import OpenAI from "openai";
import { YearHolidayStats } from "../interface/monthInsight";
import {
  getDeviceLanguageCode,
  getDeviceLocale,
  getLanguageDisplayName,
} from "../utils/getDeviceLocale";
import { getOpenAIConfig } from "../utils/openaiConfig";

const insightCache = new Map<string, string>();
const INSIGHT_PROMPT_VERSION = "v1";

/** Construye una clave que invalida caché al cambiar modelo o prompt. */
function getCacheKey(
  stats: YearHolidayStats,
  locale: string,
  model: string
): string {
  return [
    stats.countryCode,
    stats.year,
    stats.selectedMonth,
    locale,
    model,
    INSIGHT_PROMPT_VERSION,
  ].join("-");
}

/** Construye instrucciones para responder en el idioma del dispositivo. */
function buildSystemPrompt(locale: string, languageCode: string): string {
  const languageName = getLanguageDisplayName(languageCode, locale);

  return [
    "You are an editorial assistant for a public holidays app.",
    "You will receive holiday statistics for every month of a year in one country.",
    "Write ONE curious insight (2-3 short sentences, max 280 characters) about the selected month compared to the rest of the year.",
    "Use concrete numbers when helpful (holiday counts, busiest/quietest month, ties, etc.).",
    "If the month is not remarkable, find another interesting angle (holiday types, clustered dates, contrast with other months).",
    "Friendly and useful tone, no emojis or bullet lists.",
    `Reply with only the insight text, written entirely in ${languageName}.`,
    `Device locale: ${locale}. Language code: ${languageCode}.`,
    "Never reply in a different language than the device language.",
  ].join(" ");
}

/** Genera y cachea el dato curioso del mes mediante OpenAI. */
export async function generateMonthInsight(
  stats: YearHolidayStats,
  signal?: AbortSignal
): Promise<string> {
  const { apiKey, model } = getOpenAIConfig();

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY_MISSING");
  }

  const locale = getDeviceLocale();
  const languageCode = getDeviceLanguageCode();
  const cacheKey = getCacheKey(stats, locale, model);
  const cached = insightCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await openai.chat.completions.create(
    {
      model,
      temperature: 0.7,
      max_tokens: 180,
      messages: [
        { role: "system", content: buildSystemPrompt(locale, languageCode) },
        {
          role: "user",
          content: JSON.stringify({
            ...stats,
            deviceLocale: locale,
            responseLanguage: languageCode,
          }),
        },
      ],
    },
    { signal }
  );

  const insight = response.choices[0]?.message?.content?.trim();

  if (!insight) {
    throw new Error("OPENAI_EMPTY_RESPONSE");
  }

  insightCache.set(cacheKey, insight);
  return insight;
}
