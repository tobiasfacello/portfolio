import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
	const ref = useRef<T>(null);
	const prefersReducedMotion = usePrefersReducedMotion();

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		if (prefersReducedMotion) {
			el.classList.add('revealed');
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('revealed');
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.15 }
		);

		observer.observe(el);

		return () => {
			observer.disconnect();
		};
	}, [prefersReducedMotion]);

	return ref;
}
