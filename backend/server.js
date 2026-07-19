import "dotenv/config";
import express from "express";
import cors from "cors";
import { initDb } from "./db.js";
import { generateMonthInsight } from "./monthInsight.js";
import { parseMonthInsightBody } from "./validateMonthInsight.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Apps nativas / curl no envían Origin.
      if (!origin) {
        return callback(null, true);
      }

      if (corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

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
    if (error?.name === "AbortError") {
      return res.status(499).json({ error: "REQUEST_ABORTED" });
    }

    const code = error?.message || "UNKNOWN";
    const status = Number.isInteger(error?.status) ? error.status : 500;
    res.status(status).json({ error: code });
  }
});

await initDb();
app.listen(PORT);
