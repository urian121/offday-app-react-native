/**
 * Dato curioso local (sin IA) a partir de los conteos del mes/año.
 * Se usa cuando GPT y Gemini fallan o superan el timeout.
 */

/** Relación temporal del mes seleccionado respecto a hoy. */
export function getTemporalRelation(year, month) {
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

/** Plural simple es/en para “festivo(s)”. */
function holidayWord(count, language) {
  if (language === "es") {
    return count === 1 ? "festivo" : "festivos";
  }

  return count === 1 ? "holiday" : "holidays";
}

/** Verbo ES según tiempo verbal. */
function monthVerbEs(relation) {
  if (relation === "past") return "tuvo";
  if (relation === "present") return "tiene";
  return "tendrá";
}

/** Frase EN “there was/were/are/will be”. */
function thereBeEn(relation, count) {
  const plural = count !== 1;

  if (relation === "past") {
    return plural ? "there were" : "there was";
  }

  if (relation === "present") {
    return plural ? "there are" : "there is";
  }

  return "there will be";
}

/** Encuentra el mes con más festivos (distinto al seleccionado si es posible). */
function findPeakMonth(months, selectedMonth) {
  let peak = null;

  for (const entry of months) {
    if (!peak || entry.count > peak.count) {
      peak = entry;
    }
  }

  if (peak && peak.month === selectedMonth && months.length > 1) {
    const other = months
      .filter((entry) => entry.month !== selectedMonth)
      .sort((a, b) => b.count - a.count)[0];

    if (other && other.count > 0) {
      return other;
    }
  }

  return peak;
}

/**
 * Arma un insight corto y determinista con los stats ya validados.
 * @returns {string}
 */
export function buildGenericMonthInsight(stats, languageCode = "en") {
  const language = String(languageCode).toLowerCase().startsWith("es")
    ? "es"
    : "en";
  const relation = getTemporalRelation(stats.year, stats.selectedMonth);
  const monthCount =
    stats.months.find((entry) => entry.month === stats.selectedMonth)?.count ??
    stats.selectedHolidays.length;
  const yearTotal = stats.yearTotal;
  const monthName = stats.selectedMonthName;
  const year = stats.year;
  const word = holidayWord(monthCount, language);
  const peak = findPeakMonth(stats.months, stats.selectedMonth);
  const firstHoliday = stats.selectedHolidays[0]?.name;

  if (language === "es") {
    const verb = monthVerbEs(relation);
    const holidayBit = firstHoliday
      ? monthCount === 1
        ? ` (${firstHoliday})`
        : `, entre ellos ${firstHoliday}`
      : "";
    const contrast =
      peak && peak.count > monthCount
        ? ` En cambio, ${peak.monthName} concentra ${peak.count} ${holidayWord(peak.count, "es")}.`
        : yearTotal > 0
          ? ` En total, ${year} suma ${yearTotal} ${holidayWord(yearTotal, "es")}.`
          : "";

    return `En ${monthName} de ${year} ${verb} ${monthCount} ${word}${holidayBit}.${contrast}`.trim();
  }

  const thereBe = thereBeEn(relation, monthCount);
  const holidayBit = firstHoliday
    ? monthCount === 1
      ? ` (${firstHoliday})`
      : `, including ${firstHoliday}`
    : "";
  const contrast =
    peak && peak.count > monthCount
      ? ` By contrast, ${peak.monthName} has ${peak.count} ${holidayWord(peak.count, "en")}.`
      : yearTotal > 0
        ? ` Overall, ${year} has ${yearTotal} ${holidayWord(yearTotal, "en")}.`
        : "";

  return `In ${monthName} ${year} ${thereBe} ${monthCount} ${word}${holidayBit}.${contrast}`.trim();
}
