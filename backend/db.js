import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const initDb = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tbl_offdays (
      offday_id   TEXT PRIMARY KEY,
      month       TEXT NOT NULL,
      year        TEXT NOT NULL,
      note        TEXT NOT NULL,
      pais        TEXT NOT NULL,
      language    TEXT NOT NULL,
      created_at  TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_offdays_pais_year_month_language
    ON tbl_offdays (pais, year, month, language)
  `);
};

/** Busca un insight ya guardado para país, año, mes e idioma. */
export async function findMonthInsight(pais, year, month, language) {
  const result = await db.execute({
    sql: `
      SELECT note
      FROM tbl_offdays
      WHERE pais = ? AND year = ? AND month = ? AND language = ?
      LIMIT 1
    `,
    args: [pais, String(year), String(month), language],
  });

  const note = result.rows[0]?.note;
  return typeof note === "string" && note.trim() ? note.trim() : null;
}

/** Guarda el insight generado para reutilizarlo después. */
export async function saveMonthInsight({ pais, year, month, language, note }) {
  const offdayId = `${pais}-${year}-${month}-${language}`;

  await db.execute({
    sql: `
      INSERT INTO tbl_offdays (offday_id, month, year, note, pais, language, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(offday_id) DO NOTHING
    `,
    args: [
      offdayId,
      String(month),
      String(year),
      note,
      pais,
      language,
      new Date().toISOString(),
    ],
  });
}
