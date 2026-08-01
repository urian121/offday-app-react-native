import "dotenv/config";
import express from "express";
import cors from "cors";
import { initDb } from "./db.js";
import { generateMonthInsight } from "./monthInsight.js";
import { parseMonthInsightBody } from "./validateMonthInsight.js";
import { notifyNagerFailure } from "./notifyNagerFailure.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const KNOWN_ERROR_CODES = new Set([
  "REPLICATE_API_TOKEN_MISSING",
  "REPLICATE_EMPTY_RESPONSE",
  "REPLICATE_TIMEOUT",
]);

/**
 * Traduce errores internos a códigos seguros para el cliente.
 * Nunca expone mensajes crudos de Replicate/proveedores.
 */
function toClientError(error) {
  const message = typeof error?.message === "string" ? error.message : "";
  const rawStatus = error?.status ?? error?.statusCode;
  const status = Number.isInteger(rawStatus) ? rawStatus : 500;

  if (KNOWN_ERROR_CODES.has(message)) {
    return { status: status >= 400 && status < 600 ? status : 500, code: message };
  }

  if (status === 401 || status === 403) {
    return { status, code: "REPLICATE_UNAUTHORIZED" };
  }

  if (status === 402) {
    return { status, code: "REPLICATE_NO_CREDITS" };
  }

  if (status === 429) {
    return { status: 429, code: "REPLICATE_RATE_LIMITED" };
  }

  if (status >= 400 && status < 600) {
    return { status, code: "REPLICATE_FAILED" };
  }

  return { status: 500, code: "REPLICATE_FAILED" };
}

app.use(cors());
app.use(express.json({ limit: "50kb" }));

app.post("/api/month-insight", async (req, res) => {
  const payload = parseMonthInsightBody(req.body);

  if (!payload) {
    return res.status(400).json({ error: "INVALID_REQUEST" });
  }

  try {
    const insight = await generateMonthInsight(payload);
    res.json({ insight });
  } catch (error) {
    const { status, code } = toClientError(error);
    res.status(status).json({ error: code });
  }
});

/** Recibe fallos de Nager.Date reportados por la app y dispara correo (con cooldown). */
app.post("/api/alert/nager-failure", async (req, res) => {
  const result = await notifyNagerFailure(req.body);

  if (result === "invalid") {
    return res.status(400).json({ error: "INVALID_REQUEST" });
  }

  // 202: aceptado (enviado o omitido por cooldown). No bloquea la UI de la app.
  res.status(202).json({ ok: true, result });
});

await initDb();
app.listen(PORT);
