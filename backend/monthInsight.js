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

/** Promesas en curso por país-año-mes-idioma (evita doble cobro a la IA). */
const inflightInsights = new Map();

/** Relación temporal del mes seleccionado respecto a hoy. */
function getTemporalRelation(year, month) {
  const today = new Date();
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

/** Ejecuta un modelo de Replicate y valida que haya texto. */
async function runInsightModel(model, { prompt, systemPrompt }) {
  const output = await replicate.run(model, {
    input: buildModelInput(model, { prompt, systemPrompt }),
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

/** Genera el texto del insight con Replicate (GPT → Gemini si falla). */
async function createInsightWithAI({ stats, locale, languageCode }) {
  const alertContext = {
    pais: stats.countryCode,
    year: stats.year,
    month: stats.selectedMonth,
    language: languageCode,
  };

  if (!process.env.REPLICATE_API_TOKEN?.trim()) {
    const error = new Error("REPLICATE_API_TOKEN_MISSING");
    error.status = 503;
    await notifyAiFailure(error, alertContext);
    throw error;
  }

  const temporalRelation = getTemporalRelation(
    stats.year,
    stats.selectedMonth
  );

  const systemPrompt = [
    "You write one short curious insight (3-4 sentences, max 320 chars)",
    "about the selected month of public holidays vs the rest of the year.",
    "Respect temporalRelation tense: past/present/future.",
    `Reply only with the insight text, written entirely in language code "${languageCode}".`,
    `Device locale: ${locale}.`,
    "Never reply in a different language than requested.",
  ].join(" ");

  // Payload mínimo: conteos anuales + detalle solo del mes activo.
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

  const primaryModel = REPLICATE_MODEL;
  const fallbackModel = REPLICATE_FALLBACK_MODEL;
  const canFallback =
    Boolean(fallbackModel) && fallbackModel !== primaryModel;

  try {
    return await runInsightModel(primaryModel, { prompt, systemPrompt });
  } catch (primaryError) {
    // Sin créditos/token: Gemini usaría la misma cuenta; no tiene sentido reintentar.
    if (isAiBillingOrAuthFailure(primaryError) || !canFallback) {
      await notifyAiFailure(primaryError, {
        ...alertContext,
        model: primaryModel,
      });
      throw primaryError;
    }

    try {
      return await runInsightModel(fallbackModel, { prompt, systemPrompt });
    } catch (fallbackError) {
      await notifyAiFailure(fallbackError, {
        ...alertContext,
        model: fallbackModel,
        primaryModel,
        primaryError: primaryError?.message,
      });
      throw fallbackError;
    }
  }
}

/**
 * Busca el dato del mes en BD (país + año + mes + idioma).
 * Si existe lo retorna; si no, lo genera con IA y lo guarda.
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
