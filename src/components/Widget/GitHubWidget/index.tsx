import { memo, useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
import { useBreakpointValue } from '../../../hooks/useBreakpoint';

//? Config
import { gitHubCalendarConfig } from '../../../config/responsive';

//? Data
import { GITHUB_URL, GITHUB_USERNAME } from '../../../data/socialFeed';

import type { GitHubContribution } from '../../../types';

// Calendar labels follow the page language. Short forms drop the dot some
// locales add ("nov.") so they stay as compact as GitHub's.
function shortLabel(lang: string, options: Intl.DateTimeFormatOptions, date: Date): string {
	return new Intl.DateTimeFormat(lang, options).format(date).replace('.', '');
}

// Sunday-first week (2023-01-01 was a Sunday); only Mon, Wed and Fri are labeled.
function dayLabels(lang: string): string[] {
	return [0, 1, 2, 3, 4, 5, 6].map((d) =>
		d % 2 === 1 ? shortLabel(lang, { weekday: 'short' }, new Date(2023, 0, 1 + d)) : ''
	);
}

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
	hasDayLabels: boolean,
	lang: string
): MonthLabel[] {
	const monthName = (month: number) => shortLabel(lang, { month: 'short' }, new Date(2023, month, 1));
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
					name: monthName(currentMonth),
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
			name: monthName(currentMonth),
			startCol,
			span,
		});
	}

	return labels.filter((l) => l.span >= 2);
}

function formatDateDisplay(dateStr: string, lang: string): { monthDay: string; year: string } {
	const date = new Date(dateStr + 'T00:00:00');
	return {
		monthDay: date.toLocaleDateString(lang, { month: 'short', day: 'numeric' }),
		year: date.toLocaleDateString(lang, { year: 'numeric' }),
	};
}

function formatDateForA11y(dateStr: string, lang: string): string {
	const date = new Date(dateStr + 'T00:00:00');
	return date.toLocaleDateString(lang, {
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


const LEGEND_LEVELS = [0, 1, 2, 3, 4] as const;
interface ContributionGridProps {
	gridData: GitHubContribution[];
	ariaLabels: string[];
	weeks: number;
	gap: number;
	radius: number;
	ariaLabel: string;
	onSquareEnter: (square: HTMLElement, index: number) => void;
	onLeave: () => void;
}

// Memoized so hovering — which only updates tooltip state — never re-renders the
// ~365 squares. Hover is delegated to the grid: one listener instead of a fresh
// closure per square on every render.
const ContributionGrid = memo(function ContributionGrid({
	gridData,
	ariaLabels,
	weeks,
	gap,
	radius,
	ariaLabel,
	onSquareEnter,
	onLeave,
}: ContributionGridProps) {
	const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
		const square = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
		if (square) onSquareEnter(square, Number(square.dataset.index));
	};

	return (
		<StyledContributionGrid
			$weeks={weeks}
			$gap={gap}
			role="img"
			aria-label={ariaLabel}
			onMouseOver={handleMouseOver}
			onMouseLeave={onLeave}
		>
			<ContributionSquares gridData={gridData} ariaLabels={ariaLabels} radius={radius} />
		</StyledContributionGrid>
	);
});

interface ContributionSquaresProps {
	gridData: GitHubContribution[];
	ariaLabels: string[];
	radius: number;
}

// The squares only depend on the data and the corner radius, so a breakpoint
// change that only moves the gap (desktop-sm ↔ desktop-lg) re-renders the grid
// container, not its 150–365 squares.
const ContributionSquares = memo(function ContributionSquares({ gridData, ariaLabels, radius }: ContributionSquaresProps) {
	return gridData.map((day, i) => (
		<StyledSquare
			key={i}
			data-index={i}
			$level={day.level}
			$radius={radius}
			aria-hidden="true"
			title={ariaLabels[i]}
		/>
	));
});

interface ContributionCalendarProps {
	contributions: GitHubContribution[];
	totalContributions: number;
}

// Owns the hover tooltip state, so a hover re-renders this calendar only —
// not WidgetBase's header/footer.
function ContributionCalendar({ contributions, totalContributions }: ContributionCalendarProps) {
	const config = useBreakpointValue((bp) => gitHubCalendarConfig[bp]);
	const { t, i18n } = useTranslation('home');
	const lang = i18n.language;

	// Single mounted tooltip. The connector text (" contributions on ", ", ")
	// stays static; each dynamic field — count, month/day, and year — runs
	// its own three-phase swap so a hover only animates the parts whose value
	// actually changed (year only flips when crossing into a new year).
	const [placement, setPlacement] = useState<TooltipPlacement | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const { displayed: countDisplayed, setValue: setCount, valueRef: countRef } = useTooltipSwap<number>();
	const { displayed: monthDayDisplayed, setValue: setMonthDay, valueRef: monthDayRef } = useTooltipSwap<string>();
	const { displayed: yearDisplayed, setValue: setYear, valueRef: yearRef } = useTooltipSwap<string>();

	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isOpenRef = useRef(false);
	const hoveredIndexRef = useRef<number | null>(null);

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
		() => gridData.map((day) =>
			t('activity.github.dayContributions', { count: day.count, date: formatDateForA11y(day.date, lang) })
		),
		[gridData, lang, t]
	);

	const weekdayLabels = useMemo(() => dayLabels(lang), [lang]);

	const actualWeeks = Math.ceil(gridData.length / 7);

	const monthLabels = useMemo(
		() =>
			config.showMonthLabels && actualWeeks > 0
				? computeMonthLabels(gridData, actualWeeks, config.showDayLabels, lang)
				: [],
		[gridData, actualWeeks, config.showMonthLabels, config.showDayLabels, lang]
	);

	const handleSquareEnter = useCallback(
		(square: HTMLElement, index: number) => {
			if (isTouchDevice || !wrapperRef.current) return;
			const day = gridData[index];
			if (!day || index === hoveredIndexRef.current) return;
			hoveredIndexRef.current = index;

			const wrapperRect = wrapperRef.current.getBoundingClientRect();
			const squareRect = square.getBoundingClientRect();
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
			const { monthDay: newMonthDay, year: newYear } = formatDateDisplay(day.date, lang);

			// Position update — CSS transition on the positioner smooths the move.
			setPlacement({ x, y, position, align });

			// Each dynamic field updates independently — only the changed value
			// pops in (its <StyledDigitGroup> remounts via key). The year usually
			// stays the same within a calendar year, so it only animates when
			// crossing into a new one.
			if (countRef.current !== newCount) setCount(newCount);
			if (monthDayRef.current !== newMonthDay) setMonthDay(newMonthDay);
			if (yearRef.current !== newYear) setYear(newYear);

			if (!isOpenRef.current) {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setIsOpen(true);
						isOpenRef.current = true;
					});
				});
			}
		},
		[gridData, actualWeeks, lang, countRef, monthDayRef, yearRef, setCount, setMonthDay, setYear]
	);

	const handleSquareLeave = useCallback(() => {
		hoveredIndexRef.current = null;
		setIsOpen(false);
		isOpenRef.current = false;
		if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
		closeTimeoutRef.current = setTimeout(() => {
			setPlacement(null);
			setCount(null);
			setMonthDay(null);
			setYear(null);
			closeTimeoutRef.current = null;
		}, TOOLTIP_CLOSE_DUR);
	}, [setCount, setMonthDay, setYear]);

	return (
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
								{weekdayLabels.map((label, i) => (
									<span key={i}>{label}</span>
								))}
							</StyledDayLabels>
						)}

						<ContributionGrid
							gridData={gridData}
							ariaLabels={ariaLabels}
							weeks={actualWeeks}
							gap={config.squareGap}
							radius={config.squareRadius}
							ariaLabel={t('activity.github.totalLastYear', { total: totalContributions.toLocaleString(lang) })}
							onSquareEnter={handleSquareEnter}
							onLeave={handleSquareLeave}
						/>
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
									key={`count-${countDisplayed ?? ''}`}
									value={countDisplayed}
								/>
								{` ${t('activity.github.contributionsOn', { count: countDisplayed ?? 0 })} `}
								<DigitGroup
									key={`md-${monthDayDisplayed ?? ''}`}
									value={monthDayDisplayed}
								/>
								{', '}
								<DigitGroup
									key={`year-${yearDisplayed ?? ''}`}
									value={yearDisplayed}
								/>
							</StyledContribTooltip>
						</StyledTooltipPositioner>
					)}
				</>
			)}
		</StyledCalendarWrapper>
	);
}

export default function GitHubWidget() {
	const { t, i18n } = useTranslation('home');

	const {
		contributions,
		totalContributions,
		loading,
		error,
	} = useGitHubActivity();

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
						{t('activity.github.totalLastYear', {
							total: totalContributions.toLocaleString(i18n.language),
						})}
					</StyledTotalLabel>
				</>
			}
		>
			<StyledWidgetHandle>@{GITHUB_USERNAME}</StyledWidgetHandle>

			<ContributionCalendar
				contributions={contributions}
				totalContributions={totalContributions}
			/>
		</WidgetBase>
	);
}
