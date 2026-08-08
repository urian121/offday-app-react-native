# FestiDías

Aplicación **Android** (Expo + React Native) que muestra días festivos por país, mes y año. No incluye targets iOS ni web.

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
- `src/services/`: Nager.Date y backend Offday.
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

## Insight mensual

El insight lo genera el backend (`POST /api/month-insight`) con OpenAI. La app solo envía las estadísticas del año y muestra la respuesta.

Variable requerida (archivo `.env` en la raíz de `offday/`):

```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
```

- En dispositivo físico usa la IP local de tu máquina (no `localhost`).
- Arranca el backend con `npm run dev` en `backend/` y asegúrate de tener `REPLICATE_API_TOKEN` allí.
- Con `eas build` en la nube, configura `EXPO_PUBLIC_API_URL` en Expo → Environment variables.

## Comandos

```bash
npx expo start --clear
npx expo start --clear --localhost
npx expo start --android
npx expo run:android
```

## Builds EAS

Para generar APK en local y hacer pruebas:

```bash
cd offday
set -a && source .env && set +a
npx eas build --platform android --profile preview --local
```

En la nube (sí lee las vars del dashboard de Expo):

```bash
# AAB para Play Store. Debes generar el AAB de producción, incluso si primero lo vas a publicar en una Prueba cerrada (Closed Testing).
npx eas build --platform android --profile production

# APK para prueba interna
npx eas build --platform android --profile preview
```

Si generaste `android/` con prebuild y quieres borrarla:

```bash
rm -rf android
```

### Versionado (Play Store)

No hace falta cambiar el `versionCode` de Android a mano en `app.config.js`.

En `eas.json` el perfil `production` usa `autoIncrement: true` y el CLI tiene `appVersionSource: "remote"`: EAS lleva el contador en remoto y lo incrementa solo en cada build de producción.

La cadena `version` de `app.config.js` (p. ej. `1.1.0`) es la versión visible para el usuario. Solo súbela si quieres que Play Store muestre un número nuevo; no es obligatoria para que el AAB se acepte.
