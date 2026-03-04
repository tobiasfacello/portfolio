//! Third-party
import { type RefObject } from 'react';

//? Hooks
import { gsap, useGSAP } from '../lib/gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useStaggerReveal(
	gridRef: RefObject<HTMLElement | null>,
	footerRef: RefObject<HTMLElement | null>
) {
	const prefersReducedMotion = usePrefersReducedMotion();

	useGSAP(
		() => {
			if (prefersReducedMotion) return;

			const gridItems = gridRef.current
				? Array.from(gridRef.current.children)
				: [];
			const footer = footerRef.current;

			if (!gridItems.length) return;

			const allItems = [...gridItems, ...(footer ? [footer] : [])];
			gsap.set(allItems, { willChange: 'transform, opacity' });

			const tl = gsap.timeline({
				defaults: { ease: 'power3.out' },
				onComplete: () => {
					gsap.set(allItems, { clearProps: 'willChange' });
				},
			});

			tl.from(gridItems, {
				autoAlpha: 0,
				y: 40,
				duration: 1,
				ease: 'power2.out',
				stagger: {
					each: 0.12,
					from: 'start',
					grid: 'auto',
					ease: 'power1.inOut',
				},
			});

			if (footer) {
				tl.from(
					footer,
					{ autoAlpha: 0, y: 24, duration: 0.8, ease: 'power2.out' },
					0.25
				);
			}
		},
		{ dependencies: [prefersReducedMotion] }
	);
}
