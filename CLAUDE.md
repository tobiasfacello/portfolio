# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio personal construido con React 19, TypeScript, Vite y styled-components. Single-page app sin routing — toda la UI vive en `src/pages/Home.tsx`. Implementa un cursor SVG personalizado con animaciones GSAP y smooth scroll con Lenis.

## Commands

```bash
npm run dev        # Servidor de desarrollo con --host (accesible desde la red local)
npm run build      # tsc && vite build (compila TS y construye para producción)
npm run preview    # Previsualiza la build de producción
npm run lint       # ESLint con TypeScript (--max-warnings 0, falla con cualquier warning)
```

No hay tests configurados.

## Architecture

### Component Tree

`App.tsx` monta: `ReactLenis` > `ThemeProvider` > `Cursor` + `Home`. No hay router.

`Home.tsx` es el layout principal. Renderiza bloques `<MediaQuery>` completamente distintos para cada rango de tamaño — no es un layout adaptable, sino JSX diferente por breakpoint.

### Breakpoints (más granulares que mobile/tablet/desktop)

Los componentes usan rangos específicos con `react-responsive` `<MediaQuery>`:
- **Mobile**: 360-767px, 768-959px (sub-rangos frecuentes)
- **Tablet**: 960-1279px
- **Desktop**: 1280-1339px, 1340-1439px, 1440-1800px, 1801px+

Cada sección (About, Skills, Works, etc.) define sus propios `<MediaQuery>` internamente — no dependen de un breakpoint centralizado.

### Patrón `StyleSheetManager` (aplicado en múltiples componentes)

`Container`, `Text`, `WorkCard`, `Button`, `Pill`, `SocialButton`, etc. todos usan `StyleSheetManager` con `shouldForwardProp` para evitar que props customizadas pasen al DOM. Cada componente define su array `filteredProps` localmente.

### Container Component

`src/components/Containers/Container.tsx` — wrapper flexbox fundamental. Props:
- `w`, `minW`, `maxW`, `h`, `minH`, `maxH`: dimensiones CSS directas
- `m`, `p`: arrays de strings que mapean a CSS vars (`['36', '0', '36', '0']` → `var(--36) var(--0) var(--36) var(--0)`)
- `direction`, `justify`, `align`, `gap`, `wrap`: propiedades flexbox
- `style`: string de CSS literal (no un objeto, sino un template string)

### Section Containers

`src/components/Containers/{About,Profile,Projects,Skills,Works,Header,Footer}.tsx` — cada uno es un componente auto-contenido con su propio styled-component y múltiples `<MediaQuery>` internos. Algunos aceptan `flex` prop para layout desktop (ej: `<Skills flex={1} />`, `<Works flex={2} />`).

### Text Component & Variants

`Text` acepta un `variant` string que determina estilos. Variantes existentes:
- `title`, `subtitle-fst`, `subtitle-fst desktop`, `subtitle-snd`
- `paragraph`, `paragraph work-card`, `paragraph desktop`
- `details-fst`, `details-snd`

Los variantes con sufijo "desktop" incluyen media queries internas para ajustar font-size.

### CSS Variables (index.css)

- **Spacing**: `--0` a `--72` (valores en px)
- **Colors**: `--text`, `--background`, `--primary`, `--secondary`, `--secondary-60`, `--accent`, `--neutral-dark-05`, `--neutral-dark-15`, `--pill-text-hovered`
- Color scheme: ambos temas (light/dark) usan los mismos valores actualmente

### Animation & Interaction

- **GSAP**: `Cursor` usa `gsap.quickTo()` con `Expo.easeOut` para seguimiento del mouse. Se oculta en dispositivos táctiles (`hover: none` + `pointer: coarse`) y sobre elementos interactivos (`.button`, `.work-card`, `.project-card`, `a`, `link`)
- **Lenis**: Smooth scroll con `lerp: 0.1, duration: 1.7, smoothWheel: true`
- **Swiper**: `WorkCardsCarousel` usa Swiper con `Autoplay` module. En mobile muestra cards estáticas; en tablet/desktop usa carousel con `slidesPerView` variable (1, 2, o 3 según breakpoint)

### Theme System

`ThemeContext` detecta `prefers-color-scheme` y expone `isDarkMode` via context. Hook: `useTheme()`. Actualmente sin efecto visual porque ambos temas comparten los mismos colores.

## Key Conventions

- **Import comments**: `//!` terceros, `//?` lógica/hooks, `//*` componentes/assets internos
- **Tipos**: definidos en `src/types/index.ts` (actualmente solo ThemeProviderProps y ThemeContextType)
- **Props**: la mayoría de componentes usan `props: any` en lugar de interfaces tipadas
- **Styled components**: separados en `styled.tsx` junto al `index.tsx` del componente (excepto secciones como About/Skills que definen styled-components inline)
- **Cursor**: `body { cursor: none }` global — el cursor SVG customizado reemplaza al nativo
- **Fonts**: Evolventa (Regular/Bold) via @font-face + Plus Jakarta Sans via Google Fonts
- **Assets**: organizados en `/assets/{fonts,images,vectors,icons,works}`
