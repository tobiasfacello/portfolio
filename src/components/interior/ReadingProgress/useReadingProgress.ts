import { useCallback, useEffect, useRef, useState } from 'react';

export type ScrollRef = { readonly current: HTMLElement | null };

export type UseReadingProgressOptions = {
	/** The element being read. Defaults to the whole document. */
	target?: ScrollRef;
	/** The scrolling container, if it is not the window. */
	scroller?: ScrollRef;
	/** Progress is quantised into this many steps. */
	steps?: number;
	words?: number;
	wordsPerMinute?: number;
};

function clamp01(n: number) {
	if (!Number.isFinite(n) || n < 0) return 0;
	return n > 1 ? 1 : n;
}

/**
 * Reports how far through a piece of content the reader is.
 *
 * Progress is quantised into `steps` rather than tracked continuously: a bar
 * that re-renders on every pixel of scroll costs far more than it communicates,
 * and the eye cannot tell the difference at this size.
 */
export function useReadingProgress({
	target,
	scroller,
	steps = 24,
	words = 0,
	wordsPerMinute = 220,
}: UseReadingProgressOptions = {}) {
	const [step, setStep] = useState(0);
	const frame = useRef(0);

	const read = useCallback(() => {
		frame.current = 0;

		const scrollEl = scroller?.current ?? null;
		const targetEl = target?.current ?? null;
		const viewport = scrollEl ? scrollEl.clientHeight : window.innerHeight;

		let ratio: number;
		if (targetEl) {
			const rect = targetEl.getBoundingClientRect();
			const base = scrollEl ? scrollEl.getBoundingClientRect().top : 0;
			const travel = rect.height - viewport;
			// Content shorter than the viewport is entirely visible: fully read.
			ratio = travel <= 0 ? 1 : (base - rect.top) / travel;
		} else if (scrollEl) {
			const travel = scrollEl.scrollHeight - scrollEl.clientHeight;
			ratio = travel <= 0 ? 1 : scrollEl.scrollTop / travel;
		} else {
			const doc = document.documentElement;
			const travel = doc.scrollHeight - viewport;
			ratio = travel <= 0 ? 1 : window.scrollY / travel;
		}

		const next = Math.round(clamp01(ratio) * steps);
		setStep((prev) => (prev === next ? prev : next));
	}, [scroller, target, steps]);

	useEffect(() => {
		const scrollEl = scroller?.current ?? null;
		const targetEl = target?.current ?? null;
		const source: EventTarget = scrollEl ?? window;

		const schedule = () => {
			if (frame.current) return;
			frame.current = requestAnimationFrame(read);
		};

		source.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);

		// Content that grows after load — images, embeds — changes the total
		// travel, so the ratio has to be recomputed rather than assumed fixed.
		const observer = new ResizeObserver(schedule);
		if (targetEl) observer.observe(targetEl);
		if (scrollEl) observer.observe(scrollEl);
		if (!targetEl && !scrollEl) observer.observe(document.documentElement);

		read();

		return () => {
			source.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			observer.disconnect();
			if (frame.current) cancelAnimationFrame(frame.current);
			frame.current = 0;
		};
	}, [read, scroller, target]);

	const progress = steps > 0 ? step / steps : 1;
	const totalMinutes = words > 0 ? Math.max(1, Math.ceil(words / wordsPerMinute)) : 0;
	const minutesLeft = words > 0 ? Math.ceil(((1 - progress) * words) / wordsPerMinute) : 0;

	return {
		step,
		steps,
		progress,
		percent: Math.round(progress * 100),
		minutesLeft,
		totalMinutes,
		complete: step >= steps,
	};
}
