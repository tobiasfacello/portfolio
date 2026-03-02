# Portfolio Polish — Design Document

**Date**: 2026-03-02
**Branch**: `develop` (mid-refactoring state)

## Context

The portfolio is in a mid-refactoring state with 51 modified files on `develop`. The existing changes include a new breakpoint context system, transient props migration, and reduced-motion support. This design focuses on **incremental improvements** that complement the existing work without conflicting.

## Scope: 3 Categories

### 1. Accessibility Fixes (High Impact)

- **Decorative elements need `aria-hidden`**: Cursor SVG, ASCII overlay layer in AsciiProfile
- **Focus-visible styles**: No `:focus-visible` ring on interactive elements (buttons, cards, links) — keyboard navigation is effectively broken
- **Lightbox keyboard nav**: Missing Escape to close, arrow keys to navigate — already has the infrastructure (focus trap, refs) but keyboard events are incomplete
- **HTML lang attribute**: Hardcoded `lang="en"` doesn't update when i18n switches to Portuguese

### 2. Code Quality (Moderate Impact)

- **Container prop types**: `direction`, `justify`, `align` are `string` — should be union types for IDE autocomplete and compile-time safety
- **Hardcoded "~100 posts"** in TwitterWidget — should derive from `tweets.length`
- **TwitterWidget profile image**: Empty `alt=""` — should have descriptive alt text
- **BreakpointContext value**: Not memoized, causes unnecessary re-renders on all consumers

### 3. UX Micro-Interactions (Polish)

- **Button active state**: No tactile "press" feedback — add `scale(0.98)` on `:active`
- **Card hover depth**: Work/Project cards hover is subtle (scale 1.01) — enhance with shadow lift
- **Image load transition**: Images pop in without transition — add fade-in on load

## Out of Scope

- AsciiLogo canvas refactor (too large, separate effort)
- Theme color changes (design decision needed)
- New components or features
- Changes to the existing refactoring work in progress

## Approach

All changes are additive CSS/TypeScript fixes. No architectural changes. Each improvement is independent and can be reverted individually.
