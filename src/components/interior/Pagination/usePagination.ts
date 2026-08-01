import { useCallback, useEffect, useRef, useState } from 'react';

export type PaginationItem = number | 'gap-l' | 'gap-r';

const range = (from: number, to: number) =>
	Array.from({ length: to - from + 1 }, (_, i) => from + i);

/**
 * Builds the page list, with ellipses where pages are skipped.
 *
 * The window is a fixed width in every arrangement, so the control does not
 * change size as the page moves — the ellipsis appears exactly when it saves
 * space, never when it would leave a gap narrower than the pages it replaced.
 */
export function paginate(
	page: number,
	count: number,
	siblings: number,
	boundaries: number,
): PaginationItem[] {
	const total = 2 * boundaries + 2 * siblings + 3;
	if (count <= total) return range(1, count);

	const nearStart = page < boundaries + siblings + 2;
	const nearEnd = page > count - boundaries - siblings - 1;

	if (nearStart) {
		return [...range(1, 2 * siblings + boundaries + 2), 'gap-r', ...range(count - boundaries + 1, count)];
	}
	if (nearEnd) {
		return [...range(1, boundaries), 'gap-l', ...range(count - 2 * siblings - boundaries - 1, count)];
	}
	return [
		...range(1, boundaries),
		'gap-l',
		...range(page - siblings, page + siblings),
		'gap-r',
		...range(count - boundaries + 1, count),
	];
}

export type UsePaginationOptions = {
	count: number;
	page?: number;
	defaultPage?: number;
	/** Pages shown either side of the current one. */
	siblings?: number;
	/** Pages always shown at each end. */
	boundaries?: number;
	onPageChange?: (page: number) => void;
};

export function usePagination({
	count,
	page,
	defaultPage = 1,
	siblings = 1,
	boundaries = 1,
	onPageChange,
}: UsePaginationOptions) {
	const clampTo = useCallback(
		(value: number) => Math.min(Math.max(1, value), Math.max(1, count)),
		[count],
	);

	const [internal, setInternal] = useState(() => clampTo(defaultPage));
	const controlled = page !== undefined;
	const current = clampTo(controlled ? page : internal);

	const emit = useRef(onPageChange);
	emit.current = onPageChange;

	// Which way the page moved, so the digits can enter from that side.
	const previous = useRef(current);
	const direction = current >= previous.current ? 1 : -1;
	useEffect(() => {
		previous.current = current;
	}, [current]);

	const goTo = useCallback(
		(value: number) => {
			const next = clampTo(value);
			if (next === previous.current) return;
			if (!controlled) setInternal(next);
			emit.current?.(next);
		},
		[clampTo, controlled],
	);

	const items = paginate(current, count, siblings, boundaries);

	return {
		page: current,
		count,
		items,
		direction,
		thumbIndex: items.indexOf(current),
		canPrev: current > 1,
		canNext: current < count,
		goTo,
		prev: () => goTo(current - 1),
		next: () => goTo(current + 1),
	};
}
