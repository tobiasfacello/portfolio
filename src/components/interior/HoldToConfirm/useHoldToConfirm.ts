import { useCallback, useEffect, useRef, useState } from 'react';

export type HoldPhase = 'idle' | 'holding' | 'releasing' | 'committed';

export type UseHoldToConfirmOptions = {
	onConfirm: () => void;
	onAbort?: () => void;
	duration?: number;
	steps?: number;
	/** How many times faster the progress drains than it fills. */
	releaseRate?: number;
	moveTolerance?: number;
	haptic?: boolean;
	disabled?: boolean;
};

/**
 * Press-and-hold confirmation with a draining meter.
 *
 * Unlike a plain long press, letting go does not reset instantly — the progress
 * drains back at `releaseRate`, so a brief slip does not throw away the hold,
 * while a deliberate release visibly undoes it. Progress is integrated from
 * frame deltas capped at 64ms, so a stutter or a backgrounded tab cannot leap
 * the meter toward completion.
 */
export function useHoldToConfirm({
	onConfirm,
	onAbort,
	duration = 1800,
	steps = 20,
	releaseRate = 2.5,
	moveTolerance = 10,
	haptic = true,
	disabled = false,
}: UseHoldToConfirmOptions) {
	const [step, setStep] = useState(0);
	const [phase, setPhase] = useState<HoldPhase>('idle');

	const phaseRef = useRef<HoldPhase>('idle');
	const down = useRef(false);
	const elapsed = useRef(0);
	const last = useRef(0);
	const raf = useRef(0);
	const origin = useRef<{ x: number; y: number } | null>(null);

	const confirm = useRef(onConfirm);
	confirm.current = onConfirm;
	const abort = useRef(onAbort);
	abort.current = onAbort;

	const move = useCallback((next: HoldPhase) => {
		phaseRef.current = next;
		setPhase(next);
	}, []);

	const reset = useCallback(() => {
		cancelAnimationFrame(raf.current);
		raf.current = 0;
		down.current = false;
		elapsed.current = 0;
		origin.current = null;
		setStep(0);
		move('idle');
	}, [move]);

	const begin = useCallback(
		(point?: { x: number; y: number }) => {
			if (disabled) return;
			if (phaseRef.current === 'committed' || phaseRef.current === 'holding') return;

			origin.current = point ?? null;
			down.current = true;
			move('holding');
			// A loop already draining is resumed, not restarted — that is what
			// makes a slip recoverable.
			if (raf.current) return;

			last.current = performance.now();

			const loop = (now: number) => {
				const dt = Math.min(64, now - last.current);
				last.current = now;
				elapsed.current += down.current ? dt : -dt * releaseRate;

				if (elapsed.current >= duration) {
					raf.current = 0;
					elapsed.current = duration;
					down.current = false;
					origin.current = null;
					setStep(steps);
					move('committed');
					if (haptic) navigator.vibrate?.(14);
					confirm.current();
					return;
				}

				if (elapsed.current <= 0) {
					raf.current = 0;
					elapsed.current = 0;
					origin.current = null;
					setStep(0);
					move('idle');
					return;
				}

				const s = Math.min(steps, Math.floor((elapsed.current / duration) * steps));
				setStep((prev) => (prev === s ? prev : s));
				raf.current = requestAnimationFrame(loop);
			};

			raf.current = requestAnimationFrame(loop);
		},
		[disabled, duration, steps, releaseRate, haptic, move],
	);

	const release = useCallback(() => {
		if (phaseRef.current !== 'holding') return;
		down.current = false;
		origin.current = null;
		move('releasing');
		abort.current?.();
	}, [move]);

	useEffect(() => {
		const bail = () => release();
		const onVisibility = () => {
			if (document.hidden) release();
		};
		window.addEventListener('blur', bail);
		document.addEventListener('visibilitychange', onVisibility);
		return () => {
			window.removeEventListener('blur', bail);
			document.removeEventListener('visibilitychange', onVisibility);
			cancelAnimationFrame(raf.current);
			raf.current = 0;
		};
	}, [release]);

	const bind = {
		onPointerDown: (e: React.PointerEvent) => {
			if (e.pointerType === 'mouse' && e.button !== 0) return;
			e.currentTarget.setPointerCapture?.(e.pointerId);
			begin({ x: e.clientX, y: e.clientY });
		},
		onPointerMove: (e: React.PointerEvent) => {
			const from = origin.current;
			if (phaseRef.current !== 'holding' || !from) return;
			if (Math.hypot(e.clientX - from.x, e.clientY - from.y) > moveTolerance) release();
		},
		onPointerUp: release,
		onPointerCancel: release,
		onPointerLeave: release,
		onKeyDown: (e: React.KeyboardEvent) => {
			// Escape drains the meter immediately — a hard cancel, not a release.
			if (e.key === 'Escape') {
				if (phaseRef.current === 'holding' || phaseRef.current === 'releasing') {
					e.preventDefault();
					reset();
				}
				return;
			}
			if (e.repeat) return;
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				begin();
			}
		},
		onKeyUp: (e: React.KeyboardEvent) => {
			if (e.key === ' ' || e.key === 'Enter') release();
		},
		onBlur: release,
		onClick: (e: React.MouseEvent) => {
			// The hold is the action; the click that ends it must never be one.
			e.preventDefault();
			if (phaseRef.current === 'committed') e.stopPropagation();
		},
		onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
	};

	return { bind, step, steps, phase, progress: step / steps, reset };
}
