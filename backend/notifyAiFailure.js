import { sendAlertWithCooldown } from "./alertNotify.js";
import { REPLICATE_FALLBACK_MODEL, REPLICATE_MODEL } from "./replicate.js";

/**
 * Detecta fallos de Replicate por créditos, token o acceso
 * (no timeout ni errores genéricos de red).
 */
export function isAiBillingOrAuthFailure(error) {
  if (!error) {
    return false;
  }

  if (error.message === "REPLICATE_API_TOKEN_MISSING") {
    return true;
  }

  const status = error.status || error.statusCode;
  const code = String(error.code || "").toLowerCase();
  const message = String(error.message || "").toLowerCase();

  if (status === 401 || status === 402 || status === 403) {
    return true;
  }

  if (
    message.includes("insufficient credit") ||
    message.includes("insufficient_quota") ||
    message.includes("payment required") ||
    message.includes("billing") ||
    message.includes("credit") ||
    message.includes("unauthenticated") ||
    message.includes("invalid token") ||
    message.includes("authentication")
  ) {
    return true;
  }

  if (
    status === 429 &&
    (message.includes("quota") ||
      message.includes("billing") ||
      message.includes("credit") ||
      code.includes("quota"))
  ) {
    return true;
  }

  return false;
}

/** Clasifica el fallo para el asunto del correo. */
function resolveFailureReason(error) {
  if (error?.message === "REPLICATE_API_TOKEN_MISSING") {
    return "missing_api_token";
  }

  const status = error?.status || error?.statusCode;
  const message = String(error?.message || "").toLowerCase();

  if (
    status === 402 ||
    message.includes("insufficient credit") ||
    message.includes("insufficient_quota") ||
    message.includes("payment required") ||
    message.includes("billing") ||
    message.includes("credit")
  ) {
    return "insufficient_credit";
  }

  if (
    status === 401 ||
    message.includes("unauthenticated") ||
    message.includes("invalid token")
  ) {
    return "invalid_api_token";
  }

  if (status === 403) {
    return "forbidden";
  }

  return "replicate_access_error";
}

/** Asunto legible según el tipo de fallo. */
function buildSubject(reason) {
  switch (reason) {
    case "missing_api_token":
      return "[FestiDías] Falta REPLICATE_API_TOKEN en el backend";
    case "insufficient_credit":
      return "[FestiDías] Replicate sin créditos / saldo agotado";
    case "invalid_api_token":
      return "[FestiDías] REPLICATE_API_TOKEN inválido";
    case "forbidden":
      return "[FestiDías] Replicate denegó el acceso (403)";
    default:
      return "[FestiDías] Fallo de autenticación/acceso a Replicate";
  }
}

/**
 * Envía un correo si el error es de créditos/auth y el cooldown lo permite.
 * No lanza: un fallo de correo no debe romper la API.
 */
export async function notifyAiFailure(error, context = {}) {
  if (!isAiBillingOrAuthFailure(error)) {
    return;
  }

  const reason = resolveFailureReason(error);
  const subject = buildSubject(reason);
  const text = [
    "La API de Replicate del backend de FestiDías falló.",
    "",
    `Motivo: ${reason}`,
    `Status: ${error?.status || error?.statusCode || "n/a"}`,
    `Código: ${error?.code ?? error?.message ?? "n/a"}`,
    `Mensaje: ${error?.message ?? "n/a"}`,
    "",
    `País: ${context.pais ?? "n/a"}`,
    `Año/mes: ${context.year ?? "n/a"}/${context.month ?? "n/a"}`,
    `Idioma: ${context.language ?? "n/a"}`,
    `Modelo: ${context.model ?? REPLICATE_MODEL}`,
    `Fallback: ${REPLICATE_FALLBACK_MODEL}`,
    context.primaryModel
      ? `Principal falló (${context.primaryModel}): ${context.primaryError ?? "n/a"}`
      : null,
    `Fecha: ${new Date().toISOString()}`,
    "",
    "Revisa créditos en https://replicate.com/account/billing",
    "y la variable REPLICATE_API_TOKEN en Railway / .env.",
  ]
    .filter(Boolean)
    .join("\n");

  await sendAlertWithCooldown({ reason, subject, text });
}
