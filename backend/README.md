# Backend

API Express de FestiDías. Expone el insight mensual vía Replicate (GPT-4.1 mini).

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
REPLICATE_API_TOKEN=
REPLICATE_MODEL=openai/gpt-4.1-mini
REPLICATE_FALLBACK_MODEL=google/gemini-2.5-flash
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
MAIL_USER=
MAIL_PASS=
```

El flujo de IA es: intenta `REPLICATE_MODEL` (ChatGPT) y, si falla el modelo, reintenta con `REPLICATE_FALLBACK_MODEL` (Gemini). Si el fallo es de token/créditos, no reintenta (misma cuenta de Replicate).

Solo necesitas `MAIL_USER` y `MAIL_PASS`. Si quieres recibir el aviso en **otra** bandeja, agrega `MAIL_TO`. Si Replicate falla por **créditos agotados**, **token inválido** o **sin acceso**, el backend envía un correo de alerta (con cooldown de 6 h para no saturar el buzón).

## Endpoints

- `POST /api/month-insight` — genera o reutiliza el dato curioso del mes

Body compacto (conteos del año + festivos solo del mes activo):

```json
{
  "stats": {
    "countryCode": "CO",
    "year": 2026,
    "selectedMonth": 7,
    "selectedMonthName": "July",
    "yearTotal": 18,
    "months": [
      { "month": 1, "monthName": "January", "count": 1 },
      { "month": 2, "monthName": "February", "count": 0 },
      { "month": 3, "monthName": "March", "count": 1 },
      { "month": 4, "monthName": "April", "count": 2 },
      { "month": 5, "monthName": "May", "count": 2 },
      { "month": 6, "monthName": "June", "count": 1 },
      { "month": 7, "monthName": "July", "count": 2 },
      { "month": 8, "monthName": "August", "count": 2 },
      { "month": 9, "monthName": "September", "count": 0 },
      { "month": 10, "monthName": "October", "count": 1 },
      { "month": 11, "monthName": "November", "count": 3 },
      { "month": 12, "monthName": "December", "count": 3 }
    ],
    "selectedHolidays": [
      {
        "name": "Independence Day",
        "date": "2026-07-20",
        "national": true,
        "types": ["Public"]
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

Errores del cliente (códigos seguros, sin detalle interno):

- `INVALID_REQUEST`
- `REPLICATE_API_TOKEN_MISSING`
- `REPLICATE_EMPTY_RESPONSE`
- `REPLICATE_UNAUTHORIZED`
- `REPLICATE_NO_CREDITS`
- `REPLICATE_RATE_LIMITED`
- `REPLICATE_FAILED`
