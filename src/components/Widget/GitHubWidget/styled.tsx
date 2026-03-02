import styled, { keyframes } from 'styled-components';
import { glassCard, glassGradientBorder } from '../../../styles/mixins';

export const StyledGitHubCard = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 280px;
	overflow: hidden;
	${glassCard(true)}
`;

export const StyledCardInner = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--12);
	padding: var(--12);
	flex: 1;
`;

export const StyledContributionHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`;

export const StyledGitHubHeaderLeft = styled.div`
	display: flex;
	align-items: center;
	gap: var(--8);
`;

export const StyledGitHubIcon = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: var(--control-xs);
	height: var(--control-xs);
	color: var(--primary);

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const StyledContribCount = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-muted);
`;

export const StyledHandle = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: 0.75rem;
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-soft);
`;

// Calendar wrapper — contains month labels, day labels, and contribution grid
export const StyledCalendarWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

// Month labels row — aligned with contribution grid columns
export const StyledMonthRow = styled.div<{ $weeks: number; $hasDayLabels: boolean }>`
	display: grid;
	grid-template-columns: ${(props) =>
		props.$hasDayLabels ? 'auto ' : ''}repeat(${(props) => props.$weeks}, 1fr);
	width: 100%;
`;

export const StyledMonthLabel = styled.span<{ $startCol: number; $span: number }>`
	grid-column: ${(props) => props.$startCol} / span ${(props) => props.$span};
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	color: var(--primary);
	padding-left: 2px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

// Flex row: day labels (optional) + contribution grid
export const StyledGridWithLabels = styled.div`
	display: flex;
	gap: 4px;
`;

// Day labels column — 7 rows matching the grid
export const StyledDayLabels = styled.div`
	display: grid;
	grid-template-rows: repeat(7, auto);
	align-items: center;
	padding-right: 2px;

	span {
		font-family: var(--font-geist-pixel-circle);
		font-size: var(--font-size-label);
		color: var(--primary);
		line-height: 1;
	}
`;

// Contribution grid: weeks as columns, days as rows
export const StyledContributionGrid = styled.div<{ $weeks: number; $gap: number }>`
	display: grid;
	grid-template-rows: repeat(7, auto);
	grid-template-columns: repeat(${(props) => props.$weeks}, 1fr);
	grid-auto-flow: column;
	gap: ${(props) => props.$gap}px;
	flex: 1;
	min-width: 0;
	overflow: hidden;
`;

const CONTRIB_LEVELS = [
	'var(--contrib-empty)',
	'var(--contrib-l1)',
	'var(--contrib-l2)',
	'var(--contrib-l3)',
	'var(--contrib-l4)',
];

export const StyledSquare = styled.div<{ $level: 0 | 1 | 2 | 3 | 4; $radius: number }>`
	aspect-ratio: 1;
	width: 100%;
	min-width: 12px;
	min-height: 12px;
	border-radius: ${(props) => props.$radius}px;
	background-color: ${(props) => CONTRIB_LEVELS[props.$level]};
	border: 1px solid var(--glass-border-start);
	transition: opacity var(--transition-fast);

	&:hover {
		opacity: 0.75;
	}
`;

// Contribution tooltip — positioned absolutely within CalendarWrapper
type TooltipAlign = 'start' | 'center' | 'end';
type TooltipPosition = 'top' | 'bottom';

const tooltipTransform: Record<TooltipPosition, Record<TooltipAlign, string>> = {
	top: {
		start: 'translateX(-12px) translateY(-100%) translateY(-8px)',
		center: 'translateX(-50%) translateY(-100%) translateY(-8px)',
		end: 'translateX(calc(-100% + 12px)) translateY(-100%) translateY(-8px)',
	},
	bottom: {
		start: 'translateX(-12px) translateY(8px)',
		center: 'translateX(-50%) translateY(8px)',
		end: 'translateX(calc(-100% + 12px)) translateY(8px)',
	},
};

const arrowAlignCss: Record<TooltipAlign, string> = {
	start: 'left: 12px;',
	center: 'left: 50%; transform: translateX(-50%);',
	end: 'right: 12px;',
};

export const StyledContribTooltip = styled.div<{
	$x: number;
	$y: number;
	$position: TooltipPosition;
	$align: TooltipAlign;
}>`
	position: absolute;
	z-index: var(--z-tooltip);
	white-space: nowrap;
	padding: var(--6) var(--12);
	border-radius: var(--radius-md);
	pointer-events: none;

	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	font-weight: var(--font-weight-medium);
	color: var(--text);

	background-color: var(--glass-bg);
	backdrop-filter: blur(var(--blur-sm));
	-webkit-backdrop-filter: blur(var(--blur-sm));
	${glassGradientBorder({ radius: 'var(--radius-md)' })}

	left: ${(props) => props.$x}px;
	top: ${(props) => props.$y}px;
	transform: ${(props) => tooltipTransform[props.$position][props.$align]};

	&::before {
		content: '';
		position: absolute;
		${(props) =>
			props.$position === 'top'
				? `top: 100%; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid var(--glass-border-start);`
				: `bottom: 100%; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 5px solid var(--glass-border-start);`}
		${(props) => arrowAlignCss[props.$align]}
	}
`;

// Loading skeleton
export const StyledSkeleton = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--12);
	padding: var(--24) var(--20);
	flex: 1;
`;

const shimmer = keyframes`
	0% { background-position: -200px 0; }
	100% { background-position: calc(200px + 100%) 0; }
`;

export const StyledSkeletonLine = styled.div<{
	$w?: string;
	$h?: string;
}>`
	width: ${(props) => props.$w || '60%'};
	height: ${(props) => props.$h || '14px'};
	border-radius: 4px;
	background: linear-gradient(
		90deg,
		var(--glass-bg-bold) 0px,
		var(--glass-bg) 40px,
		var(--glass-bg-bold) 80px
	);
	background-size: 200px 100%;
	animation: ${shimmer} 1.5s infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

export const StyledSkeletonGrid = styled.div`
	flex: 1;
	border-radius: 4px;
	background: linear-gradient(
		90deg,
		var(--glass-bg-bold) 0px,
		var(--glass-bg) 40px,
		var(--glass-bg-bold) 80px
	);
	background-size: 200px 100%;
	animation: ${shimmer} 1.5s infinite;
	min-height: 100px;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;
