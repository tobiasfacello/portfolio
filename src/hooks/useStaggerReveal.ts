//! Third-party
import { useLayoutEffect, type RefObject } from 'react';

//? Hooks
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// Entrance reveal on the Web Animations API, so the home page doesn't pull GSAP
// (~30 KB gzip) onto the critical path for a one-shot animation. Timing mirrors
// the previous GSAP timeline: grid items rise 40px + fade over 1s with a 0.12s
// grid stagger eased by power1.inOut, and the footer rises 24px over 0.8s at
// 0.25s. Animations run on the compositor and leave no inline styles behind.

const EASE_OUT_CUBIC = 'cubic-bezier(0.33, 1, 0.68, 1)'; // GSAP power2.out
const STAGGER_EACH = 0.12;

const power1InOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p));

/**
 * Per-item delays (seconds) matching GSAP's `stagger: { each, from: 'start',
 * grid: 'auto', ease: 'power1.inOut' }`: columns are detected from the items'
 * left edges, each item's distance from the origin cell is normalised and
 * eased, and the spread is `each * max(cols, rows)`.
 */
function gridStaggerDelays(items: Element[]): number[] {
	const count = items.length;
	if (count === 0) return [];

	let cols = 0;
	let prevLeft = -Infinity;
	while (cols < count) {
		const left = items[cols].getBoundingClientRect().left;
		if (left <= prevLeft) break;
		prevLeft = left;
		cols += 1;
	}

	const distances = items.map((_, i) => {
		const x = (i % cols) + 0.5;
		const y = -0.5 - Math.floor(i / cols);
		return Math.sqrt(x * x + y * y);
	});
	const min = Math.min(...distances);
	const range = Math.max(...distances) - min;
	const spread = STAGGER_EACH * Math.max(cols, count / cols);

	return distances.map((d) => (range ? power1InOut((d - min) / range) : 0) * spread);
}

function rise(el: Element, offsetY: number, duration: number, delay: number): Animation {
	return el.animate(
		[
			{ opacity: 0, visibility: 'hidden', transform: `translateY(${offsetY}px)` },
			{ opacity: 1, visibility: 'visible', transform: 'none' },
		],
		{ duration: duration * 1000, delay: delay * 1000, easing: EASE_OUT_CUBIC, fill: 'backwards' },
	);
}

export function useStaggerReveal(
	gridRef: RefObject<HTMLElement | null>,
	footerRef: RefObject<HTMLElement | null>
) {
	const prefersReducedMotion = usePrefersReducedMotion();

	// Layout effect: the start frame (hidden, offset) must be applied before the
	// first paint, or the content flashes in before animating.
	useLayoutEffect(() => {
		if (prefersReducedMotion) return;

		const gridItems = gridRef.current ? Array.from(gridRef.current.children) : [];
		if (!gridItems.length || typeof Element.prototype.animate !== 'function') return;

		const animations = gridStaggerDelays(gridItems).map((delay, i) => rise(gridItems[i], 40, 1, delay));
		if (footerRef.current) animations.push(rise(footerRef.current, 24, 0.8, 0.25));

		// Switching to reduced motion mid-reveal jumps straight to the end state.
		return () => animations.forEach((animation) => animation.cancel());
	}, [prefersReducedMotion, gridRef, footerRef]);
}
