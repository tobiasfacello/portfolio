import { useCallback, useEffect, useRef } from 'react';

/**
 * Drives a tabs-sliding pill: writes the active button's `offsetLeft` /
 * `offsetWidth` onto a single absolutely-positioned pill so the tween lives in
 * CSS. First paint and any geometry change (resize, web-font swap, container
 * reflow) snap without animation — the transition is suspended + a reflow is
 * forced — so the pill never animates from the resting 0-width state. Only an
 * `activeIndex` change after mount animates.
 *
 * Pattern: transitions.dev — 16-tabs-sliding.
 */
export function usePillSlider<T extends HTMLElement = HTMLButtonElement>(activeIndex: number) {
	const pillRef = useRef<HTMLSpanElement>(null);
	const buttonRefs = useRef<(T | null)[]>([]);
	// Latest activeIndex, readable from listeners without re-subscribing them.
	const activeIndexRef = useRef(activeIndex);
	activeIndexRef.current = activeIndex;
	// Distinguishes the first layout effect (snap) from later ones (animate).
	const hasMountedRef = useRef(false);

	const setButtonRef = useCallback(
		(index: number) => (el: T | null) => {
			buttonRefs.current[index] = el;
		},
		[],
	);

	const moveTo = useCallback((index: number, animate: boolean) => {
		const pill = pillRef.current;
		const target = buttonRefs.current[index];
		if (!pill || !target) return;

		// Walk offsetParent chain until we reach the pill's positioning context
		// (the group). Necessary when buttons live inside wrapper elements that
		// are themselves position:relative (e.g. a Tooltip), so their offsetLeft
		// is scoped to the wrapper rather than the group.
		const positioning = pill.offsetParent as HTMLElement | null;
		let offsetLeft = target.offsetLeft;
		let node = target.offsetParent as HTMLElement | null;
		while (node && node !== positioning) {
			offsetLeft += node.offsetLeft;
			node = node.offsetParent as HTMLElement | null;
		}

		const transformValue = `translateX(${offsetLeft}px)`;
		const widthValue = `${target.offsetWidth}px`;

		if (!animate) {
			const prev = pill.style.transition;
			pill.style.transition = 'none';
			pill.style.transform = transformValue;
			pill.style.width = widthValue;
			// Force reflow so the next style write picks up the snap as a start frame.
			void pill.offsetWidth;
			pill.style.transition = prev;
		} else {
			pill.style.transform = transformValue;
			pill.style.width = widthValue;
		}
	}, []);

	// Snap on first paint (deferred a frame so refs/layout are settled), animate
	// on every subsequent activeIndex change.
	useEffect(() => {
		if (hasMountedRef.current) {
			moveTo(activeIndex, true);
			return;
		}
		const id = requestAnimationFrame(() => {
			moveTo(activeIndex, false);
			hasMountedRef.current = true;
		});
		return () => cancelAnimationFrame(id);
	}, [activeIndex, moveTo]);

	// Re-snap (no animation) whenever geometry changes for reasons other than an
	// activeIndex change: window resize, the pill web-font finishing load
	// (font-display: swap shifts button widths after first paint), or any group
	// reflow. Subscribed once for the component's lifetime — the handler reads
	// the latest activeIndex from a ref.
	useEffect(() => {
		let frame = 0;
		const resnap = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => moveTo(activeIndexRef.current, false));
		};

		window.addEventListener('resize', resnap);

		let cancelled = false;
		if (typeof document !== 'undefined' && 'fonts' in document) {
			document.fonts.ready.then(() => {
				if (!cancelled) resnap();
			});
		}

		let observer: ResizeObserver | null = null;
		const group = pillRef.current?.offsetParent as HTMLElement | null;
		if (group && typeof ResizeObserver !== 'undefined') {
			observer = new ResizeObserver(resnap);
			observer.observe(group);
		}

		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', resnap);
			observer?.disconnect();
		};
	}, [moveTo]);

	return { pillRef, setButtonRef, buttonRefs };
}
