# AGENT.md — Guía de Diseño y Desarrollo

## Contexto del proyecto
App móvil (Expo + React Native + TypeScript) que muestra **días festivos** filtrados por mes, año y país. No es un calendario visual tradicional — es una lista/experiencia enfocada en festivos.

## API de festivos — Nager.Date

**Fuente oficial (consultar siempre antes de implementar o modificar lógica de datos):**
- Documentación: https://date.nager.at/Api
- Base URL: `https://date.nager.at`

### Endpoint principal
```
GET /api/v4/Holidays/{CountryCode}/{Year}
```

**Ejemplo:** https://date.nager.at/api/v4/Holidays/CO/2026

### Parámetros (solo estos dos)
| Parámetro     | Tipo   | Ejemplo | Descripción                          |
|---------------|--------|---------|--------------------------------------|
| `CountryCode` | string | `CO`    | Código ISO 3166-1 alpha-2 del país   |
| `Year`        | number | `2026`  | Año calendario                       |

No hay parámetro de mes en la API. El filtrado por mes se hace **en el cliente** sobre el array devuelto.

### Años disponibles
La API v4 no expone un endpoint de años disponibles. El selector de año usa una lista local generada en `useHolidaysScreen` (año actual −1 hasta año actual +5), sin consultar la API.

### Endpoints auxiliares v3
- `GET /api/v3/PublicHolidays/{Year}/{CountryCode}`: solo aporta `localName`.
- `GET /api/v3/AvailableCountries`: lista los países soportados.

La fecha, alcance y tipos siempre provienen de v4. Los datos v3 nunca sustituyen el calendario v4.

### Modelo de respuesta (`Holiday[]`)
```json
{
  "date": "2026-01-01",
  "name": "New Year's Day",
  "countryCode": "CO",
  "nationalHoliday": true,
  "subdivisionCodes": null,
  "holidayTypes": ["Public"]
}
```

| Campo              | Tipo              | Descripción                                              |
|--------------------|-------------------|----------------------------------------------------------|
| `date`             | string            | Fecha del festivo (`YYYY-MM-DD`)                         |
| `name`             | string            | Nombre en inglés                                         |
| `countryCode`      | string            | Código ISO 3166-1 alpha-2                                |
| `nationalHoliday`  | boolean           | Si es festivo nacional                                   |
| `subdivisionCodes` | `string[] \| null`| Subdivisiones donde aplica; `null` si es nacional        |
| `holidayTypes`     | string[]          | Tipos: `Public`, `Bank`, `School`, `Authorities`, `Optional`, `Observance` |

### Reglas para el agente
- Usar exclusivamente los endpoints Nager.Date documentados arriba; no inventar endpoints ni campos.
- La interfaz `Holiday` vive en `src/interface/holiday.ts`: contiene el modelo v4 enriquecido con `localName` opcional de v3.
- `CountryCode` debe ir en mayúsculas (ISO alpha-2).
- La API no tiene rate limits ni requiere API key.
- Ante dudas sobre campos o valores posibles, verificar en https://date.nager.at/Api o probar el endpoint directamente.
- El `countryCode` por defecto se obtiene del dispositivo con `expo-localization` (`getDeviceCountryCode` en `src/utils/getDeviceCountryCode.ts`), usando la región configurada en el sistema del usuario.

## Estructura de código

### Interfaces y tipos (`src/interface/`)
- **Todas** las interfaces y tipos compartidos del proyecto van en `src/interface/`.
- Un archivo por dominio (ej. `holiday.ts`, `country.ts`).
- Los servicios, componentes y hooks **importan** desde ahí; no definen interfaces inline ni en archivos de lógica.
- No duplicar tipos en múltiples archivos.

### Componentes (`src/components/`)
- Pantallas delgadas: solo composición y layout.
- Lógica de estado en `src/hooks/`.
- Subcomponentes por responsabilidad (lista, filtros, sheets), no archivos monolíticos.
- Servicios de API en `src/services/` (sin JSX, extensión `.ts`).

### Utilidades (`src/utils/`)
- Funciones puras y helpers reutilizables, agrupadas por dominio (ej. `dateFormat.ts`, `getDeviceLocale.ts`).

## Stack
- Expo + React Native + TypeScript
- **NativeWind** para estilos (Tailwind en RN)
- Sin `expo-router` con tabs — navegación simple si aplica

---

## Filosofía de diseño: limpio, fluido, distinto

El objetivo es que la UI **no se sienta "hecha por IA"**. Evitar los patrones genéricos que se repiten en apps generadas automáticamente.

### ❌ Evitar (clichés de IA / genéricos)
- Sombras fuertes o `boxShadow`/`shadow-lg` por defecto en cada card
- Gradientes morado-a-azul (el clásico "AI purple gradient")
- Todo con `rounded-2xl` o `rounded-full` sin criterio — variar el radio según el peso del elemento
- Glassmorphism excesivo (blur + transparencia en todo)
- Iconos genéricos de una sola librería sin criterio de estilo (mezclar outline/filled sin razón)
- Cards blancas flotando sobre fondo gris con sombra — el layout "dashboard de SaaS"
- Emojis como iconos principales de UI
- Botones con degradado saturado y texto blanco centrado como único estilo de CTA
- Espaciado uniforme sin jerarquía (todo `p-4 gap-4` sin variación)
- Paletas 100% saturadas / colores sólidos puros (`#0000FF`, `#FF0000`)

### ✅ Preferir
- **Colores no sólidos**: tonos desaturados, mezclados con gris o con un toque del color complementario. Pensar en paletas tipo *muted*, *dusty*, *earthy* — no primarios puros.
- **Profundidad sin sombra dura**: usar diferencias sutiles de tono/fondo (`bg-neutral-50` vs `bg-neutral-100`), bordes finos de 1px con opacidad baja, o separación por espaciado — no `elevation`/`shadow`.
- **Tipografía como jerarquía principal**: variar peso y tamaño antes que color para diferenciar importancia.
- **Ritmo visual irregular intencional**: distintos radios de borde según el tipo de elemento (chip vs card vs botón), no todo igual.
- **Micro-interacciones sutiles**: transiciones suaves (150-250ms), sin rebotes exagerados ni escalados grandes.
- **Un acento de color, no una paleta arcoíris**: 1 color de marca + neutros, usado con moderación.

---

## Paleta sugerida (ejemplo, ajustar a marca)
Colores desaturados, no planos:
```
bg base:      #F7F5F1 (hueso, no blanco puro)
surface:      #EFEBE4
texto primario: #2B2622 (casi negro, cálido)
texto secundario: #7A7269
acento:       #C4715A (terracota apagado, no rojo puro)
acento suave: #E8D9CF
borde:        rgba(43,38,34,0.08)
```

## Reglas de NativeWind
- Centralizar la paleta en `tailwind.config.js` (no usar colores arbitrarios `bg-[#...]` repetidos en el código)
- Evitar clases de sombra (`shadow-sm`, `shadow-md`, etc.) salvo un único caso justificado (ej. modal/bottom sheet)
- Usar `border` con opacidad baja en vez de sombra para separar tarjetas
- Espaciado en escala consistente pero con jerarquía: contenedores grandes con más aire, elementos internos más compactos

## Componentes clave del proyecto
- **Selector de mes/año**: evitar el típico dropdown genérico; considerar un selector horizontal deslizable
- **Card de festivo**: nombre, fecha, tipo (nacional/regional) — priorizar tipografía y espaciado, no color de fondo llamativo
- **Selector de país**: bandera + nombre, lista simple con buscador, sin bordes duros

## Checklist antes de dar por terminada una pantalla
- [ ] ¿Hay algún `shadow` o `elevation` sin justificación clara? → quitar
- [ ] ¿Los colores son planos/saturados? → desaturar
- [ ] ¿Todo tiene el mismo `rounded-*`? → variar con intención
- [ ] ¿Se ve como un dashboard genérico de SaaS? → replantear layout
- [ ] ¿El acento de color se usa con moderación (no en todo)? → revisar