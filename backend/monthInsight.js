import { openai, OPENAI_MODEL } from "./openai.js";
import { findMonthInsight, saveMonthInsight } from "./db.js";

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

/** Genera el texto del insight con OpenAI. */
async function createInsightWithAI({ stats, locale, languageCode }) {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    const error = new Error("OPENAI_API_KEY_MISSING");
    error.status = 503;
    throw error;
  }

  const temporalRelation = getTemporalRelation(
    stats.year,
    stats.selectedMonth
  );

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.7,
    max_tokens: 180,
    messages: [
      {
        role: "system",
        content: [
          "You write one short curious insight (2-3 sentences, max 280 chars)",
          "about the selected month of public holidays vs the rest of the year.",
          "Respect temporalRelation tense: past/present/future.",
          `Reply only with the insight text in language: ${languageCode} (locale ${locale}).`,
        ].join(" "),
      },
      {
        role: "user",
        content: JSON.stringify({ ...stats, temporalRelation, locale }),
      },
    ],
  });

  const insight = response.choices[0]?.message?.content?.trim();

  if (!insight) {
    const error = new Error("OPENAI_EMPTY_RESPONSE");
    error.status = 502;
    throw error;
  }

  return insight;
}

/**
 * Busca el dato del mes en BD (país + año + mes).
 * Si existe lo retorna; si no, lo genera con IA y lo guarda.
 */
export async function generateMonthInsight({
  stats,
  locale = "en-US",
  languageCode = "en",
}) {
  const pais = stats.countryCode;
  const year = stats.year;
  const month = stats.selectedMonth;

  const stored = await findMonthInsight(pais, year, month);
  if (stored) {
    return stored;
  }

  const insight = await createInsightWithAI({ stats, locale, languageCode });
  await saveMonthInsight({ pais, year, month, note: insight });

  return (await findMonthInsight(pais, year, month)) ?? insight;
}
