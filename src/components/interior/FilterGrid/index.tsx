//! React
import { useLayoutEffect, useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';
import { Flip } from 'gsap/Flip';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useFilterGrid, type FilterDefinition } from './useFilterGrid';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledFilterRoot,
	StyledFilterBar,
	StyledFilterChip,
	StyledFilterCount,
	StyledFilterViewport,
	StyledFilterGrid,
	StyledFilterCell,
	StyledFilterEmpty,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

gsap.registerPlugin(Flip);

export type FilterGridProps<T> = {
	items: readonly T[];
	filters: readonly FilterDefinition<T>[];
	getKey: (item: T) => string;
	renderItem: (item: T) => ReactNode;
	label: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (id: string) => void;
	columns?: number;
	rowHeight?: number;
	maxRows?: number;
	gap?: number;
	emptyLabel?: string;
};

function FilterGrid<T>({
	items,
	filters,
	getKey,
	renderItem,
	label,
	value,
	defaultValue,
	onValueChange,
	columns = 3,
	rowHeight = 64,
	maxRows = 3,
	gap = 8,
	emptyLabel = 'Nothing here',
}: FilterGridProps<T>) {
	const { active, activeLabel, select, visible, counts, total } = useFilterGrid({
		items,
		filters,
		value,
		defaultValue,
		onValueChange,
	});

	const prefersReducedMotion = usePrefersReducedMotion();
	const gridRef = useRef<HTMLDivElement>(null);
	const emptyRef = useRef<HTMLDivElement>(null);
	const flipState = useRef<Flip.FlipState | null>(null);

	// Capture positions before React commits the new list, so the surviving
	// cells can be animated from where they actually were.
	useLayoutEffect(() => {
		const grid = gridRef.current;
		if (!grid || prefersReducedMotion) return;
		flipState.current = Flip.getState(grid.querySelectorAll('[data-filter-cell]'));
	});

	useGSAP(() => {
		const grid = gridRef.current;
		const state = flipState.current;
		if (!grid || !state || prefersReducedMotion) return;

		const move = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		const cell = motionSafe(SPRINGS.cell, prefersReducedMotion);

		Flip.from(state, {
			duration: move.duration,
			ease: move.ease,
			// Taking survivors out of flow means the ones that stay do not shove
			// each other around while the entering and leaving cells resolve.
			absolute: true,
			onEnter: (elements) =>
				gsap.fromTo(
					elements,
					{ opacity: 0, scale: 0.94 },
					{ opacity: 1, scale: 1, duration: cell.duration, ease: cell.ease },
				),
			onLeave: (elements) =>
				gsap.to(elements, { opacity: 0, scale: 0.94, duration: 0.14, ease: 'power2.in' }),
		});
	}, [visible, prefersReducedMotion]);

	useGSAP(() => {
		const node = emptyRef.current;
		if (!node) return;
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		gsap.to(node, {
			opacity: visible.length === 0 ? 1 : 0,
			duration: fade.duration,
			ease: fade.ease,
		});
	}, [visible.length, prefersReducedMotion]);

	return (
		<StyledFilterRoot>
			<StyledFilterBar role="group" aria-label={label}>
				{filters.map((filter) => {
					const isActive = filter.id === active;
					return (
						<StyledFilterChip
							key={filter.id}
							type="button"
							aria-pressed={isActive}
							onClick={() => select(filter.id)}
							$active={isActive}
							$empty={counts[filter.id] === 0}
						>
							{filter.label}
							<StyledFilterCount>{counts[filter.id]}</StyledFilterCount>
						</StyledFilterChip>
					);
				})}
			</StyledFilterBar>

			<StyledFilterViewport $height={rowHeight * maxRows + gap * (maxRows - 1)}>
				<StyledFilterGrid ref={gridRef} $columns={columns} $gap={gap}>
					{visible.map((item) => (
						<StyledFilterCell key={getKey(item)} data-filter-cell $height={rowHeight}>
							{renderItem(item)}
						</StyledFilterCell>
					))}
				</StyledFilterGrid>

				<StyledFilterEmpty ref={emptyRef} aria-hidden="true">
					<span>{emptyLabel}</span>
				</StyledFilterEmpty>
			</StyledFilterViewport>

			<StyledVisuallyHidden role="status" aria-live="polite">
				{`${activeLabel}: showing ${visible.length} of ${total}`}
			</StyledVisuallyHidden>
		</StyledFilterRoot>
	);
}

export default FilterGrid;
