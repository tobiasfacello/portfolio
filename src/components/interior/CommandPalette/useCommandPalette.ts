import { useEffect, useMemo, useRef, useState } from 'react';

/** Characters that mark the start of a word for scoring purposes. */
const BOUNDARY = /[\s\-_/.:]/;
const PAD = 5;

export type CommandItem = {
	id: string;
	label: string;
	hint?: string;
	/** Extra terms this command should match, scored slightly lower. */
	keywords?: string;
	shortcut?: string[];
};

export type UseCommandPaletteOptions = {
	items: CommandItem[];
	onSelect: (item: CommandItem) => void;
	onDismiss?: () => void;
};

/**
 * Subsequence match with positional bonuses.
 *
 * Consecutive hits build a streak, matches at the start of the string or after
 * a word boundary score higher, and a missing character disqualifies outright.
 * That is what makes "gtd" find "Go to definition" and rank it above an
 * incidental match buried mid-word.
 */
function scoreOne(text: string, query: string): number {
	const t = text.toLowerCase();
	let cursor = 0;
	let total = 0;
	let streak = 0;

	for (let i = 0; i < query.length; i++) {
		const at = t.indexOf(query[i], cursor);
		if (at < 0) return -1;
		streak = at === cursor && i > 0 ? streak + 1 : 0;
		total += 2 + streak * 4;
		if (at === 0) total += 12;
		else if (BOUNDARY.test(t[at - 1])) total += 8;
		cursor = at + 1;
	}

	return total;
}

function rank(items: CommandItem[], query: string): CommandItem[] {
	const q = query.trim().toLowerCase();
	if (!q) return items;

	const scored: { item: CommandItem; score: number; order: number }[] = [];

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const direct = scoreOne(item.label, q);
		// Keyword hits count, but a match on the visible label wins a tie.
		const aliased = item.keywords ? scoreOne(item.keywords, q) - 3 : -1;
		const best = Math.max(direct, item.keywords ? aliased : -1);
		if (best < 0) continue;
		// Shorter labels edge ahead: the same match in less text is a better one.
		scored.push({ item, score: best - item.label.length * 0.05, order: i });
	}

	scored.sort((a, b) => b.score - a.score || a.order - b.order);
	return scored.map((s) => s.item);
}

export function useCommandPalette({ items, onSelect, onDismiss }: UseCommandPaletteOptions) {
	const [query, setQuery] = useState('');
	const [pinned, setPinned] = useState<string | null>(null);

	const listRef = useRef<HTMLUListElement>(null);
	const pointer = useRef({ x: -1, y: -1 });

	const select = useRef(onSelect);
	select.current = onSelect;
	const dismiss = useRef(onDismiss);
	dismiss.current = onDismiss;

	const results = useMemo(() => rank(items, query), [items, query]);

	// The pinned row survives typing only while it is still in the results;
	// otherwise the top match takes over.
	const activeId = results.some((r) => r.id === pinned) ? pinned : (results[0]?.id ?? null);
	const activeIndex = results.findIndex((r) => r.id === activeId);

	useEffect(() => {
		if (listRef.current) listRef.current.scrollTop = 0;
	}, [query]);

	const reveal = (index: number) => {
		const list = listRef.current;
		const row = list?.children[index];
		if (!list || !(row instanceof HTMLElement)) return;
		const top = row.offsetTop - PAD;
		const bottom = row.offsetTop + row.offsetHeight + PAD;
		if (top < list.scrollTop) list.scrollTop = top;
		else if (bottom > list.scrollTop + list.clientHeight) {
			list.scrollTop = bottom - list.clientHeight;
		}
	};

	const jump = (index: number) => {
		if (results.length === 0) return;
		const next = Math.max(0, Math.min(results.length - 1, index));
		setPinned(results[next].id);
		reveal(next);
	};

	const move = (delta: number) => {
		if (results.length === 0) return;
		const from = activeIndex < 0 ? 0 : activeIndex;
		jump((from + delta + results.length) % results.length);
	};

	const run = (item?: CommandItem) => {
		const target = item ?? results.find((r) => r.id === activeId);
		if (target) select.current(target);
	};

	/**
	 * Only a real pointer *move* changes the selection. Without this, scrolling
	 * the list with the keyboard would drag rows under a stationary cursor and
	 * steal the highlight back.
	 */
	const pointerActivate = (id: string, event: React.PointerEvent) => {
		const { x, y } = pointer.current;
		if (event.clientX === x && event.clientY === y) return;
		pointer.current = { x: event.clientX, y: event.clientY };
		if (id !== activeId) setPinned(id);
	};

	const onKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			move(1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			move(-1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			jump(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			jump(results.length - 1);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			run();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			dismiss.current?.();
		}
	};

	return {
		query,
		setQuery,
		results,
		activeId,
		activeIndex,
		listRef,
		run,
		pointerActivate,
		onKeyDown,
	};
}
