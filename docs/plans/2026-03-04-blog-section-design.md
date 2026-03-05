# Blog Section Design

## Overview

Agregar una sección de blog al portfolio con 3 blog posts mockeados estáticamente. Componente `BlogCard` reutilizable con prop `$layout` que soporta tres variantes de layout.

## Componente BlogCard

### Props

```typescript
type BlogCardLayout = 'vertical' | 'horizontal' | 'horizontal-reverse';

type BlogCardProps = {
  title: string;
  excerpt: string;
  thumbnail: string;
  $layout: BlogCardLayout;
  aspectRatio?: '4/3' | '3/4';
};
```

### Variantes de layout

- **`vertical`**: Título → Excerpt → Imagen (4:3). Contenido apilado en columna.
- **`horizontal`**: Texto (izq) + Imagen 3:4 (der). Flex row.
- **`horizontal-reverse`**: Imagen 3:4 (izq) + Texto (der). Flex row-reverse.

### Implementación

- Flexbox con `direction` controlado por `$layout`:
  - `vertical` → `column`
  - `horizontal` → `row`
  - `horizontal-reverse` → `row-reverse`
- Imagen con `object-fit: cover` y `aspect-ratio` según prop
- Texto truncado: `display: -webkit-box; -webkit-line-clamp: 3; overflow: hidden`
- Estilos: `glassCard(true)` mixin (glass bg, blur, gradient border hover)

### Estructura visual

```
VERTICAL:              HORIZONTAL:              HORIZONTAL-REVERSE:
┌──────────────┐       ┌──────────┬───────┐     ┌───────┬──────────┐
│   Título     │       │ Título   │       │     │       │ Título   │
│   Excerpt... │       │ Excerpt  │ IMG   │     │ IMG   │ Excerpt  │
│              │       │ ...      │ 3:4   │     │ 3:4   │ ...      │
│ ┌──────────┐ │       │          │       │     │       │          │
│ │ IMG 4:3  │ │       └──────────┴───────┘     └───────┴──────────┘
│ └──────────┘ │
└──────────────┘
```

## Sección Blog (Container)

- Sigue patrón de `ActivityFeed`: `sectionBase('blog')` + styled section
- Título "Blog" con `Text variant="subtitle-sm"`
- Grid: 3 columnas desktop, 1 columna mobile
- Responsive config en `responsive.ts`

## Montaje en Home.tsx

- Nueva grid-area `'blog'` después de `activity`
- Ancho completo (ocupa las 3 columnas del grid)

## Mock Data

3 artículos hardcodeados con:
- Títulos descriptivos
- Excerpts de ~3 líneas
- Imágenes placeholder locales desde `/assets`

## Estructura de archivos

```
src/components/
  BlogCard/
    index.tsx
    styled.tsx
  Containers/
    Blog.tsx
src/config/responsive.ts  (agregar blogConfig)
src/types/index.ts         (agregar BlogCardProps, BlogPostMock)
```

## Estilos clave

- `glassCard(true)` para cards internas
- `border-radius: var(--radius-lg)`
- Imagen interna con border-radius y `object-fit: cover`
- Line clamp en excerpt
- Transient props con prefijo `$` (styled-components)
