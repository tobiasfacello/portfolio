//! React
import { useEffect, useId, useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useHoldToConfirm } from './useHoldToConfirm';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import { StyledHoldButton, StyledHoldSweep, StyledHoldFaces, StyledHoldFace } from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type HoldToConfirmProps = {
	onConfirm: () => void;
	children: ReactNode;
	onAbort?: () => void;
	confirmLabel?: string;
	duration?: number;
	/** Returns to idle this long after confirming, in ms. 0 keeps it. */
	resetAfter?: number;
	steps?: number;
	releaseRate?: number;
	disabled?: boolean;
};

type FacesProps = {
	committed: boolean;
	confirmLabel: string;
	children: ReactNode;
	register: (index: number, node: HTMLSpanElement | null) => void;
	offset: number;
};

function Faces({ confirmLabel, children, register, offset }: FacesProps) {
	return (
		<StyledHoldFaces>
			<StyledHoldFace
				ref={(node) => register(offset, node)}
			>
				{children}
			</StyledHoldFace>
			<StyledHoldFace
				ref={(node) => register(offset + 1, node)}
				style={{ opacity: 0 }}
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.7"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M2.5 6.4 4.7 8.6 9.5 3.5" />
				</svg>
				{confirmLabel}
			</StyledHoldFace>
		</StyledHoldFaces>
	);
}

function HoldToConfirm({
	onConfirm,
	children,
	onAbort,
	confirmLabel = 'Confirmed',
	duration = 1800,
	resetAfter = 1600,
	steps = 20,
	releaseRate = 2.5,
	disabled = false,
}: HoldToConfirmProps) {
	const { bind, phase, reset } = useHoldToConfirm({
		onConfirm,
		onAbort,
		duration,
		steps,
		releaseRate,
		disabled,
	});

	const prefersReducedMotion = usePrefersReducedMotion();
	const hintId = useId();

	const committed = phase === 'committed';
	const seconds = Math.round(duration / 100) / 10;

	const sweepRef = useRef<HTMLSpanElement>(null);
	const swept = useRef({ value: 0 });
	// Four faces: the resting pair and the pair inside the sweep.
	const facesRef = useRef<(HTMLSpanElement | null)[]>([]);

	const register = (index: number, node: HTMLSpanElement | null) => {
		facesRef.current[index] = node;
	};

	useEffect(() => {
		if (phase !== 'committed' || resetAfter <= 0) return;
		const back = setTimeout(reset, resetAfter);
		return () => clearTimeout(back);
	}, [phase, resetAfter, reset]);

	/**
	 * The sweep is driven to its endpoint at the remaining rate rather than being
	 * stepped: filling is linear because it depicts elapsed time, while draining
	 * eases because it depicts the meter giving way.
	 */
	useGSAP(() => {
		const node = sweepRef.current;
		if (!node) return;

		const paint = () => {
			node.style.clipPath = `inset(0 ${(1 - swept.current.value) * 100}% 0 0)`;
		};

		gsap.killTweensOf(swept.current);

		if (prefersReducedMotion) {
			swept.current.value = phase === 'holding' || phase === 'committed' ? 1 : 0;
			paint();
			return;
		}

		const from = swept.current.value;

		if (phase === 'committed') {
			gsap.to(swept.current, { value: 1, duration: 0.12, ease: 'none', onUpdate: paint });
			return;
		}
		if (phase === 'holding') {
			gsap.to(swept.current, {
				value: 1,
				duration: (duration * (1 - from)) / 1000,
				ease: 'none',
				onUpdate: paint,
			});
			return;
		}

		gsap.to(swept.current, {
			value: 0,
			duration: (duration * from) / releaseRate / 1000,
			ease: EASE_SMOOTH_OUT,
			onUpdate: paint,
		});
	}, [phase, duration, releaseRate, prefersReducedMotion]);

	useGSAP(() => {
		const face = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		facesRef.current.forEach((node, i) => {
			if (!node) return;
			// Even indices are the resting label, odd are the confirmation.
			const isConfirm = i % 2 === 1;
			gsap.to(node, {
				opacity: isConfirm === committed ? 1 : 0,
				duration: face.duration,
				ease: face.ease,
			});
		});
	}, [committed, prefersReducedMotion]);

	return (
		<StyledHoldButton
			type="button"
			aria-disabled={disabled || committed}
			aria-describedby={hintId}
			{...bind}
		>
			<Faces committed={committed} confirmLabel={confirmLabel} register={register} offset={0}>
				{children}
			</Faces>

			<StyledHoldSweep ref={sweepRef} aria-hidden="true" style={{ clipPath: 'inset(0 100% 0 0)' }}>
				<Faces committed={committed} confirmLabel={confirmLabel} register={register} offset={2}>
					{children}
				</Faces>
			</StyledHoldSweep>

			<StyledVisuallyHidden id={hintId}>
				Press and hold for {seconds} seconds to confirm. Releasing early cancels and nothing
				happens.
			</StyledVisuallyHidden>

			<StyledVisuallyHidden role="status" aria-live="polite">
				{committed ? confirmLabel : ''}
			</StyledVisuallyHidden>
		</StyledHoldButton>
	);
}

export default HoldToConfirm;
