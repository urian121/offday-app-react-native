# Backend

API Express de Offday. Expone el insight mensual vía OpenAI.

## Arranque

```bash
npm install
npm run dev
```

La forma recomendada es `node --watch server.js`, no `node server.js --watch`.

## Variables de entorno

Copia `.env-example` a `.env`:

```env
PORT=3000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

## Endpoints

- `POST /api/month-insight` — genera o reutiliza el dato curioso del mes

Body de ejemplo:

```json
{
  "stats": {
    "countryCode": "CO",
    "year": 2026,
    "selectedMonth": 7,
    "selectedMonthName": "July",
    "yearTotal": 18,
    "months": [
      {
        "month": 7,
        "monthName": "July",
        "count": 1,
        "holidays": [
          {
            "name": "Independence Day",
            "date": "2026-07-20",
            "national": true,
            "types": ["Public"]
          }
        ]
      }
    ]
  },
  "locale": "es-CO",
  "languageCode": "es"
}
```

Respuesta:

```json
{ "insight": "..." }
```
