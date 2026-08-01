import { useEffect, useRef, useState } from 'react';

export type UseCondenseOptions = {
	/** Scroll distance over which the header fully condenses, in px. */
	range?: number;
	/** Called every frame the smoothed progress changes. */
	onProgress?: (progress: number) => void;
};

/**
 * Reports how far a scroll container has condensed its header, from 0 to 1.
 *
 * The raw ratio is smoothed toward its target rather than applied directly:
 * momentum scrolling delivers large, uneven jumps, and driving a header's size
 * straight off them makes it judder. `condensed` is derived from the raw value,
 * not the smoothed one, so the state flips exactly at the threshold instead of
 * trailing the animation.
 */
export function useCondense<T extends HTMLElement = HTMLDivElement>({
	range = 48,
	onProgress,
}: UseCondenseOptions = {}) {
	const ref = useRef<T | null>(null);
	const [condensed, setCondensed] = useState(false);

	const report = useRef(onProgress);
	report.current = onProgress;

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const span = Math.max(1, range);
		let frame = 0;

		const evaluate = () => {
			frame = 0;
			const raw = Math.min(1, Math.max(0, el.scrollTop / span));
			report.current?.(raw);
			setCondensed((prev) => (prev === (raw >= 1) ? prev : raw >= 1));
		};

		const schedule = () => {
			if (frame) return;
			frame = requestAnimationFrame(evaluate);
		};

		evaluate();
		el.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);

		return () => {
			el.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [range]);

	return { ref, condensed };
}
