import { useCallback, useLayoutEffect, useRef, useState } from 'react';

//! GSAP
import { gsap } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

//? Lib
import { SPRINGS, spring } from '../../../lib/motion';

/** Bouncier than the normal glide — used when the drag hits either end. */
const WALL = spring({ stiffness: 700, damping: 30, mass: 0.5 });
/** Resistance applied past the first and last slide. */
const RUBBER_BAND = 0.35;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export type UseSnapCarouselOptions = {
	count: number;
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	gap?: number;
	/** How much of a flick's speed counts toward the landing slide. */
	momentum?: number;
	/** Most slides a single flick can travel. */
	maxFlick?: number;
	disabled?: boolean;
};

/**
 * A carousel that lands where the gesture aimed.
 *
 * The target slide is chosen from position *plus* momentum, so a short fast
 * flick advances while a long slow drag that ends mid-slide falls back — the
 * same distance can mean two different intentions. A single flick is capped at
 * `maxFlick` slides so a hard swipe cannot fling past everything, and dragging
 * beyond either end is rubber-banded and springs back, so the edges are felt
 * rather than discovered by the strip simply refusing to move.
 */
export function useSnapCarousel({
	count,
	index: controlled,
	defaultIndex = 0,
	onIndexChange,
	gap = 12,
	momentum = 0.14,
	maxFlick = 1,
	disabled = false,
}: UseSnapCarouselOptions) {
	const total = Math.max(1, Math.floor(count));

	const [uncontrolled, setUncontrolled] = useState(() => clamp(defaultIndex, 0, total - 1));
	const [slideWidth, setSlideWidth] = useState(0);
	const [dragging, setDragging] = useState(false);

	const index = clamp(controlled ?? uncontrolled, 0, total - 1);
	const step = slideWidth + gap;

	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const offset = useRef(0);
	const tween = useRef<gsap.core.Tween | null>(null);

	const changed = useRef(onIndexChange);
	changed.current = onIndexChange;

	const prefersReducedMotion = usePrefersReducedMotion();

	useLayoutEffect(() => {
		const el = viewportRef.current;
		if (!el) return;
		const read = () => setSlideWidth(el.getBoundingClientRect().width);
		read();
		const observer = new ResizeObserver(read);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const paint = useCallback((value: number) => {
		offset.current = value;
		if (trackRef.current) gsap.set(trackRef.current, { x: value });
	}, []);

	const glide = useCallback(
		(to: number, bouncy = false) => {
			tween.current?.kill();
			const config = bouncy ? WALL : SPRINGS.crossfade;
			const state = { value: offset.current };
			tween.current = gsap.to(state, {
				value: to,
				duration: prefersReducedMotion ? 0 : config.duration,
				ease: config.ease,
				onUpdate: () => paint(state.value),
			});
		},
		[paint, prefersReducedMotion],
	);

	const goTo = useCallback(
		(next: number, bouncy = false) => {
			const target = clamp(next, 0, total - 1);
			if (controlled === undefined) setUncontrolled(target);
			if (target !== index) changed.current?.(target);
			glide(-target * step, bouncy);
		},
		[controlled, glide, index, step, total],
	);

	// Re-settle when the viewport resizes: the same slide, at its new width.
	useLayoutEffect(() => {
		if (step <= 0) return;
		paint(-index * step);
	}, [index, step, paint]);

	const drag = useRef<{ pointerId: number; startX: number; base: number; lastX: number; lastAt: number } | null>(
		null,
	);

	const onPointerDown = (event: React.PointerEvent) => {
		if (disabled || step <= 0) return;
		tween.current?.kill();
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
		drag.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			base: offset.current,
			lastX: event.clientX,
			lastAt: performance.now(),
		};
		setDragging(true);
	};

	const onPointerMove = (event: React.PointerEvent) => {
		const state = drag.current;
		if (!state || event.pointerId !== state.pointerId) return;

		const raw = state.base + (event.clientX - state.startX);
		const min = -(total - 1) * step;
		// Past either end the strip still moves, just reluctantly.
		const next = raw > 0 ? raw * RUBBER_BAND : raw < min ? min + (raw - min) * RUBBER_BAND : raw;

		paint(next);
		state.lastX = event.clientX;
		state.lastAt = performance.now();
	};

	const endDrag = (event: React.PointerEvent) => {
		const state = drag.current;
		if (!state || event.pointerId !== state.pointerId) return;
		drag.current = null;
		setDragging(false);
		if (step <= 0) return;

		const elapsed = Math.max(1, performance.now() - state.lastAt);
		const velocity = ((event.clientX - state.lastX) / elapsed) * 1000;

		// Position plus a slice of the flick decides the landing slide.
		const projected = -(offset.current + velocity * momentum) / step;
		const bounded = clamp(
			Math.round(projected),
			index - maxFlick,
			index + maxFlick,
		);
		const target = clamp(bounded, 0, total - 1);

		const atWall = offset.current > 0 || offset.current < -(total - 1) * step;
		goTo(target, atWall);
	};

	const onKeyDown = (event: React.KeyboardEvent) => {
		if (disabled) return;
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			goTo(index + 1);
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goTo(index - 1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			goTo(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			goTo(total - 1);
		}
	};

	return {
		index,
		total,
		dragging,
		slideWidth,
		viewportRef,
		trackRef,
		goTo,
		viewportProps: {
			ref: viewportRef,
			tabIndex: 0,
			style: { touchAction: 'pan-y' as const },
			onPointerDown,
			onPointerMove,
			onPointerUp: endDrag,
			onPointerCancel: endDrag,
			onKeyDown,
		},
	};
}
