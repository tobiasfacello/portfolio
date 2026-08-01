//! React
import { useRef } from 'react';

//? Variants
import type { ControlSize, ControlTone } from '../shared/variants';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import {
	useIconMorph,
	interpolatePath,
	type IconMorphSemantics,
	type IconMorphSlot,
	type UseIconMorphOptions,
} from './useIconMorph';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import { StyledMorphButton, StyledMorphIcon, StyledMorphLabels } from './styled';

export type IconMorphProps = UseIconMorphOptions & {
	/** The control's size. Distinct from `size`, which is the icon's px box. */
	controlSize?: ControlSize;
	tone?: ControlTone;
	size?: number;
	strokeWidth?: number;
	showLabel?: boolean;
	/** Which ARIA state the two positions represent. */
	semantics?: IconMorphSemantics;
	disabled?: boolean;
};

function IconMorph({
	controlSize = 'md',
	tone = 'default',
	size = 20,
	strokeWidth = 1.75,
	showLabel = false,
	semantics = 'label',
	disabled = false,
	...options
}: IconMorphProps) {
	const { index, slots, rotate, mode, label, labels, toggle } = useIconMorph(options);
	const prefersReducedMotion = usePrefersReducedMotion();

	const iconRef = useRef<HTMLSpanElement>(null);
	const pathsRef = useRef<(SVGPathElement | null)[]>([]);
	const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);
	const previousSlots = useRef<IconMorphSlot[]>(slots);

	const morph = motionSafe(SPRINGS.cell, prefersReducedMotion);
	const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);

	useGSAP(() => {
		slots.forEach((slot, i) => {
			const path = pathsRef.current[i];
			if (!path) return;

			const from = previousSlots.current[i]?.d ?? slot.d;

			if (from === slot.d || morph.duration === 0) {
				path.setAttribute('d', slot.d);
			} else {
				const progress = { t: 0 };
				gsap.to(progress, {
					t: 1,
					duration: morph.duration,
					ease: morph.ease,
					onUpdate: () => path.setAttribute('d', interpolatePath(from, slot.d, progress.t)),
					onComplete: () => path.setAttribute('d', slot.d),
				});
			}

			gsap.to(path, {
				opacity: slot.visible ? 1 : 0,
				duration: morph.duration,
				ease: morph.ease,
			});
		});

		previousSlots.current = slots;

		if (iconRef.current) {
			gsap.to(iconRef.current, {
				rotate,
				duration: morph.duration,
				ease: morph.ease,
			});
		}
	}, [slots, rotate, morph]);

	useGSAP(() => {
		labels.forEach((_, i) => {
			const node = labelsRef.current[i];
			if (!node) return;

			const active = i === index;
			gsap.to(node, {
				opacity: active ? 1 : 0,
				y: active ? 0 : i < index ? -3 : 3,
				duration: fade.duration,
				ease: fade.ease,
			});
		});
	}, [index, labels, fade]);

	const stroked = mode === 'stroke';

	return (
		<StyledMorphButton $size={controlSize} $tone={tone}
			type="button"
			disabled={disabled}
			onClick={toggle}
			aria-label={label}
			aria-pressed={semantics === 'pressed' ? index === 1 : undefined}
			aria-expanded={semantics === 'expanded' ? index === 1 : undefined}
			$showLabel={showLabel}
		>
			<StyledMorphIcon ref={iconRef} aria-hidden="true" $size={size}>
				<svg
					viewBox="0 0 24 24"
					width={size}
					height={size}
					focusable="false"
					fill={stroked ? 'none' : 'currentColor'}
					stroke={stroked ? 'currentColor' : 'none'}
					strokeWidth={stroked ? strokeWidth : undefined}
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					{slots.map((slot, i) => (
						<path
							key={slot.key}
							ref={(node) => {
								pathsRef.current[i] = node;
							}}
							d={slot.d}
							opacity={slot.visible ? 1 : 0}
						/>
					))}
				</svg>
			</StyledMorphIcon>

			{showLabel ? (
				<StyledMorphLabels aria-hidden="true">
					{labels.map((text, i) => (
						<span
							key={text}
							ref={(node) => {
								labelsRef.current[i] = node;
							}}
							style={{ opacity: i === index ? 1 : 0 }}
						>
							{text}
						</span>
					))}
				</StyledMorphLabels>
			) : null}
		</StyledMorphButton>
	);
}

export default IconMorph;
