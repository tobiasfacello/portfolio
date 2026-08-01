//! React
import { useRef } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useReadingProgress, type UseReadingProgressOptions } from './useReadingProgress';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledReadingRoot,
	StyledReadingTrack,
	StyledReadingFill,
	StyledReadingReadout,
	StyledReadingRemaining,
	StyledReadingDone,
} from './styled';

export type ReadingProgressProps = UseReadingProgressOptions & {
	label?: string;
	doneLabel?: string;
};

function ReadingProgress({
	target,
	scroller,
	steps = 24,
	words = 0,
	wordsPerMinute = 220,
	label = 'Reading progress',
	doneLabel = 'End',
}: ReadingProgressProps) {
	const { step, percent, minutesLeft, totalMinutes, complete } = useReadingProgress({
		target,
		scroller,
		steps,
		words,
		wordsPerMinute,
	});

	const prefersReducedMotion = usePrefersReducedMotion();

	const fillRef = useRef<HTMLDivElement>(null);
	const remainingRef = useRef<HTMLSpanElement>(null);
	const doneRef = useRef<HTMLSpanElement>(null);
	const tickRef = useRef<SVGPolylineElement>(null);

	const fill = motionSafe(SPRINGS.drift, prefersReducedMotion);
	const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);

	useGSAP(() => {
		if (fillRef.current) {
			gsap.to(fillRef.current, {
				scaleX: step / Math.max(1, steps),
				duration: fill.duration,
				ease: fill.ease,
			});
		}
		if (remainingRef.current) {
			gsap.to(remainingRef.current, {
				opacity: complete ? 0 : 1,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
		if (doneRef.current) {
			gsap.to(doneRef.current, {
				opacity: complete ? 1 : 0,
				x: complete ? 0 : 4,
				duration: fade.duration,
				ease: fade.ease,
			});
		}

		// The tick draws itself once, slightly after the label arrives, so the
		// completion reads as an event rather than a state that was always there.
		const tick = tickRef.current;
		if (tick) {
			const length = tick.getTotalLength();
			gsap.set(tick, { strokeDasharray: length });
			gsap.to(tick, {
				strokeDashoffset: complete ? 0 : length,
				duration: prefersReducedMotion ? 0 : 0.3,
				delay: prefersReducedMotion || !complete ? 0 : 0.08,
				ease: EASE_SMOOTH_OUT,
			});
		}
	}, [step, steps, complete, fill, fade, prefersReducedMotion]);

	const estimate = words > 0;
	const readout = `${minutesLeft} min left`;
	const finish = `${doneLabel} · ${totalMinutes} min`;
	const valueText = estimate ? `${percent}% read, ${readout}` : `${percent}% read`;

	return (
		<StyledReadingRoot>
			<StyledReadingTrack
				role="progressbar"
				aria-label={label}
				aria-valuemin={0}
				aria-valuemax={steps}
				aria-valuenow={step}
				aria-valuetext={valueText}
			>
				<StyledReadingFill ref={fillRef} style={{ transform: 'scaleX(0)' }} />
			</StyledReadingTrack>

			{estimate ? (
				<StyledReadingReadout aria-hidden="true">
					<span data-ghost>{finish}</span>

					<StyledReadingRemaining ref={remainingRef}>{readout}</StyledReadingRemaining>

					<StyledReadingDone ref={doneRef} style={{ opacity: 0 }}>
						<svg width="12" height="12" viewBox="0 0 256 256" fill="none" aria-hidden="true">
							<polyline
								ref={tickRef}
								points="216 72 104 184 48 128"
								stroke="currentColor"
								strokeWidth="16"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						{finish}
					</StyledReadingDone>
				</StyledReadingReadout>
			) : null}
		</StyledReadingRoot>
	);
}

export default ReadingProgress;
