import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const EXPECTED_COLUMNS = [
  "offday_id",
  "month",
  "year",
  "note",
  "pais",
  "created_at",
];

/** Recrea la tabla si el esquema no coincide con el esperado. */
async function ensureSchema() {
  const info = await db.execute("PRAGMA table_info(tbl_offdays)");
  const names = new Set(info.rows.map((row) => row.name));
  const schemaOk = EXPECTED_COLUMNS.every((column) => names.has(column));

  if (names.size > 0 && !schemaOk) {
    await db.execute("DROP TABLE IF EXISTS tbl_offdays");
  }
}

export const initDb = async () => {
  await ensureSchema();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS tbl_offdays (
      offday_id   TEXT PRIMARY KEY,
      month       TEXT NOT NULL,
      year        TEXT NOT NULL,
      note        TEXT NOT NULL,
      pais        TEXT NOT NULL,
      created_at  TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_offdays_pais_year_month
    ON tbl_offdays (pais, year, month)
  `);
};

/** Busca un insight ya guardado para país, año y mes. */
export async function findMonthInsight(pais, year, month) {
  const result = await db.execute({
    sql: `
      SELECT note
      FROM tbl_offdays
      WHERE pais = ? AND year = ? AND month = ?
      LIMIT 1
    `,
    args: [pais, String(year), String(month)],
  });

  const note = result.rows[0]?.note;
  return typeof note === "string" && note.trim() ? note.trim() : null;
}

/** Guarda el insight generado para reutilizarlo después. */
export async function saveMonthInsight({ pais, year, month, note }) {
  const offdayId = `${pais}-${year}-${month}`;

  await db.execute({
    sql: `
      INSERT INTO tbl_offdays (offday_id, month, year, note, pais, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(offday_id) DO NOTHING
    `,
    args: [
      offdayId,
      String(month),
      String(year),
      note,
      pais,
      new Date().toISOString(),
    ],
  });
}
