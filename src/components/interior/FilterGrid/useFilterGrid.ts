import { useCallback, useMemo, useRef, useState } from 'react';

export type FilterDefinition<T> = {
	id: string;
	label: string;
	match: (item: T) => boolean;
};

export type UseFilterGridOptions<T> = {
	items: readonly T[];
	filters: readonly FilterDefinition<T>[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (id: string) => void;
};

/**
 * Applies one filter at a time and counts every option up front.
 *
 * The counts are computed for all filters, not just the active one, so a tab
 * that would show nothing can say so before it is pressed — nobody has to click
 * into an empty result to find out it is empty.
 */
export function useFilterGrid<T>({
	items,
	filters,
	value,
	defaultValue,
	onValueChange,
}: UseFilterGridOptions<T>) {
	const fallback = filters[0]?.id ?? '';
	const [internal, setInternal] = useState(() => defaultValue ?? fallback);

	const requested = value ?? internal;
	// A filter that no longer exists falls back rather than showing nothing.
	const current = filters.find((f) => f.id === requested) ?? filters[0];
	const active = current?.id ?? fallback;

	const emit = useRef(onValueChange);
	emit.current = onValueChange;

	const counts = useMemo(() => {
		const next: Record<string, number> = {};
		for (const filter of filters) {
			let n = 0;
			for (const item of items) if (filter.match(item)) n += 1;
			next[filter.id] = n;
		}
		return next;
	}, [filters, items]);

	const visible = useMemo(() => {
		const filter = filters.find((f) => f.id === active);
		if (!filter) return [...items];
		return items.filter((item) => filter.match(item));
	}, [filters, items, active]);

	const select = useCallback(
		(id: string) => {
			if (value === undefined) setInternal(id);
			if (id !== active) emit.current?.(id);
		},
		[value, active],
	);

	return {
		active,
		activeLabel: current?.label ?? '',
		select,
		visible,
		counts,
		total: items.length,
	};
}
