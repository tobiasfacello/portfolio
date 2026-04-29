import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
	StyledLegend,
	StyledLegendSwatchRow,
	StyledLegendSwatch,
	StyledFooterLabel,
	StyledTotalLabel,
} from './styled';
import { useTooltipSwap } from '../shared/digitPop';
import DigitGroup from '../shared/DigitGroup';
import { StyledWidgetHandle } from '../WidgetBase/styled';

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
			const next = Math.max(1, Math.min(maxFromContainer, maxFromData));
			setWeeks((prev) => (prev === next ? prev : next));
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

function formatDateDisplay(dateStr: string): { monthDay: string; year: string } {
	const date = new Date(dateStr + 'T00:00:00');
	return {
		monthDay: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
		year: date.toLocaleDateString('en-US', { year: 'numeric' }),
	};
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

interface TooltipPlacement {
	x: number;
	y: number;
	position: 'top' | 'bottom';
	align: 'start' | 'center' | 'end';
}

const TOOLTIP_CLOSE_DUR = 150;

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

const LEGEND_LEVELS = [0, 1, 2, 3, 4] as const;

export default function GitHubWidget() {
	const { t } = useTranslation('home');

	const {
		contributions,
		totalContributions,
		loading,
		error,
	} = useGitHubActivity();

	const bp = useBreakpoint();
	const config = gitHubCalendarConfig[bp];

	// Single mounted tooltip. The connector text (" contributions on ", ", ")
	// stays static; each dynamic field — count, month/day, and year — runs
	// its own three-phase swap so a hover only animates the parts whose value
	// actually changed (year only flips when crossing into a new year).
	const [placement, setPlacement] = useState<TooltipPlacement | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const countSwap = useTooltipSwap<number>();
	const monthDaySwap = useTooltipSwap<string>();
	const yearSwap = useTooltipSwap<string>();

	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isOpenRef = useRef(false);

	useEffect(() => {
		return () => {
			if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
		};
	}, []);

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

			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
				closeTimeoutRef.current = null;
			}

			const newCount = day.count;
			const { monthDay: newMonthDay, year: newYear } = formatDateDisplay(day.date);
			const newPlacement: TooltipPlacement = { x, y, position, align };

			// Position update — CSS transition on the positioner smooths the move.
			setPlacement(newPlacement);

			const prevCount = countSwap.valueRef.current;
			const prevMonthDay = monthDaySwap.valueRef.current;
			const prevYear = yearSwap.valueRef.current;
			const wasOpen = isOpenRef.current;

			// Each dynamic field updates independently — only the changed value
			// pops in (its <StyledDigitGroup> remounts via key). The year usually
			// stays the same within a calendar year, so it only animates when
			// crossing into a new one.
			if (prevCount !== newCount) countSwap.setValue(newCount);
			if (prevMonthDay !== newMonthDay) monthDaySwap.setValue(newMonthDay);
			if (prevYear !== newYear) yearSwap.setValue(newYear);

			if (!wasOpen) {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setIsOpen(true);
						isOpenRef.current = true;
					});
				});
			}
		},
		[actualWeeks, countSwap, monthDaySwap, yearSwap]
	);

	const handleSquareLeave = useCallback(() => {
		setIsOpen(false);
		isOpenRef.current = false;
		if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
		closeTimeoutRef.current = setTimeout(() => {
			setPlacement(null);
			countSwap.setValue(null);
			monthDaySwap.setValue(null);
			yearSwap.setValue(null);
			closeTimeoutRef.current = null;
		}, TOOLTIP_CLOSE_DUR);
	}, [countSwap, monthDaySwap, yearSwap]);

	return (
		<WidgetBase
			icon={iconRegistry.github}
			platformName="GitHub"
			profileUrl={GITHUB_URL}
			loading={loading}
			error={error}
			skeleton={<GitHubWidgetSkeleton />}
			footer={
				<>
					<StyledLegend aria-hidden="true">
						<StyledFooterLabel>{t('activity.github.legendLess')}</StyledFooterLabel>
						<StyledLegendSwatchRow>
							{LEGEND_LEVELS.map((level) => (
								<StyledLegendSwatch key={level} $level={level} />
							))}
						</StyledLegendSwatchRow>
						<StyledFooterLabel>{t('activity.github.legendMore')}</StyledFooterLabel>
					</StyledLegend>
					<StyledTotalLabel>
						{t('activity.github.totalThisYear', {
							total: totalContributions.toLocaleString(),
						})}
					</StyledTotalLabel>
				</>
			}
		>
			<StyledWidgetHandle>@{GITHUB_USERNAME}</StyledWidgetHandle>

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
								role="img"
								aria-label={`${totalContributions.toLocaleString()} contributions in ${CURRENT_YEAR}`}
								onMouseLeave={handleSquareLeave}
							>
								{gridData.map((day, i) => (
									<StyledSquare
										key={i}
										$level={day.level}
										$radius={config.squareRadius}
										aria-hidden="true"
										onMouseEnter={(e) => handleSquareEnter(e, day, i)}
										title={ariaLabels[i]}
									/>
								))}
							</StyledContributionGrid>
						</StyledGridWithLabels>

						{placement && (
							<StyledTooltipPositioner
								style={{
									left: placement.x,
									top: placement.y,
									transform: tooltipTransform[placement.position][placement.align],
								}}
							>
								<StyledContribTooltip
									$position={placement.position}
									$align={placement.align}
									$visible={isOpen}
								>
									<DigitGroup
										key={`count-${countSwap.displayed ?? ''}`}
										value={countSwap.displayed}
									/>
									{' contributions on '}
									<DigitGroup
										key={`md-${monthDaySwap.displayed ?? ''}`}
										value={monthDaySwap.displayed}
									/>
									{', '}
									<DigitGroup
										key={`year-${yearSwap.displayed ?? ''}`}
										value={yearSwap.displayed}
									/>
								</StyledContribTooltip>
							</StyledTooltipPositioner>
						)}
					</>
				)}
			</StyledCalendarWrapper>
		</WidgetBase>
	);
}
