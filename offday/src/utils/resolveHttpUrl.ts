/** Comprueba que sea una URL absoluta http(s). */
export function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/**
 * Resuelve una URL pública desde env con fallback seguro.
 * Si el valor de entorno está vacío o sin protocolo, usa el fallback.
 */
export function resolveHttpUrl(
  envValue: string | undefined,
  fallback: string
): string {
  const value = typeof envValue === "string" ? envValue.trim() : "";

  if (value && isAbsoluteHttpUrl(value)) {
    return value.replace(/\/$/, "");
  }

  return fallback.replace(/\/$/, "");
}
