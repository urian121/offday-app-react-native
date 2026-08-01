import {
  buildModelInput,
  extractReplicateText,
  replicate,
  REPLICATE_FALLBACK_MODEL,
  REPLICATE_MODEL,
} from "./replicate.js";
import { findMonthInsight, saveMonthInsight } from "./db.js";
import {
  isAiBillingOrAuthFailure,
  notifyAiFailure,
} from "./notifyAiFailure.js";
import {
  buildGenericMonthInsight,
  getTemporalRelation,
} from "./genericMonthInsight.js";

/** Promesas en curso por país-año-mes-idioma (evita doble cobro a la IA). */
const inflightInsights = new Map();

/** Tope por modelo (GPT y Gemini). Por defecto 5s cada uno. */
const PRIMARY_TIMEOUT_MS = (() => {
  const value = Number(process.env.REPLICATE_PRIMARY_TIMEOUT_MS || 5000);
  return Number.isFinite(value) && value > 0 ? value : 5000;
})();

const FALLBACK_TIMEOUT_MS = (() => {
  const value = Number(process.env.REPLICATE_FALLBACK_TIMEOUT_MS || 5000);
  return Number.isFinite(value) && value > 0 ? value : 5000;
})();

/** True si el error viene de abort/timeout local. */
function isAbortOrTimeout(error) {
  return (
    error?.name === "AbortError" ||
    error?.message === "REPLICATE_TIMEOUT" ||
    error?.timedOut === true
  );
}

/** Ejecuta un modelo de Replicate y valida que haya texto. */
async function runInsightModel(model, { prompt, systemPrompt }, signal) {
  const output = await replicate.run(model, {
    input: buildModelInput(model, { prompt, systemPrompt }),
    signal,
  });

  const insight = extractReplicateText(output);

  if (!insight) {
    const error = new Error("REPLICATE_EMPTY_RESPONSE");
    error.status = 502;
    error.model = model;
    throw error;
  }

  return insight;
}

/**
 * Corre el modelo con tope de tiempo.
 * Al vencer el timeout aborta la espera y lanza REPLICATE_TIMEOUT.
 */
async function runInsightModelWithTimeout(model, args, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await runInsightModel(model, args, controller.signal);
  } catch (error) {
    if (controller.signal.aborted || isAbortOrTimeout(error)) {
      const timeoutError = new Error("REPLICATE_TIMEOUT");
      timeoutError.status = 504;
      timeoutError.timedOut = true;
      timeoutError.model = model;
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Intenta GPT → Gemini (5s c/u). Si ambos fallan, dato genérico local.
 * Nunca deja al usuario sin texto tras ~10s de IA.
 */
async function createInsightWithAI({ stats, locale, languageCode }) {
  const alertContext = {
    pais: stats.countryCode,
    year: stats.year,
    month: stats.selectedMonth,
    language: languageCode,
  };

  const genericInsight = () =>
    buildGenericMonthInsight(stats, languageCode);

  if (!process.env.REPLICATE_API_TOKEN?.trim()) {
    const error = new Error("REPLICATE_API_TOKEN_MISSING");
    error.status = 503;
    await notifyAiFailure(error, alertContext);
    return genericInsight();
  }

  const temporalRelation = getTemporalRelation(
    stats.year,
    stats.selectedMonth
  );

  const systemPrompt = [
    "You write one short curious insight (2-3 sentences, max 280 chars)",
    "about the selected month of public holidays vs the rest of the year.",
    "Respect temporalRelation tense: past/present/future.",
    `Reply only with the insight text, written entirely in language code "${languageCode}".`,
    `Device locale: ${locale}.`,
    "Never reply in a different language than requested.",
  ].join(" ");

  const prompt = JSON.stringify({
    countryCode: stats.countryCode,
    year: stats.year,
    selectedMonth: stats.selectedMonth,
    selectedMonthName: stats.selectedMonthName,
    yearTotal: stats.yearTotal,
    temporalRelation,
    monthCounts: stats.months.map(({ month, monthName, count }) => ({
      month,
      monthName,
      count,
    })),
    selectedHolidays: stats.selectedHolidays,
    locale,
    responseLanguage: languageCode,
  });

  const modelArgs = { prompt, systemPrompt };
  const primaryModel = REPLICATE_MODEL;
  const fallbackModel = REPLICATE_FALLBACK_MODEL;
  const canFallback =
    Boolean(fallbackModel) && fallbackModel !== primaryModel;

  try {
    return await runInsightModelWithTimeout(
      primaryModel,
      modelArgs,
      PRIMARY_TIMEOUT_MS
    );
  } catch (primaryError) {
    if (isAiBillingOrAuthFailure(primaryError) || !canFallback) {
      await notifyAiFailure(primaryError, {
        ...alertContext,
        model: primaryModel,
      });
      return genericInsight();
    }

    try {
      return await runInsightModelWithTimeout(
        fallbackModel,
        modelArgs,
        FALLBACK_TIMEOUT_MS
      );
    } catch (fallbackError) {
      await notifyAiFailure(fallbackError, {
        ...alertContext,
        model: fallbackModel,
        primaryModel,
        primaryError: primaryError?.message,
      });
      return genericInsight();
    }
  }
}

/**
 * Busca el dato del mes en BD (país + año + mes + idioma).
 * Si existe lo retorna; si no, lo genera (IA o genérico) y lo guarda.
 * Las peticiones concurrentes de la misma clave comparten una sola generación.
 */
export async function generateMonthInsight({
  stats,
  locale = "en-US",
  languageCode = "en",
}) {
  const pais = stats.countryCode;
  const year = stats.year;
  const month = stats.selectedMonth;
  const language = languageCode.toLowerCase();
  const cacheKey = `${pais}-${year}-${month}-${language}`;

  const existing = inflightInsights.get(cacheKey);
  if (existing) {
    return existing;
  }

  const pending = (async () => {
    try {
      const stored = await findMonthInsight(pais, year, month, language);
      if (stored) {
        return stored;
      }

      const insight = await createInsightWithAI({
        stats,
        locale,
        languageCode: language,
      });
      await saveMonthInsight({ pais, year, month, language, note: insight });

      return insight;
    } finally {
      inflightInsights.delete(cacheKey);
    }
  })();

  inflightInsights.set(cacheKey, pending);
  return pending;
}
