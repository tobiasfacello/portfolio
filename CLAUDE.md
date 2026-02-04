# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio personal construido con React 19, TypeScript, Vite y styled-components. Implementa un diseño responsivo con breakpoints específicos (mobile: 360-959px, tablet: 960-1279px, desktop: 1280+) y un cursor personalizado con animaciones GSAP.

## Commands

### Development
```bash
npm run dev        # Inicia el servidor de desarrollo en modo host (accesible desde la red local)
npm run build      # Compila TypeScript y construye para producción
npm run preview    # Previsualiza la build de producción
npm run lint       # Ejecuta ESLint con TypeScript
```

## Architecture

### Component Structure

**Container Component Pattern**: El componente `Container` (src/components/Containers/Container.tsx) es fundamental en toda la aplicación. Es un wrapper de styled-components que acepta props para estilos flexbox:
- `w`, `minW`, `maxW`: width
- `h`, `minH`, `maxH`: height
- `m`, `p`: margin y padding (arrays que mapean a variables CSS)
- `direction`, `justify`, `align`, `gap`, `wrap`: propiedades de flexbox
- `style`: string de CSS inline para estilos adicionales

Usa `StyleSheetManager` con `shouldForwardProp` para evitar que props customizadas pasen al DOM.

### Responsive Layouts

El archivo `Home.tsx` define layouts completamente diferentes para cada breakpoint usando `react-responsive` MediaQuery. No hay un layout base que se adapta - cada rango de tamaño tiene su propia estructura JSX completa con diferentes composiciones de `Container`.

### Styling System

**CSS Variables**: Definidas en `index.css`:
- Spacing: `--0` a `--72` (px values)
- Colors: Sistema de tema con `prefers-color-scheme` (aunque actualmente ambos temas usan los mismos valores)
- Las variables se referencian en components vía `var(--variable-name)`

**Styled Components**: Cada componente visual tiene su archivo `styled.tsx` separado del lógico `index.tsx`.

### Animation & Interaction

**GSAP Integration**: El componente `Cursor` usa:
- `useGSAP` hook de @gsap/react
- `gsap.quickTo()` para animaciones de seguimiento del cursor con `Expo.easeOut`
- Detección de dispositivos móviles via `window.matchMedia('(hover: none) and (pointer: coarse)')`

**Smooth Scroll**: ReactLenis wrapper en App.tsx con `lerp: 0.1, duration: 1.7`.

### Theme System

`ThemeContext` detecta `prefers-color-scheme` y proporciona `isDarkMode` via context. El hook `useTheme` encapsula el acceso al contexto con error handling.

## Key Conventions

- **Imports**: Comentarios con `//!` para imports de terceros, `//?` para lógica/hooks
- **TypeScript**: Strict mode habilitado, tipos definidos en `src/types/index.ts`
- **Assets**: Organizados en `/assets/{fonts,images,vectors,icons,works}`
- **Custom fonts**: Evolventa (Regular/Bold) cargadas via @font-face
- **Cursor personalizado**: El body tiene `cursor: none` y usa el componente Cursor SVG personalizado
