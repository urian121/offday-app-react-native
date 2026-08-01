import { sendAlertEmail } from "./mail.js";
import { canSendAlert, markAlertSent } from "./alertCooldown.js";

/**
 * Envía un correo de alerta respetando el cooldown por `reason`.
 * No lanza: un fallo de correo no debe romper la API.
 * @returns {Promise<boolean>} true si se envió
 */
export async function sendAlertWithCooldown({ reason, subject, text }) {
  if (!canSendAlert(reason)) {
    return false;
  }

  try {
    const sent = await sendAlertEmail({ subject, text });

    if (sent) {
      markAlertSent(reason);
    }

    return sent;
  } catch {
    return false;
  }
}
