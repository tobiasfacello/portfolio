//! React
import { useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { usePressDepth } from './usePressDepth';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import { StyledPressRoot, StyledPressBase, StyledPressCap } from './styled';

export type PressDepthProps = {
	children: ReactNode;
	/** How far the cap travels, in px. Also the height of the bottom lip. */
	depth?: number;
	/** Maximum lean toward the pointer, in degrees. */
	tilt?: number;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	'aria-label'?: string;
};

function PressDepth({
	children,
	depth = 4,
	tilt = 7,
	disabled = false,
	type = 'button',
	onClick,
	'aria-label': ariaLabel,
}: PressDepthProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { pressed, origin, ref, bind } = usePressDepth({ disabled });
	const capRef = useRef<HTMLSpanElement>(null);

	// Keyboard presses have no pointer position, so they push straight down
	// instead of inventing a lean.
	const lean = pressed && origin && !prefersReducedMotion ? origin : null;
	const press = motionSafe(SPRINGS.cell, prefersReducedMotion);

	useGSAP(() => {
		const cap = capRef.current;
		if (!cap) return;

		gsap.to(cap, {
			y: pressed ? depth : 0,
			rotateX: lean ? -lean.y * tilt : 0,
			rotateY: lean ? lean.x * tilt : 0,
			transformPerspective: 340,
			duration: press.duration,
			ease: press.ease,
		});
	}, [pressed, lean, depth, tilt, press]);

	return (
		<StyledPressRoot
			ref={ref as React.Ref<HTMLButtonElement>}
			type={type}
			disabled={disabled}
			aria-label={ariaLabel}
			$depth={depth}
			onClick={onClick}
			{...bind}
		>
			<StyledPressBase aria-hidden="true" $depth={depth} />
			<StyledPressCap ref={capRef}>{children}</StyledPressCap>
		</StyledPressRoot>
	);
}

export default PressDepth;
