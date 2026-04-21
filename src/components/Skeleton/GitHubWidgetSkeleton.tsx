import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

//? Hooks
import { useBreakpoint } from '../../hooks/useBreakpoint';

//? Config
import { gitHubCalendarConfig } from '../../config/responsive';

//* Shared
import { shimmerSurface } from './shimmer';
import { ShimmerOverlay } from './styled';

// Matches GitHubWidget layout constants
const DAY_LABELS_WIDTH = 30;
const GRID_LABELS_GAP = 4;
const MIN_SQUARE_SIZE = 12;
const MAX_WEEKS = 53;

/**
 * Measures wrapper width and returns how many week-columns fit.
 * Mirrors the GitHubWidget hook so skeleton layout matches the final calendar exactly.
 */
function useAutoWeeks(
	ref: React.RefObject<HTMLDivElement | null>,
	gap: number,
	showDayLabels: boolean
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

			const w = Math.floor((gridWidth + gap) / (MIN_SQUARE_SIZE + gap));
			setWeeks(Math.max(1, Math.min(w, MAX_WEEKS)));
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, [ref, gap, showDayLabels]);

	return weeks;
}

const HandlePlaceholder = styled.span`
	display: block;
	width: 96px;
	height: 10px;
	border-radius: 3px;
	${shimmerSurface}
`;

const StatPlaceholder = styled.span`
	display: block;
	width: 180px;
	height: 10px;
	border-radius: 3px;
	${shimmerSurface}

	&::after {
		animation-delay: 0.12s;
	}
`;

const CalendarWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 2px;
	width: 100%;
	flex: 1;
	min-height: 0;
	contain: layout paint;
`;

const MonthRow = styled.div<{ $weeks: number; $hasDayLabels: boolean }>`
	display: grid;
	grid-template-columns: ${({ $hasDayLabels }) =>
		$hasDayLabels ? 'auto ' : ''}repeat(${({ $weeks }) => $weeks}, 1fr);
	width: 100%;
	height: 10px;
	align-items: center;
`;

const MonthLabelPlaceholder = styled.span<{
	$startCol: number;
	$span: number;
	$delay: number;
}>`
	grid-column: ${({ $startCol }) => $startCol} / span ${({ $span }) => $span};
	height: 8px;
	margin: 0 6px 0 2px;
	border-radius: 2px;
	${shimmerSurface}

	&::after {
		animation-delay: ${({ $delay }) => $delay}s;
	}
`;

const GridWithLabels = styled.div`
	display: flex;
	gap: 4px;
	flex: 1;
	min-height: 0;
`;

const DayLabels = styled.div`
	display: grid;
	grid-template-rows: repeat(7, 1fr);
	align-items: center;
	padding-right: 2px;
	min-width: 26px;
`;

const DayLabelPlaceholder = styled.span<{ $delay: number }>`
	display: block;
	height: 8px;
	width: 22px;
	border-radius: 2px;
	${shimmerSurface}

	&::after {
		animation-delay: ${({ $delay }) => $delay}s;
	}
`;

const ContributionGrid = styled.div<{ $weeks: number; $gap: number }>`
	position: relative;
	display: grid;
	grid-template-rows: repeat(7, auto);
	grid-template-columns: repeat(${({ $weeks }) => $weeks}, 1fr);
	grid-auto-flow: column;
	gap: ${({ $gap }) => $gap}px;
	flex: 1;
	min-width: 0;
	overflow: hidden;
	contain: layout paint;
`;

// Static square — no per-element animation. Shimmer comes from container overlay.
const SquarePlaceholder = styled.div<{ $radius: number }>`
	aspect-ratio: 1;
	width: 100%;
	min-width: 12px;
	min-height: 12px;
	border-radius: ${({ $radius }) => $radius}px;
	border: 1px solid var(--glass-border-start);
	background-color: var(--glass-bg-bold);
`;

function GitHubWidgetSkeleton() {
	const bp = useBreakpoint();
	const config = gitHubCalendarConfig[bp];

	const wrapperRef = useRef<HTMLDivElement>(null);
	const weeks = useAutoWeeks(wrapperRef, config.squareGap, config.showDayLabels);

	const monthLabels = useMemo(() => {
		if (!config.showMonthLabels || weeks === 0) return [];
		const colOffset = config.showDayLabels ? 2 : 1;
		const monthCount = Math.max(2, Math.min(5, Math.round(weeks / 4.3)));
		const widthPerMonth = Math.floor(weeks / monthCount);
		return Array.from({ length: monthCount }, (_, i) => ({
			key: `m-${i}`,
			startCol: colOffset + i * widthPerMonth,
			span: Math.max(2, widthPerMonth - 1),
			delay: i * 0.08,
		}));
	}, [weeks, config.showMonthLabels, config.showDayLabels]);

	const squares = useMemo(
		() => Array.from({ length: weeks * 7 }, (_, i) => i),
		[weeks]
	);

	return (
		<div
			role="status"
			aria-live="polite"
			aria-busy="true"
			aria-label="Cargando actividad de GitHub"
			style={{ display: 'contents' }}
		>
			<HandlePlaceholder aria-hidden="true" />
			<StatPlaceholder aria-hidden="true" />

			<CalendarWrapper ref={wrapperRef} aria-hidden="true">
				{weeks > 0 && (
					<>
						{config.showMonthLabels && monthLabels.length > 0 && (
							<MonthRow $weeks={weeks} $hasDayLabels={config.showDayLabels}>
								{monthLabels.map((l) => (
									<MonthLabelPlaceholder
										key={l.key}
										$startCol={l.startCol}
										$span={l.span}
										$delay={l.delay}
									/>
								))}
							</MonthRow>
						)}

						<GridWithLabels>
							{config.showDayLabels && (
								<DayLabels>
									<span />
									<DayLabelPlaceholder $delay={0.05} />
									<span />
									<DayLabelPlaceholder $delay={0.15} />
									<span />
									<DayLabelPlaceholder $delay={0.25} />
									<span />
								</DayLabels>
							)}

							<ContributionGrid $weeks={weeks} $gap={config.squareGap}>
								{squares.map((i) => (
									<SquarePlaceholder key={i} $radius={config.squareRadius} />
								))}
								<ShimmerOverlay $angle={110} $duration={1.8} />
							</ContributionGrid>
						</GridWithLabels>
					</>
				)}
			</CalendarWrapper>
		</div>
	);
}

export default GitHubWidgetSkeleton;
