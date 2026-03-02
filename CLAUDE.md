# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio personal construido con React 19, TypeScript, Vite y styled-components. Multi-page app con `react-router-dom` — Home (`/`) y WorkDetail (`/work/:slug`, lazy-loaded). Implementa un cursor SVG personalizado con animaciones GSAP y smooth scroll con Lenis.

## Commands

```bash
npm run dev        # Servidor de desarrollo con --host (accesible desde la red local)
npm run build      # fetch-tweets + tsc + vite build (fetches tweets, compila TS y construye para producción)
npm run preview    # Previsualiza la build de producción
npm run lint       # ESLint con TypeScript (--max-warnings 0, falla con cualquier warning)
```

No hay tests configurados.

## Architecture

### Component Tree

`App.tsx` monta: `ErrorBoundary` > `SplashProvider` > `RouterProvider`. El shell (`AppShell`) envuelve en `ReactLenis` (si no hay reduced-motion) > `ThemeProvider` > `SplashGuard` + `Outlet`.

`Home.tsx` es el layout principal. Renderiza bloques `<MediaQuery>` completamente distintos para cada rango de tamaño — no es un layout adaptable, sino JSX diferente por breakpoint.

### Breakpoints (más granulares que mobile/tablet/desktop)

Los componentes usan rangos específicos con `react-responsive` `<MediaQuery>`:
- **Mobile**: 360-767px, 768-959px (sub-rangos frecuentes)
- **Tablet**: 960-1279px
- **Desktop**: 1280-1339px, 1340-1439px, 1440-1800px, 1801px+

Cada sección (About, Skills, Works, etc.) define sus propios `<MediaQuery>` internamente — no dependen de un breakpoint centralizado.

### Transient Props (styled-components)

Todos los componentes usan el prefijo `$` para props que no deben pasar al DOM (ej: `$variant`, `$m`, `$p`). Este es el patrón nativo de styled-components v5.1+ que reemplaza a `StyleSheetManager` + `shouldForwardProp`.

### Container Component

`src/components/Containers/Container.tsx` — wrapper flexbox fundamental. Props:
- `w`, `minW`, `maxW`, `h`, `minH`, `maxH`: dimensiones CSS directas
- `m`, `p`: arrays de strings que mapean a CSS vars (`['36', '0', '36', '0']` → `var(--36) var(--0) var(--36) var(--0)`)
- `direction`, `justify`, `align`, `gap`, `wrap`: propiedades flexbox
- `style`: string de CSS literal (no un objeto, sino un template string)

### Section Containers

`src/components/Containers/{About,Profile,Projects,Skills,Works,Header,Footer}.tsx` — cada uno es un componente auto-contenido con su propio styled-component y múltiples `<MediaQuery>` internos. Algunos aceptan `flex` prop para layout desktop (ej: `<Skills flex={1} />`, `<Works flex={2} />`).

### Text Component & Variants

`Text` acepta un `variant` tipado (`TextVariant`) que determina estilos. Variantes existentes:
- `title`, `subtitle`, `subtitle-sm`
- `body`, `body-sm`, `body-lg`
- `label`, `caption`

La variante `body-lg` incluye media queries internas para ajustar font-size en desktop.

### CSS Variables (index.css)

- **Spacing**: `--0` a `--72` (valores en px)
- **Colors**: `--text`, `--background`, `--primary`, `--secondary`, `--secondary-60`, `--accent`, `--neutral-dark-05`, `--neutral-dark-15`, `--pill-text-hovered`
- Color scheme: ambos temas (light/dark) usan los mismos valores actualmente

### Animation & Interaction

- **GSAP**: Registrado centralmente en `src/lib/gsap.ts`. `Cursor` usa `gsap.quickTo()` con `Expo.easeOut` para seguimiento del mouse. Se oculta en dispositivos táctiles (`hover: none` + `pointer: coarse`) y sobre elementos interactivos (`.button`, `.work-card`, `.project-card`, `a`, `link`)
- **Reduced motion**: Hook compartido `usePrefersReducedMotion()` — reactivo al cambio de preferencia del usuario
- **Lenis**: Smooth scroll con `lerp: 0.12, duration: 1.2, smoothWheel: true` (desactivado si reduced-motion)
- **Swiper**: `WorkCardsCarousel` usa Swiper con `Autoplay` module. En mobile muestra cards estáticas; en tablet/desktop usa carousel con `slidesPerView` variable (1, 2, o 3 según breakpoint)

### Theme System

`ThemeContext` detecta `prefers-color-scheme` y expone `isDarkMode` via context. Hook: `useTheme()`. Actualmente sin efecto visual porque ambos temas comparten los mismos colores.

## Key Conventions

- **Import comments**: `//!` terceros, `//?` lógica/hooks, `//*` componentes/assets internos
- **Tipos**: definidos en `src/types/index.ts` — incluye props de todos los componentes principales y tipos de API
- **Props**: todos los componentes usan interfaces tipadas (ej: `WorkCardProps`, `ButtonProps`, `TextProps`)
- **Styled components**: separados en `styled.tsx` junto al `index.tsx` del componente (excepto secciones como About/Skills que definen styled-components inline)
- **Cursor**: `body { cursor: none }` global — el cursor SVG customizado reemplaza al nativo
- **Fonts**: Evolventa (Regular/Bold) via @font-face + Plus Jakarta Sans via Google Fonts
- **Assets**: organizados en `/assets/{fonts,images,vectors,icons,works}`
