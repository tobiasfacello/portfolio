import { css, keyframes } from 'styled-components';

/**
 * Transform-based shimmer — GPU-composited, avoids per-frame repaint that
 * background-position would cause. Applied via ::after pseudo, so the host
 * element keeps a solid base color and the overlay gradient translates across it.
 */
export const shimmerKeyframes = keyframes`
	from { transform: translate3d(-100%, 0, 0); }
	to { transform: translate3d(100%, 0, 0); }
`;

export const shimmerSurface = css`
	position: relative;
	overflow: hidden;
	background-color: var(--glass-bg-bold);

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--glass-border-start) 50%,
			transparent 100%
		);
		animation: ${shimmerKeyframes} 1.5s ease-in-out infinite;
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		&::after {
			animation: none;
			opacity: 0;
		}
	}
`;
