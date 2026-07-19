/** Valida si un valor es string no vacío dentro de un límite de longitud. */
function isNonEmptyString(value, maxLength) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

/** Valida enteros dentro de un rango inclusivo. */
function isIntegerInRange(value, min, max) {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}

/** Valida un festivo individual del payload. */
function isValidHoliday(holiday) {
  return (
    holiday &&
    typeof holiday === "object" &&
    !Array.isArray(holiday) &&
    isNonEmptyString(holiday.name, 200) &&
    typeof holiday.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(holiday.date) &&
    typeof holiday.national === "boolean" &&
    Array.isArray(holiday.types) &&
    holiday.types.length <= 20 &&
    holiday.types.every((type) => isNonEmptyString(type, 40))
  );
}

/** Valida el resumen de un mes. */
function isValidMonthSummary(monthSummary) {
  return (
    monthSummary &&
    typeof monthSummary === "object" &&
    !Array.isArray(monthSummary) &&
    isIntegerInRange(monthSummary.month, 1, 12) &&
    isNonEmptyString(monthSummary.monthName, 40) &&
    isIntegerInRange(monthSummary.count, 0, 50) &&
    Array.isArray(monthSummary.holidays) &&
    monthSummary.holidays.length <= 50 &&
    monthSummary.holidays.every(isValidHoliday)
  );
}

/**
 * Valida y normaliza el body de POST /api/month-insight.
 * @returns {{ stats: object, locale: string, languageCode: string } | null}
 */
export function parseMonthInsightBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const { stats, locale, languageCode } = body;

  if (!stats || typeof stats !== "object" || Array.isArray(stats)) {
    return null;
  }

  if (
    !isNonEmptyString(stats.countryCode, 2) ||
    !/^[A-Za-z]{2}$/.test(stats.countryCode.trim())
  ) {
    return null;
  }

  if (!isIntegerInRange(stats.year, 1970, 2100)) {
    return null;
  }

  if (!isIntegerInRange(stats.selectedMonth, 1, 12)) {
    return null;
  }

  if (!isNonEmptyString(stats.selectedMonthName, 40)) {
    return null;
  }

  if (!isIntegerInRange(stats.yearTotal, 0, 500)) {
    return null;
  }

  if (
    !Array.isArray(stats.months) ||
    stats.months.length === 0 ||
    stats.months.length > 12 ||
    !stats.months.every(isValidMonthSummary)
  ) {
    return null;
  }

  if (
    locale != null &&
    (typeof locale !== "string" ||
      locale.length > 20 ||
      !/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(locale))
  ) {
    return null;
  }

  if (
    languageCode != null &&
    (typeof languageCode !== "string" ||
      !/^[a-z]{2,3}$/i.test(languageCode) ||
      languageCode.length > 3)
  ) {
    return null;
  }

  return {
    stats: {
      countryCode: stats.countryCode.trim().toUpperCase(),
      year: stats.year,
      selectedMonth: stats.selectedMonth,
      selectedMonthName: stats.selectedMonthName.trim(),
      yearTotal: stats.yearTotal,
      months: stats.months,
    },
    locale: locale || "en-US",
    languageCode: languageCode ? languageCode.toLowerCase() : "en",
  };
}
