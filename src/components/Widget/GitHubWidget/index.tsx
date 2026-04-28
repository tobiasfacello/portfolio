import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

//* Styled
import {
	StyledCalendarWrapper,
	StyledMonthRow,
	StyledMonthLabel,
	StyledGridWithLabels,
	StyledDayLabels,
	StyledContributionGrid,
	StyledSquare,
	StyledContribTooltip,
	StyledTooltipPositioner,
	StyledTooltipDigitGroup,
	StyledTooltipDigit,
	StyledTooltipText,
} from './styled';
import { StyledWidgetHandle, StyledWidgetStat } from '../WidgetBase/styled';

//* Components
import WidgetBase from '../WidgetBase';
import GitHubWidgetSkeleton from '../../Skeleton/GitHubWidgetSkeleton';

//* Icon registry
import { iconRegistry } from '../../Icon';

//? Hooks
import { useGitHubActivity } from '../../../hooks/useGitHubActivity';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

//? Config
import { gitHubCalendarConfig } from '../../../config/responsive';

//? Data
import { GITHUB_URL, GITHUB_USERNAME } from '../../../data/socialFeed';

import type { GitHubContribution } from '../../../types';

const SHORT_MONTHS = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Estimated sizes for layout calculation
const DAY_LABELS_WIDTH = 30;
const GRID_LABELS_GAP = 4;
const MIN_SQUARE_SIZE = 12;

/**
 * Slice contributions into the last N weeks for display.
 * Aligns to Sunday-start weeks and trims the partial first month
 * so only complete months that fit in the container are shown.
 */
function sliceLastWeeks(
	contributions: GitHubContribution[],
	maxWeeks: number
): GitHubContribution[] {
	const totalDays = maxWeeks * 7;
	let sliced = contributions.slice(-totalDays);

	if (sliced.length < 7) return sliced;

	// Align to start on Sunday (getDay() === 0)
	const firstDow = new Date(sliced[0].date + 'T00:00:00').getDay();
	if (firstDow !== 0) {
		sliced = sliced.slice(7 - firstDow);
	}

	// Trim partial first month — start at the first week of the next month
	const firstMonth = new Date(sliced[0].date + 'T00:00:00').getMonth();
	for (let i = 7; i < sliced.length; i += 7) {
		const month = new Date(sliced[i].date + 'T00:00:00').getMonth();
		if (month !== firstMonth) {
			sliced = sliced.slice(i);
			break;
		}
	}

	return sliced;
}

/**
 * Measures the calendar wrapper width and calculates how many weeks (columns)
 * of contribution squares fit, using a minimum square size.
 */
function useAutoWeeks(
	ref: React.RefObject<HTMLDivElement | null>,
	gap: number,
	showDayLabels: boolean,
	contributionCount: number
): number {
	const [weeks, setWeeks] = useState(0);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			const { width } = entries[0].contentRect;
			if (width <= 0) return;

			const gridWidth = width - (showDayLabels ? DAY_LABELS_WIDTH + GRID_LABELS_GAP : 0);
			if (gridWidth <= 0) return;

			const maxFromContainer = Math.floor((gridWidth + gap) / (MIN_SQUARE_SIZE + gap));
			const maxFromData = Math.ceil(contributionCount / 7);
			setWeeks(Math.max(1, Math.min(maxFromContainer, maxFromData)));
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, [ref, gap, showDayLabels, contributionCount]);

	return weeks;
}

interface MonthLabel {
	key: string;
	name: string;
	startCol: number;
	span: number;
}

/**
 * Compute month labels aligned with grid columns.
 * Each column = 1 week. Detects month boundaries from the first day of each week.
 */
function computeMonthLabels(
	gridData: GitHubContribution[],
	weeks: number,
	hasDayLabels: boolean
): MonthLabel[] {
	if (gridData.length === 0) return [];

	const labels: MonthLabel[] = [];
	let currentMonth = -1;
	let startCol = -1;
	const colOffset = hasDayLabels ? 2 : 1;

	for (let w = 0; w < weeks; w++) {
		const dayIndex = w * 7;
		if (dayIndex >= gridData.length) break;

		const date = new Date(gridData[dayIndex].date + 'T00:00:00');
		const month = date.getMonth();

		if (month !== currentMonth) {
			if (startCol !== -1) {
				const span = w + colOffset - startCol;
				labels.push({
					key: `${currentMonth}-${startCol}`,
					name: SHORT_MONTHS[currentMonth],
					startCol,
					span,
				});
			}
			currentMonth = month;
			startCol = w + colOffset;
		}
	}

	if (startCol !== -1) {
		const span = weeks + colOffset - startCol;
		labels.push({
			key: `${currentMonth}-${startCol}`,
			name: SHORT_MONTHS[currentMonth],
			startCol,
			span,
		});
	}

	return labels.filter((l) => l.span >= 2);
}

function formatDateDisplay(dateStr: string): string {
	const date = new Date(dateStr + 'T00:00:00');
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

function formatDateForA11y(dateStr: string): string {
	const date = new Date(dateStr + 'T00:00:00');
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
}

interface TooltipState {
	count: number;
	dateLabel: string;
	x: number;
	y: number;
	position: 'top' | 'bottom';
	align: 'start' | 'center' | 'end';
	// Bumped on every hover so React remounts the inner tooltip and replays
	// the entry animations even when the day-to-day position is identical.
	key: number;
}

const tooltipTransform: Record<'top' | 'bottom', Record<'start' | 'center' | 'end', string>> = {
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

const isTouchDevice =
	typeof window !== 'undefined' &&
	window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const CURRENT_YEAR = new Date().getFullYear();

export default function GitHubWidget() {
	const {
		contributions,
		totalContributions,
		loading,
		error,
	} = useGitHubActivity();

	const bp = useBreakpoint();
	const config = gitHubCalendarConfig[bp];

	const [tooltip, setTooltip] = useState<TooltipState | null>(null);

	const wrapperRef = useRef<HTMLDivElement>(null);

	const maxWeeks = useAutoWeeks(
		wrapperRef,
		config.squareGap,
		config.showDayLabels,
		contributions.length
	);

	const gridData = useMemo(
		() => (maxWeeks > 0 ? sliceLastWeeks(contributions, maxWeeks) : []),
		[contributions, maxWeeks]
	);

	// Pre-compute aria-labels to avoid 365x toLocaleDateString per render
	const ariaLabels = useMemo(
		() => gridData.map((day) => {
			const s = day.count !== 1 ? 's' : '';
			return `${day.count} contribution${s} on ${formatDateForA11y(day.date)}`;
		}),
		[gridData]
	);

	const actualWeeks = Math.ceil(gridData.length / 7);

	const monthLabels = useMemo(
		() =>
			config.showMonthLabels && actualWeeks > 0
				? computeMonthLabels(gridData, actualWeeks, config.showDayLabels)
				: [],
		[gridData, actualWeeks, config.showMonthLabels, config.showDayLabels]
	);

	const handleSquareEnter = useCallback(
		(e: React.MouseEvent<HTMLDivElement>, day: GitHubContribution, index: number) => {
			if (isTouchDevice || !wrapperRef.current) return;
			const wrapperRect = wrapperRef.current.getBoundingClientRect();
			const squareRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			const x = squareRect.left + squareRect.width / 2 - wrapperRect.left;

			const row = index % 7;
			const col = Math.floor(index / 7);
			const midCol = Math.floor(actualWeeks / 2);

			const position: 'top' | 'bottom' = row < 3 ? 'bottom' : 'top';
			const align: 'start' | 'center' | 'end' =
				col < midCol ? 'start' : col > midCol ? 'end' : 'center';

			const y = position === 'top'
				? squareRect.top - wrapperRect.top
				: squareRect.bottom - wrapperRect.top;

			setTooltip((prev) => ({
				count: day.count,
				dateLabel: formatDateDisplay(day.date),
				x,
				y,
				position,
				align,
				key: (prev?.key ?? 0) + 1,
			}));
		},
		[actualWeeks]
	);

	const handleSquareLeave = useCallback(() => {
		setTooltip(null);
	}, []);

	return (
		<WidgetBase
			icon={iconRegistry.github}
			platformName="GitHub"
			profileUrl={GITHUB_URL}
			loading={loading}
			error={error}
			skeleton={<GitHubWidgetSkeleton />}
		>
			<StyledWidgetHandle>@{GITHUB_USERNAME}</StyledWidgetHandle>
			<StyledWidgetStat>
				{totalContributions.toLocaleString()} contributions in {CURRENT_YEAR}
			</StyledWidgetStat>

			<StyledCalendarWrapper ref={wrapperRef}>
				{actualWeeks > 0 && (
					<>
						{config.showMonthLabels && monthLabels.length > 0 && (
							<StyledMonthRow $weeks={actualWeeks} $hasDayLabels={config.showDayLabels}>
								{monthLabels.map((label) => (
									<StyledMonthLabel
										key={label.key}
										$startCol={label.startCol}
										$span={label.span}
									>
										{label.name}
									</StyledMonthLabel>
								))}
							</StyledMonthRow>
						)}

						<StyledGridWithLabels>
							{config.showDayLabels && (
								<StyledDayLabels>
									{DAY_LABELS.map((label, i) => (
										<span key={i}>{label}</span>
									))}
								</StyledDayLabels>
							)}

							<StyledContributionGrid
								$weeks={actualWeeks}
								$gap={config.squareGap}
								role="grid"
								aria-readonly="true"
								aria-label={`${totalContributions.toLocaleString()} contributions in ${CURRENT_YEAR}`}
							>
								{gridData.map((day, i) => (
									<StyledSquare
										key={i}
										$level={day.level}
										$radius={config.squareRadius}
										role="gridcell"
										aria-label={ariaLabels[i]}
										tabIndex={-1}
										onMouseEnter={(e) => handleSquareEnter(e, day, i)}
										onMouseLeave={handleSquareLeave}
									/>
								))}
							</StyledContributionGrid>
						</StyledGridWithLabels>

						{tooltip && (
							<StyledTooltipPositioner
								style={{
									left: tooltip.x,
									top: tooltip.y,
									transform: tooltipTransform[tooltip.position][tooltip.align],
								}}
							>
								<StyledContribTooltip
									key={tooltip.key}
									$position={tooltip.position}
									$align={tooltip.align}
								>
									<StyledTooltipDigitGroup>
										{String(tooltip.count)
											.split('')
											.map((digit, i) => (
												<StyledTooltipDigit
													key={`${tooltip.key}-${i}`}
													style={{ animationDelay: `${i * 70}ms` }}
												>
													{digit}
												</StyledTooltipDigit>
											))}
									</StyledTooltipDigitGroup>
									<StyledTooltipText>
										{` contribution${tooltip.count !== 1 ? 's' : ''} on ${tooltip.dateLabel}`}
									</StyledTooltipText>
								</StyledContribTooltip>
							</StyledTooltipPositioner>
						)}
					</>
				)}
			</StyledCalendarWrapper>
		</WidgetBase>
	);
}
