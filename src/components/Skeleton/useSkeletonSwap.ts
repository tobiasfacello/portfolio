import { useEffect, useRef, useState } from 'react';

export type UseSkeletonSwapOptions = {
	ready: boolean;
	/** Wait this long before showing a skeleton at all, in ms. */
	delay?: number;
	/** Once shown, keep it at least this long, in ms. */
	minVisible?: number;
};

/**
 * Decides whether a skeleton is worth showing.
 *
 * Content that arrives inside `delay` never shows one — a placeholder that
 * flashes for 80ms is noise, not feedback. Once shown, it stays for
 * `minVisible`, so a fast response cannot produce a flicker either.
 */
export function useSkeletonSwap({ ready, delay = 120, minVisible = 380 }: UseSkeletonSwapOptions) {
	const [visible, setVisible] = useState(false);
	const shownAt = useRef(0);

	useEffect(() => {
		if (!ready) {
			if (visible) return;
			const timer = setTimeout(() => {
				shownAt.current = performance.now();
				setVisible(true);
			}, delay);
			return () => clearTimeout(timer);
		}

		if (!visible) return;
		const rest = Math.max(0, minVisible - (performance.now() - shownAt.current));
		const timer = setTimeout(() => setVisible(false), rest);
		return () => clearTimeout(timer);
	}, [ready, visible, delay, minVisible]);

	return { showSkeleton: visible, busy: !ready };
}
