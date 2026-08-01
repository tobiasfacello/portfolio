import styled, { css } from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Variants
import { control } from './variants';

/**
 * Shared surfaces for the interior set.
 *
 * The source library builds everything from three materials — bezel (the page),
 * panel (the lifted card) and well (the recessed slot). These map that idea onto
 * the portfolio's own tokens so the ported components read as part of this
 * design system rather than importing a second one.
 */

/** The lifted card. Content lives here. */
export const panelSurface = css`
	position: relative;
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-lg);
	backdrop-filter: blur(var(--blur-md));
	-webkit-backdrop-filter: blur(var(--blur-md));
	${glassGradientBorder({ radius: 'var(--radius-lg)' })}
`;

/** The recessed slot: inputs, code blocks, previews, chips. */
export const wellSurface = css`
	position: relative;
	background-color: var(--glass-bg-bold);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	${glassGradientBorder({ radius: 'var(--radius-md)' })}
`;

/**
 * An interactive control at rest, at the default size and tone.
 *
 * Kept as a named export because most ported controls want exactly this; reach
 * for `control({ size, tone })` from `./variants` when one needs to differ.
 */
export const controlSurface = control();

/** Resets a native button down to a styleable box. */
export const bareButton = css`
	appearance: none;
	margin: 0;
	padding: 0;
	border: none;
	background: none;
	color: inherit;
	font: inherit;
	text-align: inherit;
	cursor: pointer;
	touch-action: manipulation;
`;

/**
 * The give under a press.
 *
 * Written against the standalone `scale` property rather than `transform`, for
 * one specific reason: GSAP writes to `transform`, and the two compose instead
 * of clobbering each other. A card being dragged by GSAP still depresses when
 * you press it, and a CSS `transition: transform` never lands on an element
 * GSAP is updating every frame — which would have fought the tween.
 */
export const pressable = css`
	@media (prefers-reduced-motion: no-preference) {
		transition: scale var(--transition-fast) var(--ease-state);

		&:active:not(:disabled):not([aria-disabled='true']) {
			scale: 0.97;
		}
	}
`;

/**
 * The same give, tuned for a full-width row.
 *
 * 0.97 on a 700px row pulls each edge in by ten pixels and reads as a glitch.
 * A row only needs enough travel to confirm the press landed.
 */
export const pressableRow = css`
	@media (prefers-reduced-motion: no-preference) {
		transition: scale var(--transition-fast) var(--ease-state);

		&:active:not(:disabled):not([aria-disabled='true']) {
			scale: 0.99;
		}
	}
`;

/**
 * Grows the touch target past the visible box without moving anything.
 *
 * `size` is the target edge — pass the tightest of `--hit-area-touch` (44px),
 * `--hit-area-desktop` (40px) or `--hit-area-min` (24px, the WCAG 2.5.8 floor)
 * that does not collide with a neighbouring control. Two hit areas must never
 * overlap, so a chip's delete button gets the floor while a lone icon button in
 * open space gets the full 44.
 */
export const hitArea = (size = 'var(--hit-area-touch)') => css`
	position: relative;

	&::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		width: max(100%, ${size});
		height: max(100%, ${size});
	}
`;

/** UI label type — the pixel face the DS uses for controls and metadata. */
export const uiLabel = css`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	font-weight: var(--font-weight-medium);
	line-height: var(--line-height-label);
	color: var(--text);
`;

/** Body copy inside ported components. */
export const uiBody = css`
	font-family: var(--font-plus-jakarta-sans);
	font-size: var(--font-size-body-sm);
	line-height: var(--line-height-body-sm);
	color: var(--text);
`;

/**
 * Stacks children in a single grid cell so a component can hold every state it
 * can reach at once. Reserving the space up front is what stops a label change
 * from resizing its button mid-animation.
 */
export const StyledStateStack = styled.span`
	display: grid;
	grid-template-areas: 'state';

	> * {
		grid-area: state;
	}
`;

/** Visually hidden but announced — matches the global `.sr-only` helper. */
export const StyledVisuallyHidden = styled.span`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
`;

/**
 * Focus ring drawn inside the box, for controls that sit flush against a
 * neighbour and have no room for an offset outline — tabs, table headers,
 * pagination slots, tree rows.
 *
 * The outline is genuinely replaced here rather than merely removed, which is
 * the only reason `outline: none` is defensible. Forced-colors mode drops
 * box-shadow entirely, though, so the outline has to come back there or the
 * indicator disappears exactly for the users who most depend on it.
 */
export const insetFocusRing = css`
	&:focus-visible {
		outline: none;
		box-shadow: inset 0 0 0 2px var(--focus-ring);
	}

	@media (forced-colors: active) {
		&:focus-visible {
			outline: 2px solid Highlight;
			outline-offset: -2px;
		}
	}
`;

/** The same, drawn outside the box where there is room for it. */
export const outsetFocusRing = css`
	&:focus-visible {
		outline: none;
		box-shadow: 0 0 0 2px var(--focus-ring);
	}

	@media (forced-colors: active) {
		&:focus-visible {
			outline: 2px solid Highlight;
			outline-offset: 2px;
		}
	}
`;

/** Generic focus ring matching the global `:focus-visible` treatment. */
export const focusRing = css`
	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}

	@media (forced-colors: active) {
		&:focus-visible {
			outline: 2px solid Highlight;
			outline-offset: 2px;
		}
	}
`;
