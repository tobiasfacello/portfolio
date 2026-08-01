//! React
import { useId, useRef } from 'react';

//? Variants
import type { ProgressSize, ProgressTone } from '../shared/variants';
import type { AriaAttributes } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledProgressRoot,
	StyledProgressHeader,
	StyledProgressLabel,
	StyledProgressReadout,
	StyledProgressTrack,
	StyledProgressClip,
	StyledProgressFill,
	StyledProgressSweep,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type ProgressBarProps = {
	size?: ProgressSize;
	tone?: ProgressTone;
	/** `null` puts the bar in its indeterminate state. */
	value: number | null;
	max?: number;
	label?: string;
	pendingLabel?: string;
	completeLabel?: string;
};

function ProgressBar({
	size = 'md',
	tone = 'default',
	value,
	max = 100,
	label = 'Progress',
	pendingLabel = 'Working',
	completeLabel = 'Complete',
}: ProgressBarProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const labelId = useId();

	const fillRef = useRef<HTMLSpanElement>(null);
	const sweepRef = useRef<HTMLSpanElement>(null);
	const pendingRef = useRef<HTMLSpanElement>(null);
	const percentRef = useRef<HTMLSpanElement>(null);

	const indeterminate = value === null;
	const fraction = value === null || max <= 0 ? 0 : Math.min(1, Math.max(0, value / max));
	const percent = Math.round(fraction * 100);
	const complete = !indeterminate && fraction >= 1;

	// An indeterminate bar has no position to report, so it reports nothing
	// rather than lying with a zero.
	const measured: AriaAttributes = indeterminate
		? {}
		: {
				'aria-valuenow': Math.round(fraction * max * 100) / 100,
				'aria-valuetext': `${percent}%`,
			};

	const fill = motionSafe(SPRINGS.drift, prefersReducedMotion);
	const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);

	useGSAP(() => {
		if (fillRef.current) {
			gsap.to(fillRef.current, {
				scaleX: indeterminate ? 0 : fraction,
				duration: fill.duration,
				ease: fill.ease,
			});
		}

		if (pendingRef.current) {
			gsap.to(pendingRef.current, {
				opacity: indeterminate ? 1 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		}

		if (percentRef.current) {
			gsap.to(percentRef.current, {
				opacity: indeterminate ? 0 : 1,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
	}, [indeterminate, fraction, fill, fade]);

	// The sweep only exists while the bar is indeterminate. Under reduced motion
	// the track simply stays empty — the pending label still carries the state.
	useGSAP(() => {
		const sweep = sweepRef.current;
		if (!sweep || !indeterminate || prefersReducedMotion) return;

		const tween = gsap.fromTo(
			sweep,
			{ xPercent: -100, opacity: 0 },
			{
				xPercent: 250,
				opacity: 1,
				duration: 1.25,
				ease: 'power1.inOut',
				repeat: -1,
			},
		);

		return () => {
			tween.kill();
		};
	}, [indeterminate, prefersReducedMotion]);

	return (
		<StyledProgressRoot>
			<StyledProgressHeader>
				<StyledProgressLabel id={labelId}>{label}</StyledProgressLabel>

				<StyledProgressReadout aria-hidden="true">
					<span ref={pendingRef} style={{ opacity: indeterminate ? 1 : 0 }}>
						{pendingLabel}
					</span>
					<span ref={percentRef} style={{ opacity: indeterminate ? 0 : 1 }}>
						{percent}%
					</span>
				</StyledProgressReadout>
			</StyledProgressHeader>

			<StyledProgressTrack
				role="progressbar"
				aria-labelledby={labelId}
				aria-valuemin={0}
				aria-valuemax={max}
				{...measured}
			>
				<StyledProgressClip $size={size}>
					<StyledProgressFill $tone={tone}
						ref={fillRef}
						aria-hidden="true"
						style={{ transform: `scaleX(${indeterminate ? 0 : fraction})` }}
					/>
					{indeterminate && !prefersReducedMotion ? (
						<StyledProgressSweep $tone={tone} ref={sweepRef} aria-hidden="true" />
					) : null}
				</StyledProgressClip>
			</StyledProgressTrack>

			<StyledVisuallyHidden aria-live="polite">
				{complete ? completeLabel : indeterminate ? pendingLabel : ''}
			</StyledVisuallyHidden>
		</StyledProgressRoot>
	);
}

export default ProgressBar;
