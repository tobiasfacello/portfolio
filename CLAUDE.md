# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio personal construido con React 19, TypeScript, Vite y styled-components. Multi-page app con `react-router-dom` — Home (`/`) y WorkDetail (`/work/:slug`, lazy-loaded). Implementa smooth scroll con Lenis.

## Commands

```bash
npm run dev        # Servidor de desarrollo con --host (accesible desde la red local)
npm run build      # tsc + vite build (incluye las páginas estáticas para crawlers y agentes)
npm run preview    # Previsualiza la build de producción
npm run lint       # ESLint con TypeScript (--max-warnings 0, falla con cualquier warning)
```

No hay tests configurados.

## Architecture

### Component Tree

`App.tsx` monta: `ErrorBoundary` > `RouterProvider` (más `Analytics` y `SpeedInsights` en lazy). El shell (`AppShell`) envuelve en `ReactLenis` (si no hay reduced-motion) > `BreakpointProvider` > `Outlet`.

`Home.tsx` es el layout principal. Usa `BreakpointContext` para adaptar el layout según el tamaño de pantalla.

### Breakpoints (más granulares que mobile/tablet/desktop)

Los componentes consumen `useBreakpoint()` del `BreakpointContext`. Rangos:
- **Mobile**: 360-767px, 768-959px (sub-rangos frecuentes)
- **Tablet**: 960-1279px
- **Desktop**: 1280-1339px, 1340-1439px, 1440-1800px, 1801px+

Cada sección (About, Skills, Works, etc.) puede bifurcar su layout internamente usando el breakpoint context.

### Transient Props (styled-components)

Todos los componentes usan el prefijo `$` para props que no deben pasar al DOM (ej: `$variant`, `$m`, `$p`). Este es el patrón nativo de styled-components v5.1+ que reemplaza a `StyleSheetManager` + `shouldForwardProp`.

### Container Component

`src/components/Containers/Container.tsx` — wrapper flexbox fundamental. Props:
- `w`, `minW`, `maxW`, `h`, `minH`, `maxH`: dimensiones CSS directas
- `m`, `p`: arrays de strings que mapean a CSS vars (`['36', '0', '36', '0']` → `var(--36) var(--0) var(--36) var(--0)`)
- `direction`, `justify`, `align`, `gap`, `wrap`: propiedades flexbox
- `style`: string de CSS literal (no un objeto, sino un template string)

### Section Containers

`src/components/Containers/{About,Profile,Projects,Skills,Works,Header,Footer}.tsx` — cada uno es un componente auto-contenido con su propio styled-component. Algunos aceptan `flex` prop para layout desktop (ej: `<Skills flex={1} />`, `<Works flex={2} />`).

### Text Component & Variants

`Text` acepta un `variant` tipado (`TextVariant`) que determina estilos. Variantes existentes:
- `title`, `subtitle`, `subtitle-sm`
- `body`, `body-sm`, `body-lg`
- `label`, `caption`

La variante `body-lg` incluye media queries internas para ajustar font-size en desktop.

### CSS Variables (index.css)

- **Spacing**: `--0` a `--72` (valores en px)
- **Colors**: `--text`, `--background`, `--primary`, `--secondary`, `--secondary-60`, `--accent`, `--neutral-dark-05`, `--neutral-dark-15`, `--pill-text-hovered`
- Color scheme: un solo tema, oscuro, definido en `:root` (`color-scheme: dark`). No hay modo claro

### Animation & Interaction

- **Reduced motion**: Hook compartido `usePrefersReducedMotion()` — reactivo al cambio de preferencia del usuario
- **Lenis**: Smooth scroll con `lerp: 0.12, duration: 1.2, smoothWheel: true` (desactivado si reduced-motion)
- **Swiper**: `WorkCardsCarousel` usa Swiper solo con el módulo `A11y`. El autoplay es propio (`useAutoplay` en `SwiperCarousel.tsx`): avanza cada 5s, se pausa fuera de pantalla o con la pestaña oculta y se detiene al primer arrastre. En mobile muestra cards estáticas; en tablet/desktop usa carousel con `slidesPerView` variable (1, 2, o 3 según breakpoint)
- **Video de fondo**: en la home (desktop, sin reduced-motion) `VideoBackground` reproduce un clip de 30fps. Mientras el usuario interactúa corre un pacer de 1px (`Backdrop::after`, atributo `data-pacing`) para que Chrome no baje la página a 30Hz y el scroll de Lenis se mantenga en 60fps. No lo quites sin medir el scroll

### SEO y agentes (GEO)

El sitio se renderiza en el browser, así que el HTML crudo no tendría contenido. `vite-plugins/staticPages.ts` corre después de la build y, a partir de los textos en inglés de `src/i18n/locales/en`, escribe:
- Por ruta (`/` y `/work/<slug>`): un `.html` con su `<title>`, descripción y canonical propios y el texto de la página dentro de `#root` (oculto visualmente; React lo reemplaza al montar), más una copia `.md`
- `llms.txt`, `sitemap.xml` y un `404.html`/`404.md`

`vercel.json` usa `routes` (no `rewrites`): sirve el `.md` cuando el pedido trae `Accept: text/markdown`, responde 404 reales (con cuerpo Markdown para agentes) y redirige `fache.vercel.app` a `https://www.fache.com.ar`. Una ruta nueva en el router tiene que sumarse también al plugin y a `vercel.json`. Medí con `npx is-agentic fache.com.ar`.

## Key Conventions

- **Import comments**: `//!` terceros, `//?` lógica/hooks, `//*` componentes/assets internos
- **Tipos**: definidos en `src/types/index.ts` — incluye props de todos los componentes principales y tipos de API
- **Props**: todos los componentes usan interfaces tipadas (ej: `WorkCardProps`, `ButtonProps`, `TextProps`)
- **Styled components**: separados en `styled.tsx` junto al `index.tsx` del componente (excepto secciones como About/Skills que definen styled-components inline)
- **Fonts**: Evolventa (Regular/Bold) via @font-face + Plus Jakarta Sans via Google Fonts
- **Assets**: organizados en `/assets/{fonts,images,vectors,icons,works}`

## Performance Conventions

Evitan re-renders y repintados que ya se midieron y se sacaron; mantenelas al tocar estas áreas.

- **Navegación programática**: usá `navigateTo()` de `src/lib/navigation.ts` (solo rutas absolutas) en vez de `useNavigate()`, que re-renderiza el componente en cada cambio de ruta
- **Lightbox**: `useLightboxActions()` para registrar y abrir imágenes (acciones estables, no re-renderiza al navegar el lightbox); `useLightbox()` solo donde se lee el estado
- **Tooltip**: la visibilidad va por el atributo `data-visible` en el DOM, sin estado de React
- **Animaciones en loop**: `mask-position` y `background-position` repintan en cada frame (no corren en el compositor). Preferí `transform`/`opacity`; si no se puede, acotá el recorrido o usá `steps()`
