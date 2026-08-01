//! React
import { useMemo, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useExitList } from '../shared/useExitList';
import { usePresenceRoster, initials, type PresencePerson } from './usePresenceRoster';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledPresenceRoot,
	StyledPresenceRail,
	StyledPresenceTile,
	StyledPresenceWell,
	StyledPresenceImage,
	StyledOverflowChip,
	StyledOverflowButton,
	StyledPresenceList,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

type TileProps = {
	person: PresencePerson;
	index: number;
	step: number;
	size: number;
	zIndex: number;
	exiting: boolean;
	reducedMotion: boolean;
	onExited: () => void;
};

function PresenceTile({
	person,
	index,
	step,
	size,
	zIndex,
	exiting,
	reducedMotion,
	onExited,
}: TileProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const [failed, setFailed] = useState(false);

	const exited = useRef(onExited);
	exited.current = onExited;

	const slot = motionSafe(SPRINGS.cell, reducedMotion);

	useGSAP(() => {
		const node = ref.current;
		if (!node) return;

		if (exiting) {
			gsap.to(node, {
				opacity: 0,
				scale: reducedMotion ? 1 : 0.86,
				duration: slot.duration,
				ease: slot.ease,
				onComplete: () => exited.current(),
			});
			return;
		}

		// Position is animated rather than set, so an avatar leaving the middle of
		// the stack slides its neighbours across instead of teleporting them.
		gsap.to(node, {
			opacity: 1,
			scale: 1,
			x: index * step,
			duration: slot.duration,
			ease: slot.ease,
		});
	}, [exiting, index, step, slot, reducedMotion]);

	return (
		<StyledPresenceTile
			ref={ref}
			aria-hidden="true"
			$size={size}
			style={{
				zIndex,
				fontSize: Math.round(size * 0.34),
				opacity: 0,
				transform: `translateX(${index * step}px) scale(0.86)`,
			}}
		>
			<StyledPresenceWell>
				{initials(person.name)}

				{person.src && !failed ? (
					<StyledPresenceImage
						ref={imageRef}
						src={person.src}
						alt=""
						width={size}
						height={size}
						decoding="async"
						onLoad={() => {
							if (imageRef.current) {
								gsap.to(imageRef.current, {
									opacity: 1,
									duration: reducedMotion ? 0 : 0.24,
									ease: EASE_SMOOTH_OUT,
								});
							}
						}}
						onError={() => setFailed(true)}
					/>
				) : null}
			</StyledPresenceWell>
		</StyledPresenceTile>
	);
}

export type PresenceAvatarsProps = {
	people: PresencePerson[];
	max?: number;
	size?: number;
	/** How much each avatar overlaps the one before it, in px. */
	overlap?: number;
	label?: string;
	announceAfter?: number;
	onOverflowSelect?: (hidden: PresencePerson[]) => void;
};

function PresenceAvatars({
	people,
	max = 5,
	size = 28,
	overlap = 9,
	label = 'People here',
	announceAfter,
	onOverflowSelect,
}: PresenceAvatarsProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { ordered, visible, hidden, overflow, announcement } = usePresenceRoster({
		people,
		max,
		announceAfter,
	});

	const { entries, remove } = useExitList(visible, (person) => person.id);

	const railRef = useRef<HTMLDivElement>(null);
	const chipRef = useRef<HTMLSpanElement>(null);

	const slots = Math.max(1, max);
	const step = size - overlap;
	const chip = size + 8;

	const rail = useMemo(() => {
		if (visible.length === 0) return 0;
		return overflow > 0 ? visible.length * step + chip : (visible.length - 1) * step + size;
	}, [visible.length, overflow, step, chip, size]);

	const slot = motionSafe(SPRINGS.cell, prefersReducedMotion);

	useGSAP(() => {
		if (!railRef.current) return;
		gsap.to(railRef.current, { width: rail, duration: slot.duration, ease: slot.ease });
	}, [rail, slot]);

	useGSAP(() => {
		if (!chipRef.current) return;
		gsap.to(chipRef.current, {
			opacity: overflow > 0 ? 1 : 0,
			scale: overflow > 0 ? 1 : 0.86,
			x: visible.length * step,
			duration: slot.duration,
			ease: slot.ease,
		});
	}, [overflow, visible.length, step, slot]);

	const chipCount = `+${Math.min(overflow, 99)}`;
	const ChipTag = onOverflowSelect ? StyledOverflowButton : StyledOverflowChip;

	return (
		<StyledPresenceRoot role="group" aria-label={label}>
			<StyledPresenceRail ref={railRef} $size={size} style={{ width: rail }}>
				{entries.map((entry, i) => (
					<PresenceTile
						key={entry.key}
						person={entry.item}
						index={i}
						step={step}
						size={size}
						zIndex={slots - i}
						exiting={entry.exiting}
						reducedMotion={prefersReducedMotion}
						onExited={() => remove(entry.key)}
					/>
				))}

				{overflow > 0 ? (
					<ChipTag
						ref={chipRef as React.Ref<HTMLSpanElement & HTMLButtonElement>}
						$width={chip}
						$size={size}
						style={{ zIndex: 0, opacity: 0 }}
						{...(onOverflowSelect
							? {
									type: 'button' as const,
									onClick: () => onOverflowSelect(hidden),
									'aria-label': `Show ${overflow} more`,
								}
							: { 'aria-hidden': true })}
					>
						<span aria-hidden="true">{chipCount}</span>
					</ChipTag>
				) : null}
			</StyledPresenceRail>

			{/* The names are the real content; the avatars are decoration. */}
			<StyledPresenceList>
				{ordered.map((person) => (
					<li key={person.id}>{person.name}</li>
				))}
			</StyledPresenceList>

			<StyledVisuallyHidden role="status" aria-live="polite" aria-atomic="true">
				{announcement}
			</StyledVisuallyHidden>
		</StyledPresenceRoot>
	);
}

export default PresenceAvatars;
