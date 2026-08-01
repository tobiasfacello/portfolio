import { useEffect, useRef, useState } from 'react';

export type UseHideOnScrollOptions = {
	/** Downward travel needed to hide the bar, in px. */
	hideAfter?: number;
	/** Upward travel needed to bring it back, in px. */
	revealAfter?: number;
	/** Within this distance of the top the bar always shows, in px. */
	topGuard?: number;
	/** Forces the bar visible — used while focus is inside it. */
	pinned?: boolean;
	disabled?: boolean;
};

/**
 * Hides a bar on downward scroll and brings it back on upward scroll.
 *
 * Direction is accumulated rather than read per event, and the accumulator
 * resets whenever the direction flips: a trackpad's jitter around zero would
 * otherwise flap the bar continuously. Reveal has a lower threshold than hide —
 * wanting the bar back should cost less than dismissing it.
 */
export function useHideOnScroll<T extends HTMLElement = HTMLDivElement>({
	hideAfter = 14,
	revealAfter = 10,
	topGuard = 24,
	pinned = false,
	disabled = false,
}: UseHideOnScrollOptions = {}) {
	const ref = useRef<T | null>(null);
	const frame = useRef(0);
	const last = useRef(0);
	const accum = useRef(0);

	const held = useRef(pinned || disabled);
	held.current = pinned || disabled;

	const [hidden, setHidden] = useState(false);
	const [atTop, setAtTop] = useState(true);

	const down = Math.max(1, hideAfter);
	const up = Math.max(1, revealAfter);
	const guard = Math.max(0, topGuard);

	useEffect(() => {
		if (!pinned && !disabled) return;
		accum.current = 0;
		setHidden(false);
	}, [pinned, disabled]);

	useEffect(() => {
		const el = ref.current;
		const target: EventTarget = el ?? window;

		const readY = () => (el ? el.scrollTop : window.scrollY);
		const readMax = () =>
			el
				? el.scrollHeight - el.clientHeight
				: document.documentElement.scrollHeight - window.innerHeight;

		const evaluate = () => {
			frame.current = 0;

			const max = readMax();
			const y = readY();

			// Nothing to scroll: there is no gesture to interpret, so the bar stays.
			if (max <= guard) {
				accum.current = 0;
				last.current = y;
				setAtTop((prev) => (prev ? prev : true));
				setHidden((prev) => (prev ? false : prev));
				return;
			}

			// Ignore rubber-band overscroll past either end.
			if (y < 0 || y > max) return;

			const dy = y - last.current;
			last.current = y;

			const top = y <= guard;
			setAtTop((prev) => (prev === top ? prev : top));

			if (held.current || top) {
				accum.current = 0;
				setHidden((prev) => (prev ? false : prev));
				return;
			}

			if (dy === 0) return;
			if (dy > 0 !== accum.current > 0) accum.current = 0;
			accum.current += dy;

			if (accum.current >= down) {
				accum.current = 0;
				setHidden((prev) => (prev ? prev : true));
			} else if (accum.current <= -up) {
				accum.current = 0;
				setHidden((prev) => (prev ? false : prev));
			}
		};

		const schedule = () => {
			if (frame.current) return;
			frame.current = requestAnimationFrame(evaluate);
		};

		last.current = readY();
		evaluate();

		target.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);

		let observer: ResizeObserver | null = null;
		if (el) {
			observer = new ResizeObserver(schedule);
			observer.observe(el);
		}

		return () => {
			target.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			observer?.disconnect();
			if (frame.current) cancelAnimationFrame(frame.current);
			frame.current = 0;
		};
	}, [down, up, guard]);

	return { ref, hidden, atTop };
}
