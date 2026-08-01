/** Intervalo mínimo entre alertas del mismo tipo (por defecto 6 h). */
const COOLDOWN_MS =
  Number(process.env.MAIL_ALERT_COOLDOWN_MS) || 6 * 60 * 60 * 1000;

/** Último envío por razón, para no saturar el buzón. */
const lastSentAtByReason = new Map();

/** Evita reenviar la misma alerta dentro del cooldown. */
export function canSendAlert(reason) {
  const lastSentAt = lastSentAtByReason.get(reason) ?? 0;
  return Date.now() - lastSentAt >= COOLDOWN_MS;
}

/** Marca una alerta como enviada ahora. */
export function markAlertSent(reason) {
  lastSentAtByReason.set(reason, Date.now());
}
