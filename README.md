# OffDay

Aplicación móvil Expo + React Native que muestra días festivos por país, mes y año.

## Desarrollo

```bash
npm install
npm start
npm run typecheck
```

Para iniciar Metro escuchando solo en localhost:

```bash
npx expo start --clear --localhost
```

## Estructura

- `src/components/`: composición visual, listas y bottom sheets.
- `src/hooks/`: estado y coordinación de solicitudes.
- `src/services/`: Nager.Date y OpenAI.
- `src/interface/`: contratos compartidos.
- `src/utils/`: locale, fechas, copies y transformaciones puras.

## Datos de festivos

La app usa un enfoque híbrido con [Nager.Date](https://date.nager.at/):

- **v4** (`/api/v4/Holidays/{CountryCode}/{Year}`): fuente canónica de fechas, tipos y alcance nacional/regional.
- **v3** (`/api/v3/PublicHolidays/{Year}/{CountryCode}`): aporta únicamente `localName`.
- **v3** (`/api/v3/AvailableCountries`): lista los países disponibles.

Los nombres v3 se unen a v4 por `date`. Si v3 falla o las fechas no coinciden, se conserva el nombre inglés de v4. El filtrado mensual ocurre en el cliente.

### Nombre mostrado

- Teléfono en inglés: `name`.
- Otro idioma con `localName` disponible: `localName`.
- Sin `localName`: fallback a `name`.

`localName` corresponde al idioma nativo del país seleccionado, no necesariamente al idioma del teléfono.

## Insight mensual con OpenAI

El insight compara el mes activo con todos los meses del mismo año y se cachea en memoria por país, año, mes, locale, modelo y versión del prompt.

Variables requeridas (archivo `.env` en la raíz):

```env
EXPO_PUBLIC_OPENAI_API_KEY=
EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini
```

- Con `npx expo start`, Expo carga el `.env` automáticamente.
- Con `eas build --local`, el `.env` se lee en `app.config.js` y la clave se embebe en `extra` del binario.
- Con EAS en la nube, configura las mismas variables en el proyecto de Expo (Environment variables), porque el `.env` está en `.gitignore` y no se sube.

Vuelve a generar el APK después de tener el `.env` listo:

```bash
npx eas build --platform android --profile preview --local
```

> `EXPO_PUBLIC_OPENAI_API_KEY` queda incluida en el bundle móvil. Antes de producción, la llamada debe trasladarse a un backend o función serverless que proteja la clave y aplique límites.

Como mejora futura, el insight puede persistirse en una base de datos para reutilizar respuestas y reducir costes.

npx expo start --clear
npx expo start --clear --localhost
npx expo start --android
npx expo run:android
npx expo-doctor
npx eas build --platform android --profile preview --local