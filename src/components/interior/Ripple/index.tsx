//! React
import { useRef, type ReactNode } from 'react';

//? Variants
import type { ControlSize, ControlTone } from '../shared/variants';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useRipple, RIPPLE_BASE, type RippleSpec } from './useRipple';

//? Lib
import { EASE_SMOOTH_OUT } from '../../../lib/motion';

//* Styled
import {
	StyledRippleButton,
	StyledRippleLayer,
	StyledRippleSpot,
	StyledRippleLabel,
} from './styled';

/** Peak opacity of a ripple — low enough to tint rather than obscure the label. */
const TINT = 0.18;

type RippleSpotProps = {
	spec: RippleSpec;
	fadeDuration: number;
	reducedMotion: boolean;
};

/**
 * One ripple. It owns its own animation so a new press never restarts the
 * ripples already on screen.
 */
function RippleSpot({ spec, fadeDuration, reducedMotion }: RippleSpotProps) {
	const ref = useRef<HTMLSpanElement>(null);

	useGSAP(() => {
		const node = ref.current;
		if (!node) return;

		gsap.set(node, { scale: reducedMotion ? spec.scale : 0, opacity: 0 });
		// Bloom is linear: the ripple models a wavefront spreading at a constant
		// speed, so easing it would contradict what it depicts.
		gsap.to(node, {
			scale: spec.scale,
			duration: reducedMotion ? 0 : 0.5,
			ease: 'none',
		});
		gsap.to(node, { opacity: TINT, duration: reducedMotion ? 0 : 0.07, ease: 'none' });
	}, [reducedMotion, spec.scale]);

	useGSAP(() => {
		const node = ref.current;
		if (!node || !spec.released) return;

		gsap.to(node, {
			opacity: 0,
			duration: reducedMotion ? 0 : fadeDuration,
			ease: EASE_SMOOTH_OUT,
		});
	}, [spec.released, fadeDuration, reducedMotion]);

	return (
		<StyledRippleSpot
			ref={ref}
			style={{
				left: spec.x - RIPPLE_BASE / 2,
				top: spec.y - RIPPLE_BASE / 2,
				width: RIPPLE_BASE,
				height: RIPPLE_BASE,
			}}
		/>
	);
}

export type RippleProps = {
	size?: ControlSize;
	tone?: ControlTone;
	children: ReactNode;
	onPress?: () => void;
	disabled?: boolean;
	max?: number;
};

function Ripple({
	children,
	onPress,
	disabled = false,
	max = 4,
	size = 'md',
	tone = 'default',
}: RippleProps) {
	const { bind, ripples, fadeDuration } = useRipple({ disabled, max });
	const prefersReducedMotion = usePrefersReducedMotion();

	return (
		<StyledRippleButton $size={size} $tone={tone} type="button" disabled={disabled} onClick={onPress} {...bind}>
			<StyledRippleLayer aria-hidden="true">
				{ripples.map((spec) => (
					<RippleSpot
						key={spec.id}
						spec={spec}
						fadeDuration={fadeDuration}
						reducedMotion={prefersReducedMotion}
					/>
				))}
			</StyledRippleLayer>

			<StyledRippleLabel>{children}</StyledRippleLabel>
		</StyledRippleButton>
	);
}

export default Ripple;
