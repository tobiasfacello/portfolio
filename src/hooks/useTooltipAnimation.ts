//! GSAP
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function useTooltipAnimation(isVisible: boolean, position: 'top' | 'bottom' = 'top') {
	const tooltipRef = useRef<HTMLSpanElement>(null);
	const isFirst = useRef(true);
	const yOffset = position === 'top' ? 4 : -4;

	useGSAP(() => {
		const el = tooltipRef.current;
		if (!el) return;

		if (isFirst.current) {
			gsap.set(el, { autoAlpha: 0, y: yOffset });
			isFirst.current = false;
			if (!isVisible) return;
		}

		gsap.killTweensOf(el);

		if (isVisible) {
			gsap.fromTo(
				el,
				{ autoAlpha: 0, y: yOffset },
				{ autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' }
			);
		} else {
			gsap.to(el, {
				autoAlpha: 0,
				y: yOffset,
				duration: 0.2,
				ease: 'power2.inOut',
			});
		}
	}, [isVisible]);

	return tooltipRef;
}
