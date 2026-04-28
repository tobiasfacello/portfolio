import styled, { keyframes, css } from 'styled-components';
import { tooltipBase } from '../../../styles/mixins';

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

const arrowAlignCss: Record<TooltipAlign, string> = {
	start: 'left: 12px;',
	center: 'left: 50%; transform: translateX(-50%);',
	end: 'right: 12px;',
};

// Origin where the modal scale anchors — paired with the arrow side so the
// pop-in feels like it grows out of the square it points at.
const originMap: Record<TooltipPosition, Record<TooltipAlign, string>> = {
	top: {
		start: 'bottom left',
		center: 'bottom center',
		end: 'bottom right',
	},
	bottom: {
		start: 'top left',
		center: 'top center',
		end: 'top right',
	},
};

const tooltipPopIn = keyframes`
	0%   { transform: scale(0.96); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
`;

const digitPopIn = keyframes`
	0%   { transform: translateY(8px); opacity: 0; filter: blur(2px); }
	100% { transform: translateY(0); opacity: 1; filter: blur(0); }
`;

const textSwapIn = keyframes`
	0%   { transform: translateY(8px); opacity: 0; filter: blur(2px); }
	100% { transform: translateY(0); opacity: 1; filter: blur(0); }
`;

// Wrapper that owns the absolute positioning (left/top + position translate).
// Keeping the layout transform here lets the inner tooltip animate `scale`
// cleanly without fighting the positioning translate.
export const StyledTooltipPositioner = styled.div`
	position: absolute;
	z-index: var(--z-tooltip);
	pointer-events: none;
`;

export const StyledContribTooltip = styled.div<{
	$position: TooltipPosition;
	$align: TooltipAlign;
}>`
	${tooltipBase}
	position: relative;
	transform-origin: ${(props) => originMap[props.$position][props.$align]};
	animation: ${tooltipPopIn} 250ms cubic-bezier(0.22, 1, 0.36, 1) both;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}

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

const reducedMotionReset = css`
	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

export const StyledTooltipDigitGroup = styled.span`
	display: inline-flex;
	align-items: baseline;
`;

export const StyledTooltipDigit = styled.span`
	display: inline-block;
	will-change: transform, opacity, filter;
	animation: ${digitPopIn} 500ms cubic-bezier(0.34, 1.45, 0.64, 1) both;
	${reducedMotionReset}
`;

export const StyledTooltipText = styled.span`
	display: inline-block;
	will-change: transform, opacity, filter;
	animation: ${textSwapIn} 200ms ease-out both;
	${reducedMotionReset}
`;
