import { useCallback, useEffect, useRef } from 'react';

/**
 * Drives a tabs-sliding pill: writes the active button's `offsetLeft` /
 * `offsetWidth` onto a single absolutely-positioned pill so the tween lives in
 * CSS. First paint and resize snap without animation (transition suspended +
 * reflow) so the pill never animates from the resting 0-width state.
 *
 * Pattern: transitions.dev — 16-tabs-sliding.
 */
export function usePillSlider<T extends HTMLElement = HTMLButtonElement>(activeIndex: number) {
	const pillRef = useRef<HTMLSpanElement>(null);
	const buttonRefs = useRef<(T | null)[]>([]);

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

	useEffect(() => {
		const id = requestAnimationFrame(() => moveTo(activeIndex, false));
		return () => cancelAnimationFrame(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		moveTo(activeIndex, true);
	}, [activeIndex, moveTo]);

	useEffect(() => {
		const onResize = () => moveTo(activeIndex, false);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [activeIndex, moveTo]);

	return { pillRef, setButtonRef, buttonRefs };
}
