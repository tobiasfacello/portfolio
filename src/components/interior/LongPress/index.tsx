//! React
import { useId, useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useLongPress } from './useLongPress';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import { StyledLongPressButton, StyledLongPressLabels, StyledLongPressFill } from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type LongPressButtonProps = {
	onLongPress: () => void;
	children: ReactNode;
	duration?: number;
	steps?: number;
	disabled?: boolean;
};

function LongPressButton({
	onLongPress,
	children,
	duration = 550,
	steps = 12,
	disabled = false,
}: LongPressButtonProps) {
	const hintId = useId();
	const prefersReducedMotion = usePrefersReducedMotion();
	const {
		bind,
		step,
		steps: cells,
		holding,
		fired,
	} = useLongPress({ onLongPress, duration, steps, disabled });

	const buttonRef = useRef<HTMLButtonElement>(null);
	const fillRef = useRef<HTMLSpanElement>(null);

	const progress = fired ? 1 : step / cells;

	useGSAP(() => {
		const node = fillRef.current;
		if (!node) return;

		const move = motionSafe(SPRINGS.cell, prefersReducedMotion);
		gsap.to(node, {
			clipPath: `inset(0 ${((1 - progress) * 100).toFixed(2)}% 0 0)`,
			duration: move.duration,
			ease: move.ease,
		});
	}, [progress, prefersReducedMotion]);

	// A single pulse on completion. It fires once, on the frame the action does.
	useGSAP(() => {
		const node = buttonRef.current;
		if (!node || !fired || prefersReducedMotion) return;

		const pop = SPRINGS.pop;
		const tween = gsap.fromTo(
			node,
			{ scale: 1 },
			{ scale: 1.045, duration: pop.duration / 2, ease: pop.ease, yoyo: true, repeat: 1 },
		);

		return () => {
			tween.kill();
		};
	}, [fired, prefersReducedMotion]);

	return (
		<StyledLongPressButton
			ref={buttonRef}
			type="button"
			aria-disabled={disabled}
			aria-describedby={hintId}
			$holding={holding}
			$fired={fired}
			{...bind}
		>
			<StyledLongPressLabels>
				<span>{children}</span>
				<StyledLongPressFill
					ref={fillRef}
					aria-hidden="true"
					style={{ clipPath: 'inset(0 100% 0 0)' }}
				>
					{children}
				</StyledLongPressFill>
			</StyledLongPressLabels>

			<StyledVisuallyHidden id={hintId}>
				Press and hold for {Math.round(duration / 100) / 10} seconds to confirm
			</StyledVisuallyHidden>
		</StyledLongPressButton>
	);
}

export default LongPressButton;
