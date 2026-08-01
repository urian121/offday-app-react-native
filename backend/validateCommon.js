/** Valida si un valor es string no vacío dentro de un límite de longitud. */
export function isNonEmptyString(value, maxLength) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

/** Valida enteros dentro de un rango inclusivo. */
export function isIntegerInRange(value, min, max) {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}

/**
 * Normaliza un código de país ISO alpha-2.
 * @returns {string | null}
 */
export function parseCountryCode(value) {
  if (typeof value !== "string") {
    return null;
  }

  const code = value.trim();

  if (!/^[A-Za-z]{2}$/.test(code)) {
    return null;
  }

  return code.toUpperCase();
}

/**
 * Valida un año dentro del rango soportado por la app.
 * @returns {number | null}
 */
export function parseYear(value) {
  if (!isIntegerInRange(value, 1970, 2100)) {
    return null;
  }

  return value;
}
