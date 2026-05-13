# Video Background en Home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar el clip `shader-lab-2026-05-13T00-04-52.webm` como fondo fijo detrás del contenido de Home (`/`), con un scrim para legibilidad — solo en desktop (≥1280px) y solo en tema oscuro; fuera de eso, poster estático.

**Architecture:** Un componente `VideoBackground` que se renderiza vía `createPortal` a `document.body`, con `position: fixed; z-index: -1`, de modo que queda detrás de `#root` (que se vuelve transparente) pero delante del color de fondo del `body` (que queda como piso de fallback). Adentro: un `<img>` poster siempre presente, un `<video>` montado de forma diferida (solo si dark + desktop + sin reduced-motion), y un `<div>` scrim encima. Las decoraciones existentes de `#root` (`::before` ruido punteado, `::after` vector inferior, `background-image` del header) siguen renderizándose por encima del video sin tocarse.

**Tech Stack:** React 19 + TypeScript + styled-components v6 + Vite. `ffmpeg` para el pipeline de assets. Sin tests configurados → verificación = `npm run lint` + `npx tsc` + check visual con la skill `agent-browser` contra el dev server (`npm run dev`, ya corriendo en http://localhost:5173/).

**Spec:** `docs/superpowers/specs/2026-05-12-video-background-home-design.md`

---

## File Structure

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `public/backgrounds/shader-bg.webm` | Crear (binario, vía ffmpeg) | Video optimizado VP9, ~1440px, loop con crossfade. |
| `public/backgrounds/shader-bg.mp4` | Crear (binario, vía ffmpeg) | Mismo video en H.264 para autoplay confiable en Safari/iOS. |
| `public/backgrounds/shader-bg-poster.jpg` | Crear (binario, vía ffmpeg) | Frame estático: `poster` del `<video>` + fallback mobile/tablet/reduced-motion. |
| `src/components/VideoBackground/styled.tsx` | Crear | styled-components: `Backdrop` (contenedor fijo portaleado), `Poster`, `Video`, `Scrim`. |
| `src/components/VideoBackground/index.tsx` | Crear | Componente: gating (tema/breakpoint/reduced-motion), montaje diferido del `<video>`, portal a `document.body`. |
| `src/pages/Home.tsx` | Modificar | Importar y montar `<VideoBackground />` como primer hijo del fragmento. |
| `src/App.css` | Modificar | Quitar `background-color: var(--background)` de la regla `#root` (el `body` mantiene el fallback). |

No se sube el source 4K al repo. No se crea script de build (los outputs se commitean ya optimizados). No se tocan WorkDetail, páginas de error ni el tema claro.

---

### Task 1: Generar los assets de video optimizados

**Files:**
- Create: `public/backgrounds/shader-bg.webm`
- Create: `public/backgrounds/shader-bg.mp4`
- Create: `public/backgrounds/shader-bg-poster.jpg`

El source es `~/Downloads/shader-lab-2026-05-13T00-04-52.webm` (3840×2410, VP9, 8.716s, 30fps, ~31.5 MB). Se reescala a ~1440px de ancho, se le hornea un blur leve (mejora compresión + legibilidad) y se arma un loop con crossfade de ~0.5s entre el final y el principio.

El filtro de crossfade-loop arma: `mid` = `source[0.5s..8.216s]`, `tail` = `source[8.216s..8.716s]`, `head` = `source[0s..0.5s]`; cruza `tail→head` con `xfade` (0.5s) y concatena `[xfade][mid]`. Resultado ≈ 8.22s cuyo primer y último frame son el mismo (`source[8.216s]`), así que loopea sin corte. Si el source tiene otra duración, ajustar `8.216`/`8.716` (= `dur - 0.5` y `dur`).

- [ ] **Step 1: Crear la carpeta de salida**

```bash
mkdir -p public/backgrounds
```

- [ ] **Step 2: Re-encodear el WebM/VP9 con crossfade-loop**

```bash
SRC="$HOME/Downloads/shader-lab-2026-05-13T00-04-52.webm"
ffmpeg -y -i "$SRC" -filter_complex "
[0:v]scale=1440:-2,boxblur=3:1,setsar=1,fps=30,format=yuv420p[base];
[base]split=3[s1][s2][s3];
[s1]trim=0.5:8.216,setpts=PTS-STARTPTS[mid];
[s2]trim=8.216:8.716,setpts=PTS-STARTPTS[tail];
[s3]trim=0:0.5,setpts=PTS-STARTPTS[head];
[tail][head]xfade=transition=fade:duration=0.5:offset=0[xf];
[xf][mid]concat=n=2:v=1:a=0[v]
" -map "[v]" -an -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -pix_fmt yuv420p public/backgrounds/shader-bg.webm
```

Si `ffmpeg` falla en el `xfade`/`concat` (mismatch de timestamps o formato), reemplazar el `-filter_complex ... -map "[v]"` por este filtro simple que loopea casi imperceptiblemente en un clip tan oscuro:

```bash
# Fallback: fade desde negro al inicio + fade a negro al final
ffmpeg -y -i "$SRC" -vf "scale=1440:-2,boxblur=3:1,fade=t=in:st=0:d=0.4,fade=t=out:st=8.316:d=0.4,format=yuv420p" -an -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good public/backgrounds/shader-bg.webm
```

- [ ] **Step 3: Re-encodear el MP4/H.264 con el mismo filtro**

```bash
SRC="$HOME/Downloads/shader-lab-2026-05-13T00-04-52.webm"
ffmpeg -y -i "$SRC" -filter_complex "
[0:v]scale=1440:-2,boxblur=3:1,setsar=1,fps=30,format=yuv420p[base];
[base]split=3[s1][s2][s3];
[s1]trim=0.5:8.216,setpts=PTS-STARTPTS[mid];
[s2]trim=8.216:8.716,setpts=PTS-STARTPTS[tail];
[s3]trim=0:0.5,setpts=PTS-STARTPTS[head];
[tail][head]xfade=transition=fade:duration=0.5:offset=0[xf];
[xf][mid]concat=n=2:v=1:a=0[v]
" -map "[v]" -an -c:v libx264 -profile:v high -crf 26 -pix_fmt yuv420p -movflags +faststart public/backgrounds/shader-bg.mp4
```

(Si se usó el fallback en el Step 2, usar acá el mismo fallback `-vf` con `-c:v libx264 -profile:v high -crf 26 -pix_fmt yuv420p -movflags +faststart`.)

- [ ] **Step 4: Generar el poster (frame cerca del final, brillo apenas levantado)**

```bash
SRC="$HOME/Downloads/shader-lab-2026-05-13T00-04-52.webm"
ffmpeg -y -sseof -1 -i "$SRC" -frames:v 1 -vf "scale=1440:-2,boxblur=3:1,eq=brightness=0.05" -q:v 4 public/backgrounds/shader-bg-poster.jpg
```

- [ ] **Step 5: Verificar tamaños y metadata**

```bash
ls -lh public/backgrounds/
ffprobe -v error -show_entries stream=codec_name,width,height -show_entries format=duration,size -of default=noprint_wrappers=1 public/backgrounds/shader-bg.webm
ffprobe -v error -show_entries stream=codec_name,width,height -show_entries format=duration,size -of default=noprint_wrappers=1 public/backgrounds/shader-bg.mp4
```

Esperado: ambos videos ~1440px de ancho, ~8.2s de duración, **cada uno bien por debajo de 5 MB** (idealmente 1–4 MB); poster `.jpg` ~80–250 KB. Si algún video supera ~4 MB, re-correr ese encode con `-crf 40` (webm) / `-crf 28` (mp4), o bajar el `scale` a `1280:-2`. Verificar visualmente que el `.jpg` se ve bien (abrirlo o `qlmanage -p public/backgrounds/shader-bg-poster.jpg`).

- [ ] **Step 6: Commit**

```bash
git add public/backgrounds/
git commit -m "$(cat <<'EOF'
feat(home): add optimized shader background video assets

WebM/VP9 + MP4/H.264 (~1440px, crossfade loop, no audio) + JPG poster,
re-encoded from the 4K source (not committed). Used by the upcoming
Home video background.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Crear el componente `VideoBackground`

**Files:**
- Create: `src/components/VideoBackground/styled.tsx`
- Create: `src/components/VideoBackground/index.tsx`

El componente todavía no se monta en ninguna página en esta task — solo se crea y se chequea que compila/lintea. No requiere cambios en `src/types/index.ts` (no tiene props).

- [ ] **Step 1: Crear `src/components/VideoBackground/styled.tsx`**

```tsx
//! Third-party
import styled from 'styled-components';

export const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	z-index: -1;
	overflow: hidden;
	pointer-events: none;
`;

export const Poster = styled.img`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
`;

export const Video = styled.video`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	opacity: 0;
	transition: opacity 600ms ease;

	&[data-playing='true'] {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		display: none;
		transition: none;
	}
`;

export const Scrim = styled.div`
	position: absolute;
	inset: 0;
	background-color: rgba(10, 11, 4, 0.62);
	background-image: radial-gradient(
		ellipse at center,
		rgba(10, 11, 4, 0) 35%,
		rgba(10, 11, 4, 0.4) 100%
	);
`;
```

- [ ] **Step 2: Crear `src/components/VideoBackground/index.tsx`**

```tsx
//! Third-party
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

//? Hooks
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

//* Styled
import { Backdrop, Poster, Video, Scrim } from './styled';

const POSTER_SRC = '/backgrounds/shader-bg-poster.jpg';
const WEBM_SRC = '/backgrounds/shader-bg.webm';
const MP4_SRC = '/backgrounds/shader-bg.mp4';

function VideoBackground() {
	const { isDarkMode } = useTheme();
	const breakpoint = useBreakpoint();
	const prefersReducedMotion = usePrefersReducedMotion();

	const allowVideo =
		isDarkMode && !prefersReducedMotion && breakpoint.startsWith('desktop-');

	const [showVideo, setShowVideo] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (!allowVideo) {
			setShowVideo(false);
			setIsPlaying(false);
			return;
		}
		const requestIdle =
			window.requestIdleCallback?.bind(window) ??
			((cb: () => void) => window.setTimeout(cb, 200));
		const cancelIdle =
			window.cancelIdleCallback?.bind(window) ?? window.clearTimeout;
		const id = requestIdle(() => setShowVideo(true));
		return () => cancelIdle(id);
	}, [allowVideo]);

	if (!isDarkMode) return null;

	return createPortal(
		<Backdrop aria-hidden="true">
			<Poster src={POSTER_SRC} alt="" decoding="async" />
			{showVideo && (
				<Video
					data-playing={isPlaying}
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					poster={POSTER_SRC}
					tabIndex={-1}
					disablePictureInPicture
					onPlaying={() => setIsPlaying(true)}
				>
					<source src={WEBM_SRC} type="video/webm" />
					<source src={MP4_SRC} type="video/mp4" />
				</Video>
			)}
			<Scrim />
		</Backdrop>,
		document.body,
	);
}

export default VideoBackground;
```

- [ ] **Step 3: Lint + typecheck**

```bash
npm run lint
npx tsc
```

Esperado: ambos pasan sin errores ni warnings (`lint` corre con `--max-warnings 0`; `tsc` usa `tsconfig.json` con `noEmit: true`). Si `tsc` se queja de `requestIdleCallback`/`disablePictureInPicture`, no debería con `@types/react@19` y `lib: ["DOM"]` — si igual pasa, simplificar el montaje diferido a `const id = window.setTimeout(() => setShowVideo(true), 200); return () => window.clearTimeout(id);` y reportar.

- [ ] **Step 4: Commit**

```bash
git add src/components/VideoBackground/
git commit -m "$(cat <<'EOF'
feat(home): add VideoBackground component

Portaled fixed backdrop: always-on poster <img>, deferred <video>
(dark + desktop + no reduced-motion only), and a readability scrim.
Not wired into any page yet.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Montar el background en Home y dejar transparente `#root`

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/App.css` (regla `#root`, cerca de la línea 11)

- [ ] **Step 1: Importar y montar `<VideoBackground />` en `Home.tsx`**

En la sección de imports de componentes de `src/pages/Home.tsx`, agregar (junto a los otros `//* Components`):

```tsx
//* Components
import VideoBackground from '../components/VideoBackground';
```

Y en el `return` de `Home`, agregarlo como primer hijo del fragmento, antes del `skip-link`:

```tsx
	return (
		<>
			<VideoBackground />
			<a href="#main-content" className="skip-link">
				{t('skipLink')}
			</a>
			<StyledMain id="main-content">
```

(El resto del JSX de `Home` queda igual.)

- [ ] **Step 2: Quitar el `background-color` opaco de `#root` en `src/App.css`**

En la regla `#root { ... }` (empieza alrededor de la línea 11 de `src/App.css`), eliminar la línea `background-color: var(--background);` y dejar un comentario en su lugar. Queda así:

```css
#root {
	position: relative;
	isolation: isolate;
	padding-top: 85px;
	text-align: start;
	/* No background-color: el VideoBackground de Home se renderiza detrás de #root;
	   body conserva `background: var(--background)` como piso de fallback (todas las rutas). */
	background-image: url('/vectors/header-vector.svg');
	background-position: top center;
	background-size: auto;
	background-repeat: repeat-x;

	@media (min-width: 1280px) {
		background-image: url('/vectors/header-vector-desktop.svg');
	}

	@media (prefers-color-scheme: light) {
		background-image: url('/vectors/header-vector-light.svg');

		@media (min-width: 1280px) {
			background-image: url('/vectors/header-vector-desktop-light.svg');
		}
	}
}
```

(No tocar `#root::before`, `#root::after`, ni las reglas `:root[data-theme=...] #root`.)

- [ ] **Step 3: Lint + typecheck**

```bash
npm run lint
npx tsc
```

Esperado: ambos pasan limpio.

- [ ] **Step 4: Verificación visual con la skill `agent-browser`**

Asegurarse de que el dev server esté corriendo (`npm run dev` → http://localhost:5173/; si no, levantarlo). Usar la skill `agent-browser` para abrir Home y verificar (sacar screenshot en cada caso):

1. **Desktop (viewport ~1440×900), tema oscuro** (el theme switcher arranca en `system`; si el SO está en claro, emular `prefers-color-scheme: dark` o usar el ThemeSwitcher de la UI para forzar dark): el video se reproduce, loopea **sin corte visible** en la costura, y **todas las secciones se leen bien** sobre el scrim — recorrer Profile, About, Projects, ActivityFeed, Skills, Works, Blog y Footer scrolleando.
2. **Viewport angosto (~1100px de ancho)** → recargar → confirmar que se ve **solo el poster** (sin reproducción) y que **no se pidió `shader-bg.webm` ni `shader-bg.mp4`** en la pestaña Network.
3. **Tema claro** (emular `prefers-color-scheme: light` o togglear el tema en la UI) → confirmar que **no aparece ningún backdrop de video** y la página se ve como antes (fondo crema).
4. **`prefers-reduced-motion: reduce` + desktop oscuro** → confirmar que se ve **solo el poster**, sin `<video>`.
5. (Nice-to-have, si `agent-browser` soporta WebKit) abrir Home en un contexto WebKit en desktop oscuro y confirmar que el video se reproduce vía el `<source>` MP4 (Safari no autoreproduce VP9/WebM de forma confiable).

Anotar cualquier problema de legibilidad o de prominencia del header-vector sobre el video para la Task 4. **No commitear todavía si hay ajustes pendientes** — si todo se ve bien, seguir al Step 5.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.tsx src/App.css
git commit -m "$(cat <<'EOF'
feat(home): render fixed video background behind content

Mount VideoBackground in Home and make #root transparent so the
portaled backdrop shows through; body keeps the fallback color.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Ajuste fino de legibilidad y verificación final

**Files:**
- Modify (según hallazgos de la Task 3): `src/components/VideoBackground/styled.tsx` y/o `src/App.css`
- Posible re-encode de `public/backgrounds/*` (solo si el blur quedó muy off)

- [ ] **Step 1: Ajustar el scrim/viñeta según lo observado en la Task 3**

Si alguna sección quedó poco legible, subir la opacidad del relleno del `Scrim` en `styled.tsx` (ej. `rgba(10, 11, 4, 0.62)` → `0.7` u `0.75`) y/o intensificar la viñeta. Si quedó demasiado oscuro y mata el video, bajarla. Iterar con `agent-browser` hasta que todas las secciones de Home se lean bien Y el video siga siendo perceptible.

Si la franja `header-vector` (en `background-image` de `#root`) compite feo con el video arriba: **antes de tocarla, comentarlo con el usuario** — la opción es eliminar la línea `background-image: ...` (y sus media queries) de la regla `#root` en `src/App.css` (y evaluar lo mismo para `#root::after`). No hacerlo unilateralmente.

Si el blur horneado en el video quedó muy fuerte (mata el grano del shader) o muy débil (se ven artefactos de compresión / cuesta leer): re-correr los encodes de la Task 1 con otro valor de `boxblur` (ej. `boxblur=2:1` o `boxblur=4:1`) y volver a verificar tamaños.

- [ ] **Step 2: Lint + typecheck**

```bash
npm run lint
npx tsc
```

Esperado: ambos pasan limpio.

- [ ] **Step 3: Verificación visual final con `agent-browser`**

Repetir los 4 casos del Step 4 de la Task 3 (desktop oscuro / viewport angosto / tema claro / reduced-motion) y confirmar que todo quedó bien. Revisar también en la pestaña Network que el peso transferido de los assets esté en lo esperado (videos < ~5 MB, poster < ~250 KB).

- [ ] **Step 4: Limpieza de artefactos de dev**

```bash
rm -f /tmp/frame_*.png /tmp/lastframe.png /tmp/firstframe_bright.png
git status
```

Confirmar que `git status` muestra solo cambios intencionales (nada raro en working tree).

- [ ] **Step 5: Commit (si hubo ajustes)**

```bash
git add -A
git commit -m "$(cat <<'EOF'
style(home): tune video background scrim for readability

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

(Si la Task 4 no requirió ningún cambio, saltear el commit.)

- [ ] **Step 6: Cierre de la rama**

La rama es `feat/video-background-home` (sale de `develop`). **No pushear ni abrir PR sin que el usuario lo pida.** Cuando el usuario dé el OK, invocar la skill `superpowers:finishing-a-development-branch` para decidir el merge/PR — el flujo del repo es `feature → develop → main` y los PRs se crean con la CLI `gh` (no el MCP de GitHub).

---

## Self-Review

**Spec coverage:**
- "Pipeline de assets (webm/mp4/poster en `public/backgrounds/`, no subir el 4K, comandos ffmpeg documentados)" → Task 1. ✓
- "Componente `VideoBackground` (sin props, decorativo, gating por tema/breakpoint/reduced-motion, montaje diferido del `<video>`, dos `<source>`, poster siempre presente)" → Task 2. ✓
- "Layering: `#root` transparente, body como fallback, decoraciones de `#root` por encima del video" → Task 2 (`z-index: -1` + portal a body) + Task 3 (quitar `background-color` de `#root`). ✓ — Nota: la spec mencionaba "subir el header-vector a una capa propia con opacidad reducida"; el plan en cambio lo deja en `#root`'s `background-image` (que sigue renderizando por encima del video, porque el video va a body-level con `z-index:-1` y `#root` es z-index auto). La capa propia / reducción de opacidad del header-vector queda como ajuste condicional en Task 4 Step 1 si compite visualmente. Discrepancia menor y consciente.
- "Scrim / viñeta / blur horneado, valores tuneables" → Task 2 (defaults en `styled.tsx` + `boxblur` en Task 1) + Task 4 (tuning). ✓
- "Solo Home, solo tema oscuro, solo desktop ≥1280px (resto → poster), `position: fixed`, loop con crossfade ~0.5s" → Tasks 1–3. ✓
- "Accesibilidad: `aria-hidden`, `tabIndex={-1}`, `alt=""`, sin video con reduced-motion" → Task 2 (`Backdrop aria-hidden`, `Video tabIndex={-1}`, `Poster alt=""`, gating `!prefersReducedMotion` + `@media (prefers-reduced-motion)` en `styled.tsx`). ✓
- "Verificación: lint + tsc + check visual con agent-browser en los 4 escenarios + Network" → Task 3 Step 4 + Task 4 Step 3. ✓
- "Cleanup de artefactos de dev antes de commitear" → Task 4 Step 4. ✓
- "Sin nuevas dependencias, sin script de build" → respetado (solo `react-dom`'s `createPortal`, ya disponible). ✓

**Placeholder scan:** No hay "TBD/TODO". Los puntos "según hallazgos" en Task 4 son condicionales legítimos con instrucciones concretas (qué archivo, qué valores, qué hacer). El fallback de ffmpeg está dado con comando completo. Sin pasos vagos.

**Type / nombre consistency:** `Backdrop`, `Poster`, `Video`, `Scrim` exportados en `styled.tsx` (Step 1 Task 2) y consumidos con esos mismos nombres en `index.tsx` (Step 2 Task 2). `useTheme` → `isDarkMode`, `useBreakpoint` → string que se chequea con `.startsWith('desktop-')` (valores `desktop-sm|md|lg|xl` en `BREAKPOINTS`), `usePrefersReducedMotion` → boolean. Rutas de assets `/backgrounds/shader-bg{.webm,.mp4,-poster.jpg}` consistentes entre Task 1 (output paths) y Task 2 (`POSTER_SRC`/`WEBM_SRC`/`MP4_SRC`). `data-playing` seteado en `index.tsx` y matcheado por `&[data-playing='true']` en `styled.tsx`. Consistente.
