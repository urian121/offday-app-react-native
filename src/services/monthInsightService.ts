import OpenAI from "openai";
import { YearHolidayStats } from "../interface/monthInsight";
import {
  getDeviceLanguageCode,
  getDeviceLocale,
  getLanguageDisplayName,
} from "../utils/getDeviceLocale";
import { getOpenAIConfig } from "../utils/openaiConfig";

const insightCache = new Map<string, string>();
const INSIGHT_PROMPT_VERSION = "v2";

type TemporalRelation = "past" | "present" | "future";

/** Compara el mes seleccionado con la fecha real del dispositivo. */
function getTemporalRelation(
  year: number,
  month: number,
  today: Date = new Date()
): TemporalRelation {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "past";
  }

  if (year === currentYear && month === currentMonth) {
    return "present";
  }

  return "future";
}

/** Formatea la fecha actual como YYYY-MM-DD sin zona horaria ambigua. */
function formatTodayIso(today: Date = new Date()): string {
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Construye una clave que invalida caché al cambiar modelo, prompt o mes real. */
function getCacheKey(
  stats: YearHolidayStats,
  locale: string,
  model: string,
  todayMonthKey: string,
  temporalRelation: TemporalRelation
): string {
  return [
    stats.countryCode,
    stats.year,
    stats.selectedMonth,
    locale,
    model,
    INSIGHT_PROMPT_VERSION,
    todayMonthKey,
    temporalRelation,
  ].join("-");
}

/** Construye instrucciones para responder en el idioma y tiempo verbal correctos. */
function buildSystemPrompt(locale: string, languageCode: string): string {
  const languageName = getLanguageDisplayName(languageCode, locale);

  return [
    "You are an editorial assistant for a public holidays app.",
    "You will receive holiday statistics for every month of a year in one country.",
    "You will also receive today's real calendar date and whether the selected month is past, present, or future relative to today.",
    "Write ONE curious insight (2-3 short sentences, max 280 characters) about the selected month compared to the rest of the year.",
    "Use concrete numbers when helpful (holiday counts, busiest/quietest month, ties, etc.).",
    "If the month is not remarkable, find another interesting angle (holiday types, clustered dates, contrast with other months).",
    "CRITICAL: Always respect the temporalRelation field.",
    "If temporalRelation is past, write only in past tense about that month and year (never future).",
    "If temporalRelation is present, write in present tense.",
    "If temporalRelation is future, write in future tense.",
    "Never talk about a past month as if it has not happened yet.",
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
  const today = new Date();
  const todayIso = formatTodayIso(today);
  const todayMonthKey = todayIso.slice(0, 7);
  const temporalRelation = getTemporalRelation(
    stats.year,
    stats.selectedMonth,
    today
  );
  const cacheKey = getCacheKey(
    stats,
    locale,
    model,
    todayMonthKey,
    temporalRelation
  );
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
            today: todayIso,
            temporalRelation,
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
