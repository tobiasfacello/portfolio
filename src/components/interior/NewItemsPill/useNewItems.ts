import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

export type NewItemsAnchor = 'top' | 'bottom';

export type UseNewItemsOptions = {
	itemCount: number;
	/** Which end new items arrive at. */
	anchor?: NewItemsAnchor;
	/** How close to the anchor still counts as pinned, in px. */
	threshold?: number;
};

/**
 * Keeps a live list readable while it grows underneath the reader.
 *
 * Someone parked at the anchor is carried along with new items. Someone who has
 * scrolled away is not moved at all: their scroll position is corrected by the
 * height of whatever was inserted, so the row they were reading stays exactly
 * where it was, and the arrivals are reported as a count instead.
 */
export function useNewItems<T extends HTMLElement = HTMLDivElement>({
	itemCount,
	anchor = 'top',
	threshold = 24,
}: UseNewItemsOptions) {
	const ref = useRef<T | null>(null);
	const pinnedRef = useRef(true);
	const prevCount = useRef(itemCount);
	/** Distance from the scroll position to the end of the content. */
	const bottomGap = useRef(0);

	const [unread, setUnread] = useState(0);
	const [pinned, setPinned] = useState(true);
	const prefersReducedMotion = usePrefersReducedMotion();

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const read = () =>
			anchor === 'bottom'
				? el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
				: el.scrollTop <= threshold;

		const onScroll = () => {
			bottomGap.current = el.scrollHeight - el.scrollTop;
			const next = read();
			if (next === pinnedRef.current) return;
			pinnedRef.current = next;
			setPinned(next);
			// Scrolling back to the anchor is itself an acknowledgement.
			if (next) setUnread(0);
		};
		onScroll();
		el.addEventListener('scroll', onScroll, { passive: true });
		return () => el.removeEventListener('scroll', onScroll);
	}, [anchor, threshold]);

	useLayoutEffect(() => {
		const el = ref.current;
		const added = itemCount - prevCount.current;
		prevCount.current = itemCount;
		if (!el || added <= 0) return;

		if (pinnedRef.current) {
			el.scrollTop = anchor === 'bottom' ? el.scrollHeight : 0;
			bottomGap.current = el.scrollHeight - el.scrollTop;
			return;
		}

		// Items prepended above the viewport would otherwise push the reader's
		// content down; restore the offset measured from the far end.
		if (anchor === 'top') {
			const target = el.scrollHeight - bottomGap.current;
			if (target > el.scrollTop) el.scrollTop = target;
		}
		setUnread((n) => n + added);
	}, [itemCount, anchor]);

	const unreadRef = useRef(0);
	unreadRef.current = unread;

	const jump = useCallback(() => {
		const el = ref.current;
		const caught = unreadRef.current;
		if (!el) return caught;
		pinnedRef.current = true;
		setPinned(true);
		setUnread(0);

		el.focus({ preventScroll: true });
		el.scrollTo({
			top: anchor === 'bottom' ? el.scrollHeight : 0,
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
		});
		return caught;
	}, [anchor, prefersReducedMotion]);

	return {
		// `overflow-anchor: none` — the browser's own anchoring would fight the
		// correction applied above.
		scrollProps: { ref, tabIndex: 0, style: { overflowAnchor: 'none' as const } },
		unread,
		pinned,
		jump,
	};
}
