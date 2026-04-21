import styled from 'styled-components';
import { spacingArray, glassCard } from '../../styles/mixins';
import { shimmerKeyframes, shimmerSurface } from './shimmer';

export type SkeletonVariant = 'rect' | 'circle' | 'pill' | 'text';

/**
 * Container-level shimmer overlay — use when a skeleton has many child elements
 * (e.g. GitHub contribution grid) to run a single sweep instead of per-child animations.
 * Drop as the last child of a `position: relative; overflow: hidden;` container.
 */
export const ShimmerOverlay = styled.div.attrs({ 'aria-hidden': true })<{
	$angle?: number;
	$duration?: number;
}>`
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 1;
	background: linear-gradient(
		${({ $angle }) => $angle ?? 110}deg,
		transparent 0%,
		var(--glass-border-start) 50%,
		transparent 100%
	);
	animation: ${shimmerKeyframes} ${({ $duration }) => $duration ?? 1.8}s ease-in-out infinite;
	will-change: transform;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
		opacity: 0;
		will-change: auto;
	}
`;

const radiusByVariant: Record<SkeletonVariant, string> = {
	rect: 'var(--radius-sm)',
	circle: 'var(--radius-circle)',
	pill: 'var(--radius-pill)',
	text: 'var(--radius-sm)',
};

const heightByVariant: Partial<Record<SkeletonVariant, string>> = {
	text: 'var(--12)',
	pill: '22px',
};

export const StyledSkeleton = styled.span<{
	$variant: SkeletonVariant;
	$w?: string;
	$h?: string;
	$radius?: string;
	$m?: string[];
}>`
	display: block;
	flex-shrink: 0;
	width: ${({ $w }) => $w || '100%'};
	height: ${({ $h, $variant }) => $h || heightByVariant[$variant] || '100%'};
	border-radius: ${({ $radius, $variant }) => $radius || radiusByVariant[$variant]};
	margin: ${({ $m }) => spacingArray($m)};
	${shimmerSurface}
`;

export const StyledSkeletonStack = styled.div<{
	$gap?: string;
	$direction?: 'row' | 'column';
	$align?: string;
	$justify?: string;
	$w?: string;
	$h?: string;
}>`
	display: flex;
	flex-direction: ${({ $direction }) => $direction || 'column'};
	gap: ${({ $gap }) => $gap || 'var(--8)'};
	width: ${({ $w }) => $w || '100%'};
	height: ${({ $h }) => $h || 'auto'};
	${({ $align }) => $align && `align-items: ${$align};`}
	${({ $justify }) => $justify && `justify-content: ${$justify};`}
`;

/* ── Card-shaped surfaces matching the glassCard mixin ───────── */

export const StyledSkeletonCard = styled.div<{
	$w?: string;
	$h?: string;
	$minH?: string;
	$p?: string[];
}>`
	position: relative;
	display: flex;
	flex-direction: column;
	width: ${({ $w }) => $w || '100%'};
	height: ${({ $h }) => $h || 'auto'};
	${({ $minH }) => $minH && `min-height: ${$minH};`}
	padding: ${({ $p }) => spacingArray($p) || 'var(--8)'};
	overflow: hidden;
	contain: layout paint;
	${glassCard(true)}
`;
