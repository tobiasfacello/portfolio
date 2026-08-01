import { useCallback, useRef, useState } from 'react';

export type SwipeDirection = 'left' | 'right';

export type UseSwipeDeckOptions<T> = {
	items: readonly T[];
	getId: (item: T) => string;
	/** Fraction of the card's width that commits a dismissal. */
	threshold?: number;
	/** Flick speed that commits regardless of distance, in px/s. */
	flick?: number;
	onDecide?: (item: T, direction: SwipeDirection) => void;
	onEmpty?: () => void;
	disabled?: boolean;
};

/**
 * A deck of cards dismissed by swiping.
 *
 * A decision can be earned two ways — far enough or fast enough — because those
 * are two different gestures people actually make: a deliberate drag and a
 * flick. Anything short of either springs back, so an accidental brush never
 * discards a card. Every decision is also available from the keyboard, since a
 * gesture-only interface is not an interface for everyone.
 */
export function useSwipeDeck<T>({
	items,
	getId,
	threshold = 0.32,
	flick = 620,
	onDecide,
	onEmpty,
	disabled = false,
}: UseSwipeDeckOptions<T>) {
	const [cursor, setCursor] = useState(0);
	const [offset, setOffset] = useState(0);
	const [dragging, setDragging] = useState(false);
	const [leaving, setLeaving] = useState<SwipeDirection | null>(null);

	const decided = useRef(onDecide);
	decided.current = onDecide;
	const emptied = useRef(onEmpty);
	emptied.current = onEmpty;

	const width = useRef(0);
	const drag = useRef<{ pointerId: number; startX: number; lastX: number; lastAt: number } | null>(
		null,
	);

	const remaining = items.slice(cursor);
	const top = remaining[0];

	const commit = useCallback(
		(direction: SwipeDirection) => {
			const card = items[cursor];
			if (!card) return;
			setLeaving(direction);
			decided.current?.(card, direction);

			// The card is unmounted only after its exit has played.
			window.setTimeout(() => {
				setLeaving(null);
				setOffset(0);
				setCursor((c) => {
					const next = c + 1;
					if (next >= items.length) emptied.current?.();
					return next;
				});
			}, 260);
		},
		[cursor, items],
	);

	const measure = useCallback((node: HTMLElement | null) => {
		if (node) width.current = node.getBoundingClientRect().width;
	}, []);

	const bind = {
		onPointerDown: (event: React.PointerEvent) => {
			if (disabled || leaving || !top) return;
			if (event.pointerType === 'mouse' && event.button !== 0) return;
			(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
			width.current = (event.currentTarget as HTMLElement).getBoundingClientRect().width;
			drag.current = {
				pointerId: event.pointerId,
				startX: event.clientX,
				lastX: event.clientX,
				lastAt: performance.now(),
			};
			setDragging(true);
		},
		onPointerMove: (event: React.PointerEvent) => {
			const state = drag.current;
			if (!state || event.pointerId !== state.pointerId) return;
			setOffset(event.clientX - state.startX);
			state.lastX = event.clientX;
			state.lastAt = performance.now();
		},
		onPointerUp: (event: React.PointerEvent) => {
			const state = drag.current;
			if (!state || event.pointerId !== state.pointerId) return;
			drag.current = null;
			setDragging(false);

			const travel = event.clientX - state.startX;
			const elapsed = Math.max(1, performance.now() - state.lastAt);
			const velocity = ((event.clientX - state.lastX) / elapsed) * 1000;

			const far = Math.abs(travel) > width.current * threshold;
			const fast = Math.abs(velocity) > flick;

			if (far || fast) {
				commit((far ? travel : velocity) > 0 ? 'right' : 'left');
				return;
			}
			setOffset(0);
		},
		onPointerCancel: () => {
			drag.current = null;
			setDragging(false);
			setOffset(0);
		},
		onKeyDown: (event: React.KeyboardEvent) => {
			if (disabled || leaving || !top) return;
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				commit('left');
			} else if (event.key === 'ArrowRight') {
				event.preventDefault();
				commit('right');
			}
		},
	};

	return {
		top,
		remaining,
		cursor,
		total: items.length,
		offset,
		dragging,
		leaving,
		bind,
		measure,
		commit,
		getId,
	};
}
