# Remove Splash Animation & Add GSAP Entrance Animations

**Date:** 2026-03-03

## Goal

Remove the ASCII splash screen ("FACHE" animation) and Header, replace with staggered GSAP fade-up animations on Home page sections.

## What Gets Removed

- `src/context/SplashContext.tsx` — entire file
- `src/components/SplashScreen/` — entire directory
- `src/components/AsciiLogo/` — entire directory
- `src/components/Containers/Header.tsx` — entire file
- `SplashProvider` wrapper in `App.tsx`
- `SplashGuard` component in `App.tsx`
- `padding-top: 85px` in `App.css` (header space)
- Evaluate `header-vector.svg` backgrounds in `App.css`

## What Gets Added

### `src/hooks/useStaggerReveal.ts`

- Takes a ref to a container element
- Uses `useGSAP` from `src/lib/gsap.ts`
- Respects `usePrefersReducedMotion()` — skips animation if true
- Animates direct children: `gsap.from()` with `opacity: 0, y: 24, duration: 0.5, stagger: 0.08, ease: "power2.out"`

### Changes to `Home.tsx`

- Remove `Header` import and usage
- Add ref to `StyledMain`
- Call `useStaggerReveal(mainRef)`

### Changes to `App.tsx`

- Remove `SplashProvider`, `SplashGuard`, `SplashScreen` import, `useSplash` import
- Simplify tree: `ErrorBoundary > RouterProvider > AppShell > (Lenis > Breakpoint > Theme > ScrollReset + Outlet)`

## Approach

Hook centralizado `useStaggerReveal` en Home — un solo `gsap.from()` con stagger que anima todos los hijos directos del contenedor.
