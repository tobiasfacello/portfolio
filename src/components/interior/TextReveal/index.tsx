//! React
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

//? Lib
import { EASE_SMOOTH_OUT } from '../../../lib/motion';

//* Styled
import { StyledRevealRoot, StyledRevealGroup, StyledRevealUnit } from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

/** Length of a single unit's reveal, in seconds. */
const UNIT_DURATION = 0.6;

export type TextRevealSplit = 'word' | 'character';

export type TextRevealProps = {
	text: string;
	by?: TextRevealSplit;
	/** Seconds between consecutive units. Clamped by `maxDuration`. */
	stagger?: number;
	/** Total reveal never exceeds this, however long the text is. */
	maxDuration?: number;
	startOnView?: boolean;
	play?: boolean;
	once?: boolean;
	/** Fraction of the element that must be visible to start. */
	amount?: number;
};

function TextReveal({
	text,
	by = 'word',
	stagger = 0.055,
	maxDuration = 1.6,
	startOnView = true,
	play = true,
	once = true,
	amount = 0.35,
}: TextRevealProps) {
	const rootRef = useRef<HTMLSpanElement>(null);
	const prefersReducedMotion = usePrefersReducedMotion();
	const [inView, setInView] = useState(!startOnView);

	const { groups, step } = useMemo(() => {
		const words = text.trim().length ? text.trim().split(/\s+/) : [];

		let index = 0;
		const built = words.map((word, w) => {
			if (by === 'character') {
				return {
					key: `w${w}`,
					units: Array.from(word).map((char, c) => ({
						key: `w${w}c${c}`,
						text: char,
						index: index++,
					})),
				};
			}
			return {
				key: `w${w}`,
				units: [{ key: `w${w}`, text: word, index: index++ }],
			};
		});

		// A long paragraph staggered at a fixed rate would take many seconds to
		// finish; the step shrinks so the whole reveal still fits in maxDuration.
		const span = Math.max(0, maxDuration - UNIT_DURATION);
		return {
			groups: built,
			step: index > 1 ? Math.min(stagger, span / (index - 1)) : 0,
		};
	}, [text, by, stagger, maxDuration]);

	useEffect(() => {
		if (!startOnView) return;
		const node = rootRef.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					if (once) observer.disconnect();
				} else if (!once) {
					setInView(false);
				}
			},
			{ threshold: amount },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [startOnView, once, amount]);

	const started = play && inView;

	useGSAP(
		() => {
			const node = rootRef.current;
			if (!node) return;

			const units = node.querySelectorAll('[data-reveal-unit]');
			if (units.length === 0) return;

			if (prefersReducedMotion) {
				gsap.set(units, { opacity: 1, y: 0, filter: 'blur(0px)' });
				return;
			}

			gsap.to(units, {
				opacity: started ? 1 : 0,
				y: started ? 0 : 10,
				filter: started ? 'blur(0px)' : 'blur(8px)',
				duration: UNIT_DURATION,
				ease: EASE_SMOOTH_OUT,
				stagger: started ? step : 0,
			});
		},
		{ dependencies: [started, step, prefersReducedMotion, text, by], scope: rootRef },
	);

	return (
		<StyledRevealRoot ref={rootRef}>
			{/* The full string stays readable to assistive tech; splitting it into
			    per-unit spans would otherwise have it announced letter by letter. */}
			<StyledVisuallyHidden>{text}</StyledVisuallyHidden>

			<span aria-hidden="true">
				{groups.map((group, g) => (
					<Fragment key={group.key}>
						{g > 0 ? ' ' : null}
						<StyledRevealGroup>
							{group.units.map((unit) => (
								<StyledRevealUnit key={unit.key} data-reveal-unit>
									{unit.text}
								</StyledRevealUnit>
							))}
						</StyledRevealGroup>
					</Fragment>
				))}
			</span>
		</StyledRevealRoot>
	);
}

export default TextReveal;
