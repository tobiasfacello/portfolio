//! React
import { useEffect, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useValueFlash, type FlashDirection } from './useValueFlash';

//? Lib
import { SPRINGS, spring, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledFlashRoot,
	StyledFlashTint,
	StyledFlashDigits,
	StyledFlashGlyph,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const ROLL = spring({ stiffness: 460, damping: 32, mass: 0.55 });
const LIFT = spring({ stiffness: 380, damping: 26, mass: 0.7 });
/** Leaving is quicker than arriving — the old value is no longer information. */
const DROP = { duration: 0.14, ease: 'power2.in' } as const;

const GLYPH: Record<FlashDirection, string> = {
	up: 'M128 68 L210 180 H46 Z',
	down: 'M128 188 L46 76 H210 Z',
};

type Frame = { id: number; text: string };

type RollFrameProps = {
	text: string;
	/** False once a newer value has arrived; the frame then animates out. */
	current: boolean;
	direction: FlashDirection | null;
	reducedMotion: boolean;
	animateIn: boolean;
	onExited: () => void;
};

function RollFrame({
	text,
	current,
	direction,
	reducedMotion,
	animateIn,
	onExited,
}: RollFrameProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const exited = useRef(onExited);
	exited.current = onExited;

	useGSAP(() => {
		const node = ref.current;
		if (!node || !animateIn) return;

		if (reducedMotion) {
			gsap.set(node, { opacity: 1, yPercent: 0, filter: 'blur(0px)' });
			return;
		}

		gsap.fromTo(
			node,
			{
				opacity: 0,
				yPercent: direction === 'down' ? -85 : 85,
				filter: 'blur(5px)',
			},
			{
				opacity: 1,
				yPercent: 0,
				filter: 'blur(0px)',
				duration: ROLL.duration,
				ease: ROLL.ease,
			},
		);
	}, [animateIn, direction, reducedMotion]);

	useGSAP(() => {
		const node = ref.current;
		if (!node || current) return;

		if (reducedMotion) {
			exited.current();
			return;
		}

		gsap.to(node, {
			opacity: 0,
			yPercent: direction === 'down' ? 70 : -70,
			filter: 'blur(4px)',
			duration: DROP.duration,
			ease: DROP.ease,
			onComplete: () => exited.current(),
		});
	}, [current, direction, reducedMotion]);

	return <span ref={ref}>{text}</span>;
}

export type ValueFlashProps = {
	value: number;
	format?: (value: number) => string;
	label?: string;
	hold?: number;
	/** Debounce before the value is announced, in ms. */
	announceAfter?: number;
};

function ValueFlash({
	value,
	format,
	label,
	hold = 900,
	announceAfter = 700,
}: ValueFlashProps) {
	const { direction, flashing } = useValueFlash(value, { hold });
	const prefersReducedMotion = usePrefersReducedMotion();

	const text = format ? format(value) : String(value);

	const rootRef = useRef<HTMLSpanElement>(null);
	const tintRef = useRef<HTMLSpanElement>(null);
	const glyphRef = useRef<SVGSVGElement>(null);

	const [frames, setFrames] = useState<Frame[]>([{ id: 0, text }]);

	useEffect(() => {
		setFrames((prev) => {
			const last = prev[prev.length - 1];
			if (last.text === text) return prev;
			return [last, { id: last.id + 1, text }];
		});
	}, [text]);

	// A value that changes several times a second would otherwise queue up a
	// backlog of announcements; only the value that stays put gets read out.
	const [settled, setSettled] = useState(text);
	useEffect(() => {
		const id = setTimeout(() => setSettled(text), announceAfter);
		return () => clearTimeout(id);
	}, [text, announceAfter]);

	const lift = motionSafe(flashing ? LIFT : SPRINGS.crossfade, prefersReducedMotion);

	useGSAP(() => {
		const node = rootRef.current;
		if (!node) return;

		gsap.to(node, {
			scale: prefersReducedMotion ? 1 : flashing ? 1.05 : 1,
			duration: lift.duration,
			ease: lift.ease,
		});
	}, [flashing, lift, prefersReducedMotion]);

	useGSAP(() => {
		const tint = tintRef.current;
		if (!tint) return;

		const tween = motionSafe(
			flashing ? SPRINGS.cell : { duration: 0.16, ease: 'power2.in' },
			prefersReducedMotion,
		);
		gsap.to(tint, {
			opacity: flashing ? 1 : 0,
			duration: tween.duration,
			ease: tween.ease,
		});
	}, [flashing, prefersReducedMotion]);

	useGSAP(() => {
		const glyph = glyphRef.current;
		if (!glyph) return;

		const visible = flashing && direction !== null;
		const tween = motionSafe(
			visible ? SPRINGS.pop : { duration: 0.16, ease: 'power2.in' },
			prefersReducedMotion,
		);

		gsap.to(glyph, {
			opacity: visible ? 1 : 0,
			scale: visible ? 1 : 0.4,
			yPercent: visible ? 0 : direction === 'up' ? 30 : -30,
			duration: tween.duration,
			ease: tween.ease,
		});
	}, [flashing, direction, prefersReducedMotion]);

	const dropFrame = (id: number) =>
		setFrames((prev) => (prev.length > 1 ? prev.filter((frame) => frame.id !== id) : prev));

	return (
		<StyledFlashRoot ref={rootRef} $direction={direction} $flashing={flashing}>
			{direction ? (
				<StyledFlashTint ref={tintRef} aria-hidden="true" $direction={direction} />
			) : null}

			<StyledFlashDigits aria-hidden="true">
				{frames.map((frame, index) => (
					<RollFrame
						key={frame.id}
						text={frame.text}
						current={index === frames.length - 1}
						direction={direction}
						reducedMotion={prefersReducedMotion}
						animateIn={frame.id > 0 && index === frames.length - 1}
						onExited={() => dropFrame(frame.id)}
					/>
				))}
			</StyledFlashDigits>

			<StyledFlashGlyph aria-hidden="true">
				<svg ref={glyphRef} viewBox="0 0 256 256" fill="currentColor" style={{ opacity: 0 }}>
					{direction ? <path d={GLYPH[direction]} /> : null}
				</svg>
			</StyledFlashGlyph>

			<StyledVisuallyHidden aria-live="polite">
				{label ? `${label}: ${settled}` : settled}
			</StyledVisuallyHidden>
		</StyledFlashRoot>
	);
}

export default ValueFlash;
