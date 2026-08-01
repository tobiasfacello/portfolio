import { useCallback, useEffect, useRef, useState } from 'react';

export type UseLongPressOptions = {
	onLongPress: () => void;
	/** How long the press must be held, in ms. */
	duration?: number;
	/** Progress is quantised into this many steps. */
	steps?: number;
	/** Movement past this distance abandons the press, in px. */
	moveTolerance?: number;
	haptic?: boolean;
	disabled?: boolean;
	onCancel?: () => void;
};

type Phase = 'idle' | 'holding' | 'fired';

/**
 * A press-and-hold gesture that knows every way it can be abandoned.
 *
 * Lifting, dragging away, losing the window, hiding the tab and pressing Escape
 * all cancel it. Progress is driven by wall-clock time rather than accumulated
 * frames, so a stutter cannot make the hold take longer than it promised. After
 * firing, the following click is swallowed — the hold was the action, and the
 * click that ends it must not trigger a second one.
 */
export function useLongPress({
	onLongPress,
	duration = 550,
	steps = 12,
	moveTolerance = 8,
	haptic = true,
	disabled = false,
	onCancel,
}: UseLongPressOptions) {
	const cells = Math.max(1, Math.round(steps));

	const [step, setStep] = useState(0);
	const [holding, setHolding] = useState(false);

	const phase = useRef<Phase>('idle');
	const raf = useRef(0);
	const startedAt = useRef(0);
	const origin = useRef<{ x: number; y: number } | null>(null);
	const settle = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fire = useRef(onLongPress);
	fire.current = onLongPress;
	const cancelled = useRef(onCancel);
	cancelled.current = onCancel;

	const reset = useCallback(() => {
		cancelAnimationFrame(raf.current);
		raf.current = 0;
		if (settle.current) {
			clearTimeout(settle.current);
			settle.current = null;
		}
		origin.current = null;
		phase.current = 'idle';
		setHolding(false);
		setStep(0);
	}, []);

	const end = useCallback(() => {
		if (phase.current !== 'holding') return;
		reset();
		cancelled.current?.();
	}, [reset]);

	const begin = useCallback(
		(point?: { x: number; y: number }) => {
			if (disabled || phase.current !== 'idle') return;

			phase.current = 'holding';
			origin.current = point ?? null;
			startedAt.current = performance.now();
			setHolding(true);
			setStep(0);

			const tick = (now: number) => {
				const p = Math.min(1, (now - startedAt.current) / duration);

				const s = Math.floor(p * cells);
				setStep((prev) => (prev === s ? prev : s));

				if (p < 1) {
					raf.current = requestAnimationFrame(tick);
					return;
				}

				raf.current = 0;
				phase.current = 'fired';
				setStep(cells);
				if (haptic) navigator.vibrate?.(12);
				fire.current();

				// Hold the completed state briefly so the confirmation is seen.
				settle.current = setTimeout(() => {
					if (phase.current === 'fired') reset();
				}, 260);
			};

			raf.current = requestAnimationFrame(tick);
		},
		[disabled, duration, cells, haptic, reset],
	);

	useEffect(() => {
		const bail = () => end();
		const onVisibility = () => document.hidden && end();
		window.addEventListener('blur', bail);
		document.addEventListener('visibilitychange', onVisibility);
		return () => {
			window.removeEventListener('blur', bail);
			document.removeEventListener('visibilitychange', onVisibility);
			cancelAnimationFrame(raf.current);
			if (settle.current) clearTimeout(settle.current);
		};
	}, [end]);

	const bind = {
		onPointerDown: (e: React.PointerEvent) => {
			if (e.button !== 0 && e.pointerType === 'mouse') return;
			e.currentTarget.setPointerCapture?.(e.pointerId);
			begin({ x: e.clientX, y: e.clientY });
		},
		onPointerMove: (e: React.PointerEvent) => {
			const from = origin.current;
			if (phase.current !== 'holding' || !from) return;
			if (Math.hypot(e.clientX - from.x, e.clientY - from.y) > moveTolerance) {
				end();
			}
		},
		onPointerUp: end,
		onPointerCancel: end,
		onPointerLeave: end,
		onKeyDown: (e: React.KeyboardEvent) => {
			if (e.repeat) return;
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				begin();
			}
		},
		onKeyUp: (e: React.KeyboardEvent) => {
			if (e.key === ' ' || e.key === 'Enter') end();
			if (e.key === 'Escape') end();
		},
		onBlur: end,
		onClick: (e: React.MouseEvent) => {
			if (phase.current === 'fired') {
				e.preventDefault();
				e.stopPropagation();
			}
		},
		onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
	};

	return {
		bind,
		step,
		steps: cells,
		holding,
		fired: step === cells,
		progress: step / cells,
	};
}
