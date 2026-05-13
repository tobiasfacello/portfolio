# Video background en Home — Diseño

Fecha: 2026-05-12
Estado: aprobado (brainstorming) — pendiente plan de implementación

## Objetivo

Mostrar el clip `shader-lab-2026-05-13T00-04-52.webm` como **fondo fijo detrás del contenido de Home (`/`)**, con un scrim oscuro que garantice la legibilidad del texto. El video solo se reproduce en **desktop (≥1280px)** y **solo en tema oscuro**. Fuera de esas condiciones (mobile/tablet, tema claro, `prefers-reduced-motion`) se muestra un **poster estático**.

No se toca WorkDetail, las páginas de error ni el tema claro.

## Decisiones tomadas (brainstorming)

| Tema | Decisión |
|---|---|
| Alcance | Solo Home (`/`) |
| Tratamiento del contenido | Video detrás + scrim; las secciones siguen sin fondo opaco propio |
| Mobile / perf | Poster estático por debajo de `desktop-sm`; no se carga el video |
| Comportamiento | `position: fixed` (anclado al viewport, el contenido scrollea por encima) |
| Loop | Re-encode con crossfade de ~0.5s en la costura |
| Temas | Solo tema oscuro; tema claro mantiene el fondo crema actual |
| Breakpoint del video | `desktop-sm` (≥1280px) y arriba |

## Contexto del codebase relevante

- `index.css`: `body { background: var(--background); ... }` — `--background` es `#0a0b04` en dark y `#f2ede8` en light. El `body` queda como **piso de fallback**.
- `App.css`: `#root` pinta un fondo **opaco** `background-color: var(--background)` + `background-image: url('/vectors/header-vector.svg')` (franja decorativa arriba). Tiene `isolation: isolate` (crea stacking context) y `padding-top: 85px`.
  - `#root::before` — overlay `position: fixed; inset: 0; z-index: -1` con un patrón de puntos enmascarado por `noise-texture.webp`, animado (`noise-drift 180s`). Es la textura "shader-ish" actual.
  - `#root::after` — `position: absolute; bottom: 0; z-index: 0` con el `header-vector` espejado abajo.
- `ThemeContext` → `useTheme()` expone `isDarkMode` (resuelve `themeMode === 'system'` contra `prefers-color-scheme`). Setea `html[data-theme]` cuando no es `system`.
- `BreakpointContext` → `useBreakpoint(): Breakpoint`. `BREAKPOINTS = { 'mobile-sm':0, 'mobile-lg':768, tablet:960, 'desktop-sm':1280, 'desktop-md':1340, 'desktop-lg':1440, 'desktop-xl':1801 }`.
- `usePrefersReducedMotion(): boolean` — reactivo.
- Patrón de componentes: carpeta por componente con `index.tsx` + `styled.tsx` (styled-components, props transitorias con prefijo `$`). Comentarios de import: `//!` terceros, `//?` hooks, `//*` internos.
- `Home.tsx` renderiza `<a.skip-link>` + `<StyledMain id="main-content">` (con `<h1.sr-only>`, `<StyledGrid>` con las secciones, `<Footer>`).
- Assets públicos servidos desde `public/` en la raíz (`public/images`, `public/vectors`, etc.). No hay tests configurados.
- El source 4K (3840×2410, VP9, 8,716s, 30fps, ~31,5 MB) **no se sube al repo**.

## Arquitectura

### 1. Pipeline de assets (paso manual, una vez)

Generar con `ffmpeg` desde `/Users/tobiasfacello/Downloads/shader-lab-2026-05-13T00-04-52.webm` y commitear en `public/backgrounds/`:

- **`public/backgrounds/shader-bg.webm`** — VP9, reescalado a ~1440px de ancho (alto `-2` para mantener aspecto, par), sin audio, CRF ~38 (`-b:v 0`), blur leve horneado. Crossfade de ~0.5s entre el final y el principio para el loop. Objetivo: ~1–2,5 MB.
- **`public/backgrounds/shader-bg.mp4`** — H.264 High, mismo escalado/blur/crossfade, `-pix_fmt yuv420p`, `-movflags +faststart`, sin audio, CRF ~26. Necesario para autoplay confiable en Safari/iOS. Objetivo: ~2–4 MB.
- **`public/backgrounds/shader-bg-poster.jpg`** — un frame representativo (~el del final, persona sentada con laptop), ~1440px de ancho, calidad ~85, ~80–150 KB. Usado como `poster` del `<video>`, fallback de reduced-motion, fallback mobile/tablet, y primer pintado.

Comandos de referencia (a refinar al ejecutar; el filtro de crossfade puede variar):

```bash
SRC=~/Downloads/shader-lab-2026-05-13T00-04-52.webm
OUT=public/backgrounds
mkdir -p "$OUT"

# Loop con crossfade de ~0.5s (D=0.5, offset = duración - D ≈ 8.216):
#   split en dos, se desplaza la copia, y se hace xfade entre el final y el principio.
# Filtro común (resize + blur leve + crossfade-loop):
FILTERS="scale=1440:-2,boxblur=2:1,split[a][b];[b]trim=0:0.5,setpts=PTS-STARTPTS[head];[a]xfade=transition=fade:duration=0.5:offset=8.216[v]"
# Nota: si el xfade-loop da problemas, alternativa simple = concatenar el clip consigo mismo con un crossfade en el medio, o aceptar un fade-to-black de 0.3s en ambos extremos. Se decide al ejecutar.

# WebM / VP9
ffmpeg -i "$SRC" -filter_complex "$FILTERS" -map "[v]" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good "$OUT/shader-bg.webm"

# MP4 / H.264
ffmpeg -i "$SRC" -filter_complex "$FILTERS" -map "[v]" -an \
  -c:v libx264 -profile:v high -crf 26 -pix_fmt yuv420p -movflags +faststart "$OUT/shader-bg.mp4"

# Poster (frame cerca del final, brillo apenas levantado)
ffmpeg -sseof -1 -i "$SRC" -vframes 1 -vf "scale=1440:-2,eq=brightness=0.05" -q:v 4 "$OUT/shader-bg-poster.jpg"
```

Verificar tamaños resultantes; si el WebM/MP4 supera ~3–4 MB, subir el CRF o bajar el ancho a 1280px.

### 2. Componente `VideoBackground`

`src/components/VideoBackground/index.tsx` + `src/components/VideoBackground/styled.tsx`. Sin props. Decorativo de punta a punta: el contenedor lleva `aria-hidden="true"`, `pointer-events: none`; el `<video>`/`<img>` lleva `tabIndex={-1}` y `alt=""`.

**Lógica de render:**

```
const { isDarkMode } = useTheme();
const breakpoint = useBreakpoint();
const reducedMotion = usePrefersReducedMotion();

if (!isDarkMode) return null;   // tema claro → sin video

const isDesktop = ['desktop-sm', 'desktop-md', 'desktop-lg', 'desktop-xl'].includes(breakpoint);
const showVideo = isDesktop && !reducedMotion;

// Montaje diferido del <video> para no competir con el LCP:
const [videoReady, setVideoReady] = useState(false);
useEffect(() => {
  if (!showVideo) return;
  const ric = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200));
  const cancel = window.cancelIdleCallback ?? clearTimeout;
  const id = ric(() => setVideoReady(true));
  return () => cancel(id);
}, [showVideo]);
```

Render:
- Siempre devuelve el contenedor fijo (`<div class="video-bg">`) con:
  - El `<img>` del poster (`object-fit: cover`, full-bleed) **siempre** presente como capa de base — así no hay flash mientras el `<video>` arranca, y es el único contenido en mobile/tablet/reduced-motion.
  - Si `showVideo && videoReady` → `<video autoPlay muted loop playsInline preload="metadata" poster={poster} disablePictureInPicture disableRemotePlayback>` con dos `<source>`: `shader-bg.webm` (type `video/webm`) primero, `shader-bg.mp4` (type `video/mp4`) después. El `<video>` se superpone al poster (fade-in opcional al primer `playing`).
  - Un `<div class="video-bg__scrim">` por encima de video+poster.
- `useBreakpoint`/`useTheme`/`usePrefersReducedMotion` ya son reactivos, así que al cambiar de tema o achicar la ventana el componente reacciona solo.

Las rutas a los assets se referencian como strings absolutos desde `public/` (`/backgrounds/shader-bg.webm`, etc.), igual que el resto del proyecto usa `/vectors/...`.

### 3. Layering / cambios en CSS existente

Stack final, de atrás hacia adelante:

1. `body` background-color `#0a0b04` — piso de fallback (sin cambios).
2. **`.video-bg`** — `position: fixed; inset: 0; z-index: -2; pointer-events: none;` con el `<video>`/`<img>` (`width: 100%; height: 100%; object-fit: cover;`) + el scrim encima (dentro del mismo contenedor, sin z-index propio o `z-index: 1` relativo al contenedor).
3. Decoración existente de `#root`:
   - El `header-vector.svg` que hoy vive en `#root { background-image }` quedaría tapado por `.video-bg` (porque el background de `#root` se pinta detrás de los hijos con z-index negativo). Se **mueve a una capa propia**: un nuevo pseudo-elemento o div con `position: fixed/absolute` arriba, `z-index: 0`, `opacity` reducida (~0.4–0.6) para que el video se lea a través. (El `#root::after` espejado de abajo se mantiene; evaluar si también baja la opacidad.)
   - `#root { background-color: var(--background) }` → se cambia a `transparent` (o se quita). En tema claro, como `VideoBackground` devuelve `null`, no se ve el video; **hay que asegurar que el fondo crema siga apareciendo** — opciones: (a) dejar `body` con `var(--background)` (ya lo tiene; en claro `body` pinta `#f2ede8`) y que eso baste, o (b) mantener el `background-color` de `#root` solo bajo `[data-theme="light"]` / `@media (prefers-color-scheme: light)`. Se decide en implementación; lo simple es confiar en `body`.
   - `#root::before` (ruido punteado, `z-index: -1`) queda **por encima** de `.video-bg` (`-2`) — se ve sobre el video, que es lo deseado.
4. Contenido de la página (`#main-content` y secciones), z-index `auto` / `0` — por encima de todo lo anterior.

`VideoBackground` se monta como **primer hijo del fragmento que devuelve `Home`** (antes del `skip-link`), de modo que vive dentro del stacking context de `#root` (que ya tiene `isolation: isolate`).

### 4. Scrim / legibilidad

`.video-bg__scrim` — `position: absolute; inset: 0;`:
- Relleno oscuro semitransparente: `background: rgba(10, 11, 4, 0.6)` (≈ `--background` con ~60% de opacidad). Valor inicial; se tunea visualmente.
- Viñeta sutil hacia los bordes: `radial-gradient(ellipse at center, transparent 40%, rgba(10,11,4,0.35) 100%)` superpuesto.
- Blur leve adicional: ya horneado en el encode (`boxblur` ~2px); si hace falta más se puede sumar `filter: blur()` al `<video>` pero ojo con el costo de un blur fijo a pantalla completa — preferible más blur en el encode.

Todos los valores (opacidad del scrim, viñeta, opacidad del header-vector, blur) son **tuneables** y se ajustan con `agent-browser` contra el contenido real de cada sección.

### 5. Performance

- Sin audio en los encodes; `<video muted playsInline>`.
- `preload="metadata"` (no `auto`): el autoplay tira del resto; el poster cubre el intervalo.
- Montaje del `<video>` diferido a `requestIdleCallback` (fallback `setTimeout(200ms)`).
- Sin nuevas dependencias.
- El `<video>` no se monta nunca por debajo de `desktop-sm` ni con reduced-motion → cero costo de video en mobile/tablet.

### 6. Accesibilidad

- `.video-bg` con `aria-hidden="true"`; `<video>`/`<img>` con `tabIndex={-1}` y `alt=""` (puramente decorativo).
- `prefers-reduced-motion: reduce` → nunca se monta el `<video>`, solo el poster.
- El scrim mantiene el contraste de texto que ya cumple hoy; se verifica que ninguna sección pierda legibilidad.

### 7. Fuera de alcance

- WorkDetail, páginas de error, tema claro.
- Script de build para generar los encodes (el source no está en el repo; los outputs se commitean ya optimizados).
- Versión del video específica para mobile (se usa el poster).
- `navigator.connection.saveData` y similares (YAGNI por ahora).

## Verificación (no hay test infra)

- `npm run lint` y `tsc` limpios (lint corre con `--max-warnings 0`).
- Check visual con `agent-browser` en `npm run dev`:
  - Desktop ≥1280px, tema oscuro: el video reproduce, loopea sin corte visible, y **cada sección de Home se lee bien** sobre el scrim.
  - <1280px (tablet/mobile): se ve solo el poster, no se descarga el video (verificar en Network).
  - Tema claro: no aparece el video; el fondo crema se ve como antes.
  - Emulando `prefers-reduced-motion: reduce`: solo poster.
  - Network: peso/transferencia de los assets dentro de lo esperado (~< 5 MB el video, < 150 KB el poster).
- Limpiar cualquier artefacto de dev (frames de prueba en `/tmp`, etc.) antes de commitear.
