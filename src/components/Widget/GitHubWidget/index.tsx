import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

//* Styled
import {
	StyledGitHubCard,
	StyledCardInner,
	StyledContributionHeader,
	StyledGitHubHeaderLeft,
	StyledGitHubIcon,
	StyledContribCount,
	StyledCalendarWrapper,
	StyledMonthRow,
	StyledMonthLabel,
	StyledGridWithLabels,
	StyledDayLabels,
	StyledContributionGrid,
	StyledSquare,
	StyledContribTooltip,
	StyledHandle,
	StyledSkeleton,
	StyledSkeletonLine,
	StyledSkeletonGrid,
} from './styled';

//* Components
import Text from '../../Text';
import Button from '../../Button';

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
	text: string;
	x: number;
	y: number;
	position: 'top' | 'bottom';
	align: 'start' | 'center' | 'end';
}

const isTouchDevice =
	typeof window !== 'undefined' &&
	window.matchMedia('(hover: none) and (pointer: coarse)').matches;

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

	const [tooltip, setTooltip] = useState<TooltipState | null>(null);

	const wrapperRef = useRef<HTMLDivElement>(null);

	const maxWeeks = useAutoWeeks(
		wrapperRef,
		config.squareGap,
		config.showDayLabels,
		contributions.length
	);

	const year = new Date().getFullYear();

	const gridData = useMemo(
		() => (maxWeeks > 0 ? sliceLastWeeks(contributions, maxWeeks) : []),
		[contributions, maxWeeks]
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

			const text = `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDateDisplay(day.date)}`;
			setTooltip({ text, x, y, position, align });
		},
		[actualWeeks]
	);

	const handleSquareLeave = useCallback(() => {
		setTooltip(null);
	}, []);

	if (loading) {
		return (
			<StyledGitHubCard className="widget-card">
				<StyledSkeleton>
					<StyledSkeletonLine $w="55%" $h="18px" />
					<StyledSkeletonGrid />
				</StyledSkeleton>
			</StyledGitHubCard>
		);
	}

	if (error) {
		return (
			<StyledGitHubCard className="widget-card">
				<StyledCardInner>
					<StyledContributionHeader>
						<StyledGitHubHeaderLeft>
							<StyledGitHubIcon>
								<iconRegistry.github />
							</StyledGitHubIcon>
							<Text as="h3" variant="subtitle-sm">
								<a
									href={GITHUB_URL}
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: 'inherit', textDecoration: 'none' }}
								>
									GitHub
								</a>
							</Text>
						</StyledGitHubHeaderLeft>
					</StyledContributionHeader>
				</StyledCardInner>
			</StyledGitHubCard>
		);
	}

	return (
		<StyledGitHubCard className="widget-card">
			<StyledCardInner>
				<StyledContributionHeader>
					<StyledGitHubHeaderLeft>
						<StyledGitHubIcon>
							<iconRegistry.github />
						</StyledGitHubIcon>
						<Text as="h3" variant="subtitle-sm">GitHub</Text>
					</StyledGitHubHeaderLeft>
					<Button
						variant="glass"
						title={t('activity.viewProfile')}
						url={GITHUB_URL}
						p={['4', '8', '4', '8']}
					/>
				</StyledContributionHeader>

				<StyledHandle>@{GITHUB_USERNAME}</StyledHandle>
				<StyledContribCount>
					{totalContributions.toLocaleString()} contributions in {year}
				</StyledContribCount>

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
									aria-label={`${totalContributions.toLocaleString()} contributions in ${year}`}
								>
									{gridData.map((day, i) => (
										<StyledSquare
											key={i}
											$level={day.level}
											$radius={config.squareRadius}
											role="gridcell"
											aria-label={`${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDateForA11y(day.date)}`}
											tabIndex={-1}
											onMouseEnter={(e) => handleSquareEnter(e, day, i)}
											onMouseLeave={handleSquareLeave}
										/>
									))}
								</StyledContributionGrid>
							</StyledGridWithLabels>

							{tooltip && (
								<StyledContribTooltip
									$x={tooltip.x}
									$y={tooltip.y}
									$position={tooltip.position}
									$align={tooltip.align}
								>
									{tooltip.text}
								</StyledContribTooltip>
							)}
						</>
					)}
				</StyledCalendarWrapper>
			</StyledCardInner>
		</StyledGitHubCard>
	);
}
