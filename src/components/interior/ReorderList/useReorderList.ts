import { useCallback, useRef, useState } from 'react';

const moveItem = <T,>(list: readonly T[], from: number, to: number): T[] => {
	const next = [...list];
	const [taken] = next.splice(from, 1);
	next.splice(to, 0, taken);
	return next;
};

export type UseReorderListOptions<T> = {
	items: readonly T[];
	getId: (item: T) => string;
	getLabel: (item: T) => string;
	onReorder: (next: T[]) => void;
	/** Called when the new order is final, not on every intermediate move. */
	onCommit?: (next: T[]) => void;
	disabled?: boolean;
};

/**
 * Reordering that works without a pointer.
 *
 * The keyboard model mirrors the drag exactly: Space grabs, arrows move, Space
 * drops, Escape restores the order from before the grab. The original list is
 * snapshotted on grab, which is what makes that cancel possible — the moves
 * have already been applied for real, so there is nothing to undo without it.
 */
export function useReorderList<T>({
	items,
	getId,
	getLabel,
	onReorder,
	onCommit,
	disabled = false,
}: UseReorderListOptions<T>) {
	const [grabbed, setGrabbed] = useState<string | null>(null);
	const [dragging, setDragging] = useState<string | null>(null);
	const [spoken, setSpoken] = useState('');

	const emit = useRef(onReorder);
	emit.current = onReorder;
	const settle = useRef(onCommit);
	settle.current = onCommit;
	const live = useRef(items);
	live.current = items;
	const snapshot = useRef<readonly T[] | null>(null);

	const rowRefs = useRef(new Map<string, HTMLElement>());
	const registerRow = useCallback((id: string, node: HTMLElement | null) => {
		if (node) rowRefs.current.set(id, node);
		else rowRefs.current.delete(id);
	}, []);

	const indexOf = useCallback(
		(id: string) => live.current.findIndex((item) => getId(item) === id),
		[getId],
	);

	const grab = useCallback(
		(id: string) => {
			snapshot.current = live.current;
			setGrabbed(id);
			const at = indexOf(id);
			const item = live.current[at];
			setSpoken(`${getLabel(item)} grabbed, position ${at + 1} of ${live.current.length}.`);
		},
		[getLabel, indexOf],
	);

	const drop = useCallback(
		(id: string) => {
			snapshot.current = null;
			setGrabbed(null);
			const at = indexOf(id);
			const item = live.current[at];
			setSpoken(`${getLabel(item)} dropped at position ${at + 1}.`);
			settle.current?.([...live.current]);
		},
		[getLabel, indexOf],
	);

	const cancel = useCallback(() => {
		if (snapshot.current) emit.current([...snapshot.current]);
		snapshot.current = null;
		setGrabbed(null);
		setSpoken('Reorder cancelled, original order restored.');
	}, []);

	const step = useCallback(
		(id: string, delta: -1 | 1) => {
			const from = indexOf(id);
			const to = from + delta;
			if (from < 0 || to < 0 || to >= live.current.length) return;
			const next = moveItem(live.current, from, to);
			emit.current(next);
			const item = next[to];
			setSpoken(`${getLabel(item)}, position ${to + 1} of ${next.length}.`);
			// A move made outside a grab is already final.
			if (snapshot.current === null) settle.current?.(next);
		},
		[getLabel, indexOf],
	);

	const rowKeyDown = useCallback(
		(id: string) => (event: React.KeyboardEvent<HTMLElement>) => {
			if (disabled || event.target !== event.currentTarget) return;
			const held = grabbed === id;
			if (event.key === ' ' || event.key === 'Enter') {
				event.preventDefault();
				if (held) drop(id);
				else grab(id);
				return;
			}
			if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && held) {
				event.preventDefault();
				step(id, event.key === 'ArrowUp' ? -1 : 1);
				return;
			}
			if (event.key === 'Escape' && held) {
				event.preventDefault();
				cancel();
			}
		},
		[disabled, grabbed, grab, drop, step, cancel],
	);

	const drag = useRef<{ id: string; pointerId: number } | null>(null);

	const rowPointerDown = useCallback(
		(id: string) => (event: React.PointerEvent<HTMLElement>) => {
			if (disabled) return;
			if (event.pointerType === 'mouse' && event.button !== 0) return;
			(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
			drag.current = { id, pointerId: event.pointerId };
			snapshot.current = live.current;
			setDragging(id);
		},
		[disabled],
	);

	/**
	 * Reorders by hit-testing the row midpoints rather than tracking an offset,
	 * so rows of different heights still swap at the moment the pointer crosses
	 * the boundary between them.
	 */
	const rowPointerMove = useCallback(
		(event: React.PointerEvent<HTMLElement>) => {
			const state = drag.current;
			if (!state || event.pointerId !== state.pointerId) return;

			const from = indexOf(state.id);
			if (from < 0) return;

			let to = from;
			live.current.forEach((item, index) => {
				const node = rowRefs.current.get(getId(item));
				if (!node) return;
				const rect = node.getBoundingClientRect();
				const middle = rect.top + rect.height / 2;
				if (index < from && event.clientY < middle) to = Math.min(to, index);
				else if (index > from && event.clientY > middle) to = Math.max(to, index);
			});

			if (to === from) return;
			emit.current(moveItem(live.current, from, to));
		},
		[getId, indexOf],
	);

	const rowPointerUp = useCallback(
		(event: React.PointerEvent<HTMLElement>) => {
			const state = drag.current;
			if (!state || event.pointerId !== state.pointerId) return;
			drag.current = null;
			snapshot.current = null;
			setDragging(null);
			settle.current?.([...live.current]);
		},
		[],
	);

	return {
		grabbed,
		dragging,
		spoken,
		registerRow,
		rowKeyDown,
		rowPointerDown,
		rowPointerMove,
		rowPointerUp,
		step,
	};
}
