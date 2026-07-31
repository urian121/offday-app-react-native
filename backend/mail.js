import nodemailer from "nodemailer";

/** Crea el transporter de Gmail a partir de variables de entorno. */
export function createMailTransporter() {
  const user = process.env.MAIL_USER?.trim();
  const pass = process.env.MAIL_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/**
 * Envía un correo de alerta.
 * Solo requiere MAIL_USER + MAIL_PASS.
 * MAIL_TO es opcional: si no existe, el aviso llega a MAIL_USER.
 * @returns {Promise<boolean>} true si se envió, false si faltan credenciales.
 */
export async function sendAlertEmail({ subject, text }) {
  const user = process.env.MAIL_USER?.trim();
  const to = process.env.MAIL_TO?.trim() || user;
  const transporter = createMailTransporter();

  if (!transporter || !user || !to) {
    return false;
  }

  await transporter.sendMail({ from: user, to, subject, text });
  return true;
}
