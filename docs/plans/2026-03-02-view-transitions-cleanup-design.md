# View Transitions Cleanup — Cross-fade limpio para Home ↔ WorkDetail

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reemplazar el shared element transition roto (`work-hero`) por un cross-fade global de página limpio y profesional.

**Architecture:** Eliminar toda referencia al named view transition `work-hero` en WorkCard y HeroShowcase, y refinar el cross-fade del root en `view-transitions.css`. El mecanismo `viewTransition: true` de react-router-dom sigue activo — solo eliminamos el shared element.

**Tech Stack:** React Router v7 (View Transitions API nativa), CSS View Transitions

---

## Task 1: Limpiar shared element de WorkCard

**Files:**
- Modify: `src/components/WorkCard/index.tsx:2-3` (imports), `:45` (variable), `:169` (style prop)

**Step 1: Eliminar import y uso de `useViewTransitionState`**

En `src/components/WorkCard/index.tsx`:

1. Línea 3 — cambiar import de react-router-dom:
```tsx
// ANTES
import { useNavigate, useViewTransitionState } from 'react-router-dom';
// DESPUÉS
import { useNavigate } from 'react-router-dom';
```

2. Línea 45 — eliminar la variable:
```tsx
// ELIMINAR esta línea:
const isTransitioning = useViewTransitionState(`/work/${props.slug}`);
```

3. Línea 169 — quitar style condicional del logo:
```tsx
// ANTES
<StyledWorkLogo
    aria-hidden="true"
    style={isTransitioning ? { viewTransitionName: 'work-hero' } : undefined}
>
// DESPUÉS
<StyledWorkLogo aria-hidden="true">
```

**Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: Sin errores

**Step 3: Commit**

```
fix(work-card): remove broken work-hero shared element transition
```

---

## Task 2: Limpiar shared element de HeroShowcase

**Files:**
- Modify: `src/pages/WorkDetail/sections/HeroShowcase.tsx:32`

**Step 1: Eliminar `viewTransitionName` del HeroShowcase**

En `src/pages/WorkDetail/sections/HeroShowcase.tsx`:

Línea 31-32 — quitar style prop:
```tsx
// ANTES
<StyledHeroShowcase
    style={{ viewTransitionName: 'work-hero' }}
    onClick={() => open(src)}
// DESPUÉS
<StyledHeroShowcase
    onClick={() => open(src)}
```

**Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: Sin errores

**Step 3: Commit**

```
fix(hero-showcase): remove work-hero view transition name
```

---

## Task 3: Refinar CSS del cross-fade global

**Files:**
- Modify: `src/styles/view-transitions.css:1-13` (cross-fade + work-hero), `:74-80` (reduced motion)

**Step 1: Actualizar `view-transitions.css`**

1. Eliminar el bloque de `work-hero` (líneas 8-13)
2. Actualizar el cross-fade del root (líneas 1-6):

```css
/* ANTES */
::view-transition-old(root),
::view-transition-new(root) {
    animation-duration: 250ms;
    animation-timing-function: ease-in-out;
}

/* Shared element: work-hero */
::view-transition-old(work-hero),
::view-transition-new(work-hero) {
    animation-duration: 300ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* DESPUÉS */
::view-transition-old(root),
::view-transition-new(root) {
    animation-duration: 300ms;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

3. Actualizar bloque `prefers-reduced-motion` — eliminar referencias a `work-hero`:

```css
/* ANTES */
@media (prefers-reduced-motion: reduce) {
    ::view-transition-old(root),
    ::view-transition-new(root),
    ::view-transition-old(work-hero),
    ::view-transition-new(work-hero) {
        animation-duration: 0ms;
    }
    /* ... */
}

/* DESPUÉS */
@media (prefers-reduced-motion: reduce) {
    ::view-transition-old(root),
    ::view-transition-new(root) {
        animation-duration: 0ms;
    }
    /* ... */
}
```

**Step 2: Commit**

```
style(view-transitions): remove work-hero, refine cross-fade timing
```

---

## Task 4: Verificación manual

**Step 1: Levantar dev server y testear**

Run: `npm run dev`

Verificar:
1. Home → clic en WorkCard con detail page → cross-fade suave a WorkDetail
2. WorkDetail → clic en "back" → cross-fade suave de vuelta a Home
3. WorkCard UI no se rompe durante la transición
4. La transición se siente fluida (~300ms)

**Step 2: Verificar lint**

Run: `npm run lint`
Expected: Sin errores ni warnings

**Step 3: Verificar build**

Run: `npm run build`
Expected: Build exitosa

**Step 4: Commit final si hubo ajustes**

```
chore(view-transitions): verify build and lint pass
```
