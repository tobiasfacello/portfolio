import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export type LoadMoreStatus = 'idle' | 'loading' | 'error' | 'end';

export type UseLoadMoreOptions = {
	/** Returning `false` signals there is nothing more to load. */
	onLoad: () => unknown;
	hasMore?: boolean;
	auto?: boolean;
	rootRef?: RefObject<Element | null>;
	rootMargin?: string;
	/** Consecutive automatic loads before handing control back to the reader. */
	maxAutoLoads?: number;
	onError?: (error: unknown) => void;
};

/**
 * Infinite scroll that knows when to stop being infinite.
 *
 * After `maxAutoLoads` consecutive automatic pages the loader pauses and waits
 * for an explicit press — endless auto-loading traps someone trying to reach
 * the footer. Scrolling away from the sentinel resets that count, so normal
 * reading is never interrupted. An error blocks further automatic attempts so a
 * failing endpoint is not hammered; only a manual retry clears it.
 */
export function useLoadMore({
	onLoad,
	hasMore = true,
	auto = true,
	rootRef,
	rootMargin = '600px 0px',
	maxAutoLoads = 3,
	onError,
}: UseLoadMoreOptions) {
	const [phase, setPhase] = useState<'idle' | 'loading' | 'error'>('idle');
	const [ended, setEnded] = useState(false);
	const [paused, setPaused] = useState(false);

	const sentinelRef = useRef<HTMLDivElement>(null);
	const observer = useRef<IntersectionObserver | null>(null);
	const seq = useRef(0);
	const busy = useRef(false);
	const alive = useRef(true);
	const runs = useRef(0);
	const done = useRef(false);
	const blocked = useRef(false);

	const fetchMore = useRef(onLoad);
	fetchMore.current = onLoad;
	const fail = useRef(onError);
	fail.current = onError;
	const more = useRef(hasMore);
	more.current = hasMore;

	/**
	 * If new rows do not push the sentinel out of view, the observer never fires
	 * again. Re-observing re-evaluates it against the new layout.
	 */
	const reobserve = useCallback(() => {
		const io = observer.current;
		const el = sentinelRef.current;
		if (io && el) {
			io.unobserve(el);
			io.observe(el);
		}
	}, []);

	const run = useCallback(
		(manual: boolean) => {
			if (busy.current || done.current || !more.current) return;

			if (manual) {
				runs.current = 0;
				blocked.current = false;
				setPaused(false);
			} else {
				if (blocked.current) return;
				if (runs.current >= maxAutoLoads) {
					setPaused(true);
					return;
				}
				runs.current += 1;
			}

			busy.current = true;
			const id = ++seq.current;
			setPhase('loading');

			Promise.resolve()
				.then(() => fetchMore.current())
				.then(
					(result) => {
						busy.current = false;
						// A superseded request must not resolve over a newer one.
						if (!alive.current || id !== seq.current) return;
						setPhase('idle');
						if (result === false) {
							done.current = true;
							setEnded(true);
							return;
						}
						reobserve();
					},
					(error: unknown) => {
						busy.current = false;
						if (!alive.current || id !== seq.current) return;
						blocked.current = true;
						fail.current?.(error);
						setPhase('error');
					},
				);
		},
		[maxAutoLoads, reobserve],
	);

	useEffect(() => {
		if (hasMore) {
			done.current = false;
			setEnded(false);
		}
	}, [hasMore]);

	useEffect(() => {
		alive.current = true;
		return () => {
			alive.current = false;
		};
	}, []);

	useEffect(() => {
		if (!auto || ended) return;
		const el = sentinelRef.current;
		if (!el) return;

		const io = new IntersectionObserver(
			(entries) => {
				const entry = entries[entries.length - 1];
				if (!entry) return;
				if (entry.isIntersecting) {
					run(false);
					return;
				}
				// Moved away from the end: the auto-load budget is refreshed.
				runs.current = 0;
				setPaused(false);
			},
			{ root: rootRef?.current ?? null, rootMargin, threshold: 0 },
		);

		observer.current = io;
		io.observe(el);

		return () => {
			io.disconnect();
			observer.current = null;
		};
	}, [auto, ended, rootMargin, rootRef, run]);

	const load = useCallback(() => run(true), [run]);

	const status: LoadMoreStatus = ended || !hasMore ? 'end' : phase;

	return { status, paused, sentinelRef, load };
}
