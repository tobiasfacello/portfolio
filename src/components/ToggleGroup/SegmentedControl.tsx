//! React
import { useCallback, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

//? Lib
import { SPRINGS, motionSafe } from '../../lib/motion';

//* Styled
import {
	StyledSegmentedRoot,
	StyledSegmentedGrid,
	StyledSegmentLabel,
	StyledSegmentedThumb,
	StyledSegmentedMask,
	StyledSegmentedMaskRow,
	StyledSegmentedMaskLabel,
	StyledSegmentedHitGrid,
	StyledSegmentedButton,
} from './SegmentedControl.styled';
import { StyledVisuallyHidden } from '../interior/shared/styled';

export type SegmentedOption = {
	value: string;
	label: string;
	disabled?: boolean;
};

export type SegmentedControlProps = {
	options: SegmentedOption[];
	/** Accessible name for the group. */
	label: string;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
};

/**
 * A radio group that looks like a segmented control.
 *
 * The labels are rendered twice — once at rest, once inverted inside the thumb —
 * and the thumb clips the second copy. Because both copies sit at the same
 * coordinates, a label straddling the thumb's edge inverts exactly at that
 * edge, mid-glyph, instead of flipping colour a frame late.
 *
 * Complements `ToggleGroup`, which covers the simpler icon-pill case; this one
 * adds full radiogroup semantics and roving arrow-key navigation.
 */
function SegmentedControl({
	options,
	label,
	value,
	defaultValue,
	onValueChange,
}: SegmentedControlProps) {
	const count = Math.max(1, options.length);
	const columns = `repeat(${count}, minmax(0, 1fr))`;

	const [internal, setInternal] = useState(() => defaultValue ?? options[0]?.value ?? '');
	const [hovered, setHovered] = useState(-1);

	const controlled = value !== undefined;
	const current = controlled ? value : internal;
	const found = options.findIndex((o) => o.value === current);
	const index = found < 0 ? 0 : found;

	const buttons = useRef<(HTMLButtonElement | null)[]>([]);
	const thumbRef = useRef<HTMLDivElement>(null);
	const maskRef = useRef<HTMLDivElement>(null);
	const position = useRef({ value: index });

	const emit = useRef(onValueChange);
	emit.current = onValueChange;

	const prefersReducedMotion = usePrefersReducedMotion();

	useGSAP(() => {
		const move = motionSafe(SPRINGS.cell, prefersReducedMotion);

		const paint = () => {
			const p = position.current.value;
			if (thumbRef.current) gsap.set(thumbRef.current, { xPercent: p * 100 });
			// Equal and opposite, so the label row underneath appears stationary.
			if (maskRef.current) gsap.set(maskRef.current, { xPercent: p * -100 });
		};

		if (move.duration === 0) {
			position.current.value = index;
			paint();
			return;
		}

		const tween = gsap.to(position.current, {
			value: index,
			duration: move.duration,
			ease: move.ease,
			onUpdate: paint,
		});

		return () => {
			tween.kill();
		};
	}, [index, prefersReducedMotion]);

	const select = useCallback(
		(next: string) => {
			if (!controlled) setInternal(next);
			if (next !== current) emit.current?.(next);
		},
		[controlled, current],
	);

	// Arrow keys skip disabled options rather than stopping on them.
	const seek = useCallback(
		(from: number, dir: number) => {
			let i = from;
			for (let k = 0; k < count; k++) {
				i = (i + dir + count) % count;
				if (!options[i]?.disabled) return i;
			}
			return from;
		},
		[count, options],
	);

	const go = useCallback(
		(i: number) => {
			const option = options[i];
			if (!option || option.disabled) return;
			buttons.current[i]?.focus();
			select(option.value);
		},
		[options, select],
	);

	const onKeyDown = (e: React.KeyboardEvent, i: number) => {
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			go(seek(i, 1));
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			go(seek(i, -1));
		} else if (e.key === 'Home') {
			e.preventDefault();
			go(seek(count - 1, 1));
		} else if (e.key === 'End') {
			e.preventDefault();
			go(seek(0, -1));
		}
	};

	return (
		<StyledSegmentedRoot role="radiogroup" aria-label={label}>
			<StyledSegmentedGrid $columns={columns}>
				{options.map((option, i) => (
					<StyledSegmentLabel
						key={option.value}
						aria-hidden="true"
						$state={
							option.disabled
								? 'disabled'
								: hovered === i && i !== index
									? 'hovered'
									: 'idle'
						}
					>
						{option.label}
					</StyledSegmentLabel>
				))}

				<StyledSegmentedThumb ref={thumbRef} aria-hidden="true" $width={`${100 / count}%`}>
					<StyledSegmentedMask ref={maskRef}>
						<StyledSegmentedMaskRow $columns={columns} $width={`${count * 100}%`}>
							{options.map((option) => (
								<StyledSegmentedMaskLabel key={option.value}>
									{option.label}
								</StyledSegmentedMaskLabel>
							))}
						</StyledSegmentedMaskRow>
					</StyledSegmentedMask>
				</StyledSegmentedThumb>

				{/* Transparent hit targets on top; the visible labels are inert. */}
				<StyledSegmentedHitGrid $columns={columns} onPointerLeave={() => setHovered(-1)}>
					{options.map((option, i) => (
						<StyledSegmentedButton
							key={option.value}
							ref={(node) => {
								buttons.current[i] = node;
							}}
							type="button"
							role="radio"
							aria-checked={i === index}
							aria-disabled={option.disabled || undefined}
							tabIndex={i === index ? 0 : -1}
							onClick={() => !option.disabled && select(option.value)}
							onKeyDown={(e) => onKeyDown(e, i)}
							onPointerEnter={() => !option.disabled && setHovered(i)}
						>
							<StyledVisuallyHidden>{option.label}</StyledVisuallyHidden>
						</StyledSegmentedButton>
					))}
				</StyledSegmentedHitGrid>
			</StyledSegmentedGrid>
		</StyledSegmentedRoot>
	);
}

export default SegmentedControl;
