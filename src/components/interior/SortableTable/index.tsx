//! React
import { useCallback, useLayoutEffect, useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';
import { Flip } from 'gsap/Flip';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useSortableRows, type SortState } from './useSortableRows';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledTableShell,
	StyledTable,
	StyledTableHead,
	StyledHeaderCell,
	StyledSortButton,
	StyledPlainHeader,
	StyledSortCaret,
	StyledTableRow,
	StyledTableCell,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

gsap.registerPlugin(Flip);

export type SortableColumn<T> = {
	id: string;
	header: string;
	width?: string;
	align?: 'start' | 'end';
	numeric?: boolean;
	sortable?: boolean;
	value?: (row: T) => string | number | null | undefined;
	cell?: (row: T) => ReactNode;
};

export type SortableTableProps<T> = {
	rows: T[];
	columns: SortableColumn<T>[];
	getRowId: (row: T) => string;
	label: string;
	maxHeight?: number;
	sort?: SortState | null;
	defaultSort?: SortState | null;
	onSortChange?: (next: SortState | null) => void;
};

function SortableTable<T>({
	rows,
	columns,
	getRowId,
	label,
	maxHeight,
	sort,
	defaultSort = null,
	onSortChange,
}: SortableTableProps<T>) {
	const prefersReducedMotion = usePrefersReducedMotion();

	const getValue = useCallback(
		(row: T, columnId: string) => {
			const column = columns.find((c) => c.id === columnId);
			return column?.value?.(row);
		},
		[columns],
	);

	const {
		sort: current,
		ordered,
		toggle,
		ariaSort,
	} = useSortableRows({ rows, getRowId, getValue, sort, defaultSort, onSortChange });

	const bodyRef = useRef<HTMLTableSectionElement>(null);
	const caretsRef = useRef<Record<string, SVGSVGElement | null>>({});
	const flipState = useRef<Flip.FlipState | null>(null);

	// Rows are reordered by React; FLIP animates them from where they were, so
	// a sort reads as the rows travelling rather than the table redrawing.
	useLayoutEffect(() => {
		const body = bodyRef.current;
		if (!body || prefersReducedMotion) return;
		flipState.current = Flip.getState(body.querySelectorAll('tr'));
	});

	useGSAP(() => {
		const state = flipState.current;
		if (!state || prefersReducedMotion) return;

		const move = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		Flip.from(state, { duration: move.duration, ease: move.ease });
	}, [ordered, prefersReducedMotion]);

	useGSAP(() => {
		const small = motionSafe(SPRINGS.snap, prefersReducedMotion);
		columns.forEach((column) => {
			const node = caretsRef.current[column.id];
			if (!node) return;
			const active = current?.columnId === column.id;
			gsap.to(node, {
				opacity: active ? 1 : 0,
				rotate: active && current?.direction === 'desc' ? 180 : 0,
				duration: small.duration,
				ease: small.ease,
			});
		});
	}, [current, columns, prefersReducedMotion]);

	return (
		<StyledTableShell $maxHeight={maxHeight}>
			<StyledTable>
				<caption>
					<StyledVisuallyHidden>{label}</StyledVisuallyHidden>
				</caption>

				<colgroup>
					{columns.map((column) => (
						<col key={column.id} style={{ width: column.width }} />
					))}
				</colgroup>

				<StyledTableHead>
					<tr>
						{columns.map((column) => {
							const align = column.align ?? (column.numeric ? 'end' : 'start');
							const sortable = column.sortable !== false && Boolean(column.value);

							return (
								<StyledHeaderCell
									key={column.id}
									scope="col"
									aria-sort={sortable ? ariaSort(column.id) : undefined}
									$align={align}
								>
									{sortable ? (
										<StyledSortButton
											type="button"
											onClick={() => toggle(column.id)}
											$align={align}
											$active={current?.columnId === column.id}
										>
											{column.header}
											<StyledSortCaret
												ref={(node) => {
													caretsRef.current[column.id] = node;
												}}
												width="10"
												height="10"
												viewBox="0 0 12 12"
												fill="none"
												aria-hidden="true"
											>
												<path
													d="M3 4.5 6 7.5 9 4.5"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</StyledSortCaret>
										</StyledSortButton>
									) : (
										<StyledPlainHeader $align={align}>{column.header}</StyledPlainHeader>
									)}
								</StyledHeaderCell>
							);
						})}
					</tr>
				</StyledTableHead>

				<tbody ref={bodyRef}>
					{ordered.map(({ id, row }) => (
						<StyledTableRow key={id}>
							{columns.map((column) => {
								const align = column.align ?? (column.numeric ? 'end' : 'start');
								return (
									<StyledTableCell key={column.id} $align={align} $numeric={column.numeric}>
										{column.cell ? column.cell(row) : String(column.value?.(row) ?? '')}
									</StyledTableCell>
								);
							})}
						</StyledTableRow>
					))}
				</tbody>
			</StyledTable>
		</StyledTableShell>
	);
}

export default SortableTable;
