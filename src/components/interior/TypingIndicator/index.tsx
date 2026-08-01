//! React
import { useEffect, useMemo, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { usePresence } from '../../../hooks/usePresence';
import { describeTypists, SEND_MS } from './useTypingPresence';

//? Lib
import { SPRINGS, spring, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledTypingRoot,
	StyledBubbleSlot,
	StyledBubble,
	StyledDot,
	StyledTypingLabelSlot,
	StyledTypingLabel,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

/** One full pass of the wave across the three dots, in seconds. */
const WAVE_DURATION = 1.25;
const SURFACE = spring({ stiffness: 380, damping: 30, mass: 0.8 });

export type TypingIndicatorProps = {
	typists: string[];
	/** Plays the bubble's fly-away instead of its normal exit. */
	sending?: boolean;
	/** Names shown before collapsing into "and N others". */
	max?: number;
	size?: number;
	showLabel?: boolean;
	/** Debounce before the roster is announced, in ms. */
	announceAfter?: number;
};

function TypingIndicator({
	typists,
	sending = false,
	max = 2,
	size = 34,
	showLabel = true,
	announceAfter = 700,
}: TypingIndicatorProps) {
	const prefersReducedMotion = usePrefersReducedMotion();

	const label = useMemo(() => describeTypists(typists, max), [typists, max]);
	const active = typists.length > 0;

	const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);
	const labelRef = useRef<HTMLSpanElement>(null);

	const width = Math.round(size * 2);
	const dot = Math.round(size * 0.23);
	const gap = Math.round(size * 0.15);
	const radius = Math.round(size * 0.47);

	const surface = motionSafe(SURFACE, prefersReducedMotion);

	const { isMounted, ref: bubbleRef } = usePresence<HTMLDivElement>(active, {
		enter: (element, { reducedMotion }) =>
			gsap.fromTo(
				element,
				{ opacity: 0, scale: reducedMotion ? 1 : 0.74 },
				{
					opacity: 1,
					scale: 1,
					duration: reducedMotion ? 0 : surface.duration,
					ease: surface.ease,
				},
			),
		exit: (element, { reducedMotion }) =>
			gsap.to(element, {
				opacity: 0,
				scale: reducedMotion ? 1 : 0.4,
				duration: reducedMotion ? 0 : 0.26,
				ease: EASE_SMOOTH_OUT,
			}),
	});

	// Sending is not an exit — the bubble is still on screen, it is leaving under
	// its own power, so it shrinks away faster and on a different curve.
	useGSAP(() => {
		const bubble = bubbleRef.current;
		if (!bubble || !isMounted) return;

		if (sending && !prefersReducedMotion) {
			gsap.to(bubble, {
				opacity: 0,
				scale: 0.45,
				duration: SEND_MS / 1000,
				ease: 'power2.in',
			});
		}
	}, [sending, isMounted, prefersReducedMotion]);

	/**
	 * The wave is one tween driving all three dots, so they can never drift out
	 * of phase with each other the way three independent loops would.
	 */
	useGSAP(() => {
		if (!isMounted || !active) return;

		const dots = dotsRef.current.filter(Boolean) as HTMLSpanElement[];
		if (dots.length === 0) return;

		if (prefersReducedMotion) {
			gsap.set(dots, { scale: 1, opacity: 0.8 });
			return;
		}

		const wave = { position: 0 };
		const tween = gsap.to(wave, {
			position: 3,
			duration: WAVE_DURATION,
			ease: 'none',
			repeat: -1,
			onUpdate: () => {
				dots.forEach((node, index) => {
					let distance = (wave.position - index) % 3;
					if (distance < 0) distance += 3;
					if (distance > 1.5) distance -= 3;
					const lift = Math.max(0, 1 - Math.abs(distance));

					gsap.set(node, {
						scale: 0.74 + lift * 0.26,
						opacity: 0.32 + lift * 0.68,
					});
				});
			},
		});

		return () => {
			tween.kill();
		};
	}, [isMounted, active, prefersReducedMotion]);

	useGSAP(() => {
		const node = labelRef.current;
		if (!node) return;

		const visible = Boolean(label) && !sending;
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);

		gsap.to(node, {
			opacity: visible ? 1 : 0,
			y: visible ? 0 : 7,
			duration: fade.duration,
			ease: fade.ease,
		});
	}, [label, sending, prefersReducedMotion]);

	const [announced, setAnnounced] = useState(label);
	useEffect(() => {
		const timer = setTimeout(() => setAnnounced(label), announceAfter);
		return () => clearTimeout(timer);
	}, [label, announceAfter]);

	return (
		<StyledTypingRoot $size={size}>
			<StyledBubbleSlot $width={width} $size={size}>
				{isMounted ? (
					<StyledBubble ref={bubbleRef} aria-hidden="true" $radius={radius} $gap={gap}>
						{[0, 1, 2].map((i) => (
							<StyledDot
								key={i}
								ref={(node) => {
									dotsRef.current[i] = node;
								}}
								$size={dot}
							/>
						))}
					</StyledBubble>
				) : null}
			</StyledBubbleSlot>

			{showLabel ? (
				<StyledTypingLabelSlot $height={Math.round(size * 0.6)}>
					<StyledTypingLabel ref={labelRef} aria-hidden="true" style={{ opacity: 0 }}>
						{label}
					</StyledTypingLabel>
				</StyledTypingLabelSlot>
			) : null}

			<StyledVisuallyHidden role="status" aria-live="polite" aria-atomic="true">
				{announced}
			</StyledVisuallyHidden>
		</StyledTypingRoot>
	);
}

export default TypingIndicator;
