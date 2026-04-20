import styled, { css, keyframes } from 'styled-components';
import { spacingArray, glassCard } from '../../styles/mixins';

export type SkeletonVariant = 'rect' | 'circle' | 'pill' | 'text';

const shimmer = keyframes`
	0% { background-position: -200% 0; }
	100% { background-position: 200% 0; }
`;

const skeletonSurface = css`
	background: linear-gradient(
		90deg,
		var(--glass-bg-bold) 25%,
		var(--glass-border-start) 50%,
		var(--glass-bg-bold) 75%
	);
	background-size: 200% 100%;
	animation: ${shimmer} 1.5s ease-in-out infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
		background: var(--glass-bg-bold);
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
	${skeletonSurface}
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
	${glassCard(true)}
`;
