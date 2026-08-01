import { css } from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

/**
 * Size and tone variants for the ported controls and surfaces.
 *
 * Every number here is read off the portfolio's own landing components rather
 * than invented for this set — `Pill` is `xs`, `Button variant="glass"` is `sm`,
 * `Button` default is `md`, and `WidgetBase` sets the container density. That
 * matters because the ported components arrived from a library with a roomier
 * scale, and a 16px pad next to the landing's 12px reads as two design systems
 * sharing a page.
 *
 * Tones are expressed purely in tokens, so light and dark follow the theme with
 * no per-tone overrides.
 */

export type ControlSize = 'xs' | 'sm' | 'md' | 'lg';
export type ControlTone = 'default' | 'glass' | 'ghost' | 'solid' | 'danger' | 'success';
export type SurfaceDensity = 'compact' | 'base' | 'roomy';

type SizeSpec = {
	/**
	 * A floor, not a height. The landing's buttons are sized by their padding,
	 * so pinning a height here is what made the ported set stand 3px taller on
	 * the same row. This only stops a short label from collapsing the box.
	 */
	minHeight: string;
	padding: string;
	/** Square box for a lone icon, which has no line box to give it height. */
	iconBox: string;
	radius: string;
	fontSize: string;
	lineHeight: string;
	gap: string;
	icon: string;
};

/** Traced to: Pill (xs), Button glass (sm), Button default (md). */
export const CONTROL_SIZES: Record<ControlSize, SizeSpec> = {
	xs: {
		// The Pill's own height. Below the 24px target floor, so `control()`
		// grows the hit area underneath it rather than the box itself.
		minHeight: '22px',
		padding: 'var(--2) var(--8)',
		iconBox: 'var(--24)',
		radius: 'var(--radius-pill)',
		fontSize: 'var(--font-size-caption)',
		lineHeight: 'var(--line-height-caption)',
		gap: 'var(--4)',
		icon: 'var(--icon-xs)',
	},
	sm: {
		minHeight: 'var(--24)',
		padding: 'var(--4) var(--8)',
		iconBox: 'var(--24)',
		radius: 'var(--radius-md)',
		fontSize: 'var(--font-size-caption)',
		lineHeight: 'var(--line-height-caption)',
		gap: 'var(--4)',
		icon: 'var(--icon-xs)',
	},
	md: {
		minHeight: 'var(--24)',
		padding: 'var(--6) var(--12)',
		iconBox: 'var(--32)',
		radius: 'var(--radius-md)',
		fontSize: 'var(--font-size-label)',
		lineHeight: 'var(--line-height-label)',
		gap: 'var(--6)',
		icon: 'var(--icon-sm)',
	},
	lg: {
		minHeight: 'var(--32)',
		padding: 'var(--8) var(--16)',
		iconBox: 'var(--36)',
		radius: 'var(--radius-md)',
		fontSize: 'var(--font-size-body-sm)',
		lineHeight: 'var(--line-height-body-sm)',
		gap: 'var(--8)',
		icon: 'var(--icon-sm)',
	},
};

/** Container padding, from `WidgetBase` (12) outward in both directions. */
export const SURFACE_PADDING: Record<SurfaceDensity, string> = {
	compact: 'var(--8)',
	base: 'var(--12)',
	roomy: 'var(--16)',
};

/** The gap between a surface's own children, matched to its padding. */
export const SURFACE_GAP: Record<SurfaceDensity, string> = {
	compact: 'var(--6)',
	base: 'var(--12)',
	roomy: 'var(--12)',
};

const TONES: Record<ControlTone, ReturnType<typeof css>> = {
	/** The landing's outlined button: a hairline that fills on hover. */
	default: css`
		border: 1px solid var(--text);
		background-color: transparent;
		color: var(--text);
		opacity: var(--opacity-text-muted);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			opacity: var(--opacity-full);
			background-color: var(--accent);
			border-color: var(--primary);
			color: var(--pill-text-hovered);
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--primary);
		}
	`,

	/** The landing's glass button: a lit pane that solidifies on hover. */
	glass: css`
		border: 1px solid transparent;
		background-color: var(--glass-bg);
		color: var(--text);
		opacity: var(--opacity-full);
		backdrop-filter: blur(var(--blur-sm));
		-webkit-backdrop-filter: blur(var(--blur-sm));
		${glassGradientBorder({ radius: 'var(--radius-md)' })}

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--accent);
			border-color: var(--primary);
			color: var(--pill-text-hovered);
			backdrop-filter: none;
			-webkit-backdrop-filter: none;

			&::after {
				opacity: 0;
			}
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--primary);
		}
	`,

	/** No chrome until you reach for it — menu rows, icon buttons, toolbars. */
	ghost: css`
		border: 1px solid transparent;
		background-color: transparent;
		color: var(--text);
		opacity: var(--opacity-text-muted);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			opacity: var(--opacity-full);
			background-color: var(--glass-bg-bold);
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--glass-bg);
		}
	`,

	/** Filled at rest. One per view, for the action the view exists to perform. */
	solid: css`
		border: 1px solid var(--primary);
		background-color: var(--accent);
		color: var(--pill-text-hovered);
		opacity: var(--opacity-full);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--primary);
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--secondary);
			color: var(--text);
		}
	`,

	danger: css`
		border: 1px solid var(--danger);
		background-color: transparent;
		color: var(--danger);
		opacity: var(--opacity-full);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--danger-tint);
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--danger);
			color: var(--background);
		}
	`,

	success: css`
		border: 1px solid var(--success);
		background-color: transparent;
		color: var(--success);
		opacity: var(--opacity-full);

		&:hover:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--success-tint);
		}

		&:active:not(:disabled):not([aria-disabled='true']) {
			background-color: var(--success);
			color: var(--background);
		}
	`,
};

/**
 * A complete interactive control.
 *
 * `iconOnly` squares the box off and drops the label padding, which is what
 * keeps a lone icon centred instead of sitting in a stretched pill.
 */
export const control = ({
	size = 'md',
	tone = 'default',
	iconOnly = false,
}: { size?: ControlSize; tone?: ControlTone; iconOnly?: boolean } = {}) => {
	const spec = CONTROL_SIZES[size];

	return css`
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: ${spec.gap};
		min-height: ${iconOnly ? spec.iconBox : spec.minHeight};
		${iconOnly ? `min-width: ${spec.iconBox}; padding: 0;` : `padding: ${spec.padding};`}
		border-radius: ${spec.radius};
		font-family: var(--font-geist-pixel-circle);
		font-size: ${spec.fontSize};
		font-weight: var(--font-weight-medium);
		line-height: ${spec.lineHeight};
		white-space: nowrap;
		cursor: pointer;
		touch-action: manipulation;
		transition:
			opacity var(--transition-fast) var(--ease-state),
			background-color var(--transition-fast) var(--ease-state),
			border-color var(--transition-fast) var(--ease-state),
			color var(--transition-fast) var(--ease-state);

		@media (prefers-reduced-motion: no-preference) {
			transition:
				opacity var(--transition-fast) var(--ease-state),
				background-color var(--transition-fast) var(--ease-state),
				border-color var(--transition-fast) var(--ease-state),
				color var(--transition-fast) var(--ease-state),
				scale var(--transition-fast) var(--ease-state);

			&:active:not(:disabled):not([aria-disabled='true']) {
				scale: 0.97;
			}
		}

		${TONES[tone]}

		${size === 'xs' && !iconOnly
			? css`
					/* The Pill's 22px is the look we are matching, but it is under the
					   24px target floor — so the target grows underneath instead of the
					   box growing and breaking parity. ::before because the glass tone
					   has already claimed ::after for its gradient border. */
					&::before {
						content: '';
						position: absolute;
						top: 50%;
						left: 50%;
						translate: -50% -50%;
						width: 100%;
						height: var(--hit-area-min);
					}
				`
			: ''}

		svg {
			width: ${spec.icon};
			height: ${spec.icon};
			flex-shrink: 0;
		}

		&:disabled,
		&[aria-disabled='true'] {
			opacity: var(--opacity-text-disabled);
			cursor: default;
		}
	`;
};

/** A panel or card at a chosen density, matched to the landing's own cards. */
export const surface = (density: SurfaceDensity = 'base') => css`
	padding: ${SURFACE_PADDING[density]};
	gap: ${SURFACE_GAP[density]};
`;

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressTone = 'default' | 'success' | 'danger' | 'warning';

export const PROGRESS_THICKNESS: Record<ProgressSize, string> = {
	sm: 'var(--4)',
	md: 'var(--8)',
	lg: 'var(--12)',
};

/**
 * Status colours for a bar. Every value is a theme token, so a danger bar is
 * the desaturated red in dark and the deeper red in light without a second
 * definition anywhere.
 */
export const PROGRESS_TONES: Record<ProgressTone, string> = {
	default: 'var(--accent)',
	success: 'var(--success)',
	danger: 'var(--danger)',
	warning: 'var(--warning)',
};
