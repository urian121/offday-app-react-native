- consumir una API externa
- definir la interfaz de acuerdo a los datos y tipo de datos que devuelve la api
- lee la configuración regional del teléfono (idioma + región configurados por el usuario en su sistema) con expo-localization


---

## Nota: nombres de festivos (v4 + v3)

La app usa un enfoque **híbrido** con [Nager.Date](https://date.nager.at/):

- **API v4** (`/api/v4/Holidays/{CountryCode}/{Year}`) — fuente principal: fechas, tipos (`holidayTypes`), nacional/regional (`nationalHoliday`, `subdivisionCodes`).
- **API v3** (`/api/v3/PublicHolidays/{Year}/{CountryCode}`) — solo para obtener `localName` (nombre en el idioma nativo del país).

Los datos se fusionan por `date`. Si v3 falla, se muestra `name` en inglés.

**Qué nombre se muestra en la UI** (`getHolidayDisplayName`):

- Teléfono en **inglés** → `name` (inglés).
- Teléfono en **otro idioma** + `localName` disponible → `localName` (español en CO/MX, alemán en AT, etc.).
- Sin `localName` → fallback a `name`.

`localName` refleja el idioma del **país**, no el del teléfono. v3 y v4 pueden diferir en algunas fechas; por eso v4 manda en calendario y v3 solo aporta el nombre local.