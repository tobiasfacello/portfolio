//! React
import { useId, useLayoutEffect, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useSliderDetents, type UseSliderDetentsOptions } from './useSliderDetents';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	THUMB_SIZE,
	StyledSliderRoot,
	StyledSliderHeader,
	StyledSliderLabel,
	StyledSliderReadout,
	StyledSliderTrack,
	StyledSliderRail,
	StyledSliderFill,
	StyledSliderDetent,
	StyledSliderThumb,
	StyledDetentLabels,
	StyledDetentLabel,
} from './styled';

export type SliderDetentsProps = UseSliderDetentsOptions & {
	label: string;
};

function SliderDetents({ label, ...options }: SliderDetentsProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const labelId = useId();

	const { trackRef, dragging, percent, valueText, detents, activeDetent, trackProps } =
		useSliderDetents({ ...options, thumbSize: THUMB_SIZE });

	const thumbRef = useRef<HTMLSpanElement>(null);
	const fillRef = useRef<HTMLSpanElement>(null);
	const [travel, setTravel] = useState(0);

	// The thumb travels in px, so the usable width has to be measured rather
	// than expressed as a percentage — otherwise it would overshoot both ends
	// by half its own width.
	useLayoutEffect(() => {
		const el = trackRef.current;
		if (!el) return;
		const read = () => setTravel(Math.max(0, el.getBoundingClientRect().width - THUMB_SIZE - 6));
		read();
		const observer = new ResizeObserver(read);
		observer.observe(el);
		return () => observer.disconnect();
	}, [trackRef]);

	useGSAP(() => {
		const carriage = motionSafe(SPRINGS.cell, prefersReducedMotion);
		const x = percent * travel;

		if (thumbRef.current) {
			// While dragging the thumb tracks the finger exactly; on release it
			// springs to the detent it landed on.
			gsap.to(thumbRef.current, {
				x,
				duration: dragging ? 0 : carriage.duration,
				ease: carriage.ease,
			});
		}
		if (fillRef.current) {
			gsap.to(fillRef.current, {
				width: x + THUMB_SIZE / 2,
				duration: dragging ? 0 : carriage.duration,
				ease: carriage.ease,
			});
		}
	}, [percent, travel, dragging, prefersReducedMotion]);

	useGSAP(() => {
		if (!thumbRef.current) return;
		const grab = motionSafe(SPRINGS.snap, prefersReducedMotion);
		gsap.to(thumbRef.current, {
			scale: dragging ? 1.12 : 1,
			duration: grab.duration,
			ease: grab.ease,
		});
	}, [dragging, prefersReducedMotion]);

	const min = options.min ?? 0;
	const max = options.max ?? 100;
	const span = max - min;

	return (
		<StyledSliderRoot>
			<StyledSliderHeader>
				<StyledSliderLabel id={labelId}>{label}</StyledSliderLabel>
				<StyledSliderReadout>{valueText}</StyledSliderReadout>
			</StyledSliderHeader>

			<StyledSliderTrack {...trackProps} aria-labelledby={labelId} $disabled={options.disabled}>
				<StyledSliderRail aria-hidden="true" />
				<StyledSliderFill ref={fillRef} aria-hidden="true" style={{ width: 0 }} />

				{detents.map((detent, i) => (
					<StyledSliderDetent
						key={detent.value}
						aria-hidden="true"
						$active={i === activeDetent}
						style={{ left: `calc(3px + ${THUMB_SIZE / 2}px + ${((detent.value - min) / span) * travel}px)` }}
					/>
				))}

				<StyledSliderThumb ref={thumbRef} aria-hidden="true" $dragging={dragging} />
			</StyledSliderTrack>

			{detents.some((d) => d.label) ? (
				<StyledDetentLabels aria-hidden="true">
					{detents.map((detent) =>
						detent.label ? (
							<StyledDetentLabel
								key={detent.value}
								style={{
									left: `calc(3px + ${THUMB_SIZE / 2}px + ${((detent.value - min) / span) * travel}px)`,
								}}
							>
								{detent.label}
							</StyledDetentLabel>
						) : null,
					)}
				</StyledDetentLabels>
			) : null}
		</StyledSliderRoot>
	);
}

export default SliderDetents;
