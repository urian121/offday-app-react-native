import { sendAlertWithCooldown } from "./alertNotify.js";
import {
  isIntegerInRange,
  parseCountryCode,
  parseYear,
} from "./validateCommon.js";

const ALLOWED_SOURCES = new Set(["v3", "v4", "countries"]);

/**
 * Valida el body del alerta Nager.
 * @returns {object | null}
 */
function parseNagerFailureBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const source = typeof body.source === "string" ? body.source.trim() : "";

  if (!ALLOWED_SOURCES.has(source)) {
    return null;
  }

  const countryCode = parseCountryCode(body.countryCode ?? "");
  const year = parseYear(body.year);

  const status = isIntegerInRange(body.status, 100, 599) ? body.status : null;

  const message =
    typeof body.message === "string"
      ? body.message.trim().slice(0, 300)
      : "";

  return { source, countryCode, year, status, message };
}

/**
 * Envía un correo si Nager.Date falló y el cooldown lo permite.
 * @returns {Promise<"sent" | "skipped" | "invalid">}
 */
export async function notifyNagerFailure(body) {
  const payload = parseNagerFailureBody(body);

  if (!payload) {
    return "invalid";
  }

  const reason = `nager-${payload.source}-${payload.status ?? "unknown"}`;
  const subject = `[FestiDías] Fallo API Nager.Date (${payload.source})`;
  const text = [
    "La app reportó un fallo al consultar Nager.Date.",
    "",
    `Fuente: ${payload.source}`,
    `HTTP status: ${payload.status ?? "n/a"}`,
    `Mensaje: ${payload.message || "n/a"}`,
    `País: ${payload.countryCode ?? "n/a"}`,
    `Año: ${payload.year ?? "n/a"}`,
    `Fecha: ${new Date().toISOString()}`,
    "",
    `V4: ${process.env.NAGER_V4_URL || "https://date.nager.at/api/v4/Holidays"}`,
    `V3: ${process.env.NAGER_V3_URL || "https://date.nager.at/api/v3/PublicHolidays"}`,
    `Países: ${process.env.NAGER_COUNTRIES_URL || "https://date.nager.at/api/v3/AvailableCountries"}`,
  ].join("\n");

  const sent = await sendAlertWithCooldown({ reason, subject, text });
  return sent ? "sent" : "skipped";
}
