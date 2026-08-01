//! React
import { useRef } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { usePresence } from '../../../hooks/usePresence';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//? Types
import type { Activity } from './useLiveActivity';

//* Styled
import {
	StyledActivitySlot,
	StyledActivityPill,
	StyledActivityGlyph,
	StyledActivitySpinner,
	StyledActivityText,
	StyledActivityTitle,
	StyledActivityDetail,
	StyledActivityTrack,
	StyledActivityFill,
	StyledActivityAction,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type LiveActivityProps = {
	activity: Activity | null;
	label?: string;
};

function LiveActivity({ activity, label = 'Background activity' }: LiveActivityProps) {
	const prefersReducedMotion = usePrefersReducedMotion();

	const spinnerRef = useRef<SVGSVGElement>(null);
	const fillRef = useRef<HTMLSpanElement>(null);
	const tickRef = useRef<SVGPathElement>(null);

	const { isMounted, ref } = usePresence<HTMLDivElement>(activity !== null, {
		enter: (element, { reducedMotion }) =>
			gsap.fromTo(
				element,
				{ opacity: 0, scale: reducedMotion ? 1 : 0.9, y: reducedMotion ? 0 : 8 },
				{
					opacity: 1,
					scale: 1,
					y: 0,
					duration: reducedMotion ? 0 : SPRINGS.settle.duration,
					ease: SPRINGS.settle.ease,
				},
			),
		exit: (element, { reducedMotion }) =>
			gsap.to(element, {
				opacity: 0,
				scale: reducedMotion ? 1 : 0.94,
				y: reducedMotion ? 0 : 6,
				duration: reducedMotion ? 0 : 0.16,
				ease: 'power2.in',
			}),
	});

	const phase = activity?.phase ?? 'running';
	const progress = activity?.progress;

	useGSAP(() => {
		const node = spinnerRef.current;
		if (!node) return;

		gsap.killTweensOf(node);
		if (phase !== 'running' || prefersReducedMotion) {
			gsap.set(node, { rotate: 0 });
			return;
		}
		const tween = gsap.to(node, { rotate: 360, duration: 0.85, ease: 'none', repeat: -1 });
		return () => {
			tween.kill();
		};
	}, [phase, isMounted, prefersReducedMotion]);

	useGSAP(() => {
		const node = fillRef.current;
		if (!node) return;
		const fill = motionSafe(SPRINGS.drift, prefersReducedMotion);
		gsap.to(node, {
			scaleX: progress ?? 0,
			duration: fill.duration,
			ease: fill.ease,
		});
	}, [progress, isMounted, prefersReducedMotion]);

	useGSAP(() => {
		const tick = tickRef.current;
		if (!tick) return;
		const length = tick.getTotalLength();
		gsap.set(tick, { strokeDasharray: length });
		gsap.to(tick, {
			strokeDashoffset: phase === 'success' ? 0 : length,
			duration: prefersReducedMotion ? 0 : 0.3,
			ease: EASE_SMOOTH_OUT,
		});
	}, [phase, isMounted, prefersReducedMotion]);

	return (
		<StyledActivitySlot>
			{isMounted && activity ? (
				<StyledActivityPill ref={ref} role="group" aria-label={label} style={{ position: 'relative' }}>
					<StyledActivityGlyph $phase={phase} aria-hidden="true">
						{phase === 'running' ? (
							<StyledActivitySpinner viewBox="0 0 16 16" fill="none" ref={spinnerRef}>
								<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
								<path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
							</StyledActivitySpinner>
						) : phase === 'success' ? (
							<svg viewBox="0 0 16 16" width="16" height="16" fill="none">
								<path
									ref={tickRef}
									d="M4 8.4 6.9 11.3 12 4.9"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						) : (
							<svg viewBox="0 0 16 16" width="16" height="16" fill="none">
								<path d="M8 4v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
								<circle cx="8" cy="12" r="1" fill="currentColor" />
							</svg>
						)}
					</StyledActivityGlyph>

					<StyledActivityText>
						<StyledActivityTitle>{activity.title}</StyledActivityTitle>
						{activity.detail ? (
							<StyledActivityDetail>{activity.detail}</StyledActivityDetail>
						) : null}
					</StyledActivityText>

					{activity.action ? (
						<StyledActivityAction type="button" onClick={activity.action.onClick}>
							{activity.action.label}
						</StyledActivityAction>
					) : null}

					{progress !== null && progress !== undefined ? (
						<StyledActivityTrack aria-hidden="true">
							<StyledActivityFill ref={fillRef} style={{ transform: 'scaleX(0)' }} />
						</StyledActivityTrack>
					) : null}

					<StyledVisuallyHidden role="status" aria-live="polite">
						{`${activity.title}${activity.detail ? `, ${activity.detail}` : ''}`}
					</StyledVisuallyHidden>
				</StyledActivityPill>
			) : null}
		</StyledActivitySlot>
	);
}

export default LiveActivity;
