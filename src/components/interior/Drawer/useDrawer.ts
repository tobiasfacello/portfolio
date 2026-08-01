import { useCallback, useEffect, useRef, useState } from 'react';

//! GSAP
import { gsap } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

//? Lib
import { spring } from '../../../lib/motion';

const DISCLOSE = spring({ stiffness: 150, damping: 27, mass: 1 });

/** Flick speed past which the drawer closes regardless of distance, in px/s. */
const FLICK_VELOCITY = 520;
/** Resistance applied when dragging the drawer further open than it can go. */
const RUBBER_BAND = 0.35;

export type DrawerSide = 'left' | 'right';

export type UseDrawerOptions = {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	side?: DrawerSide;
	width?: number;
	/** Fraction of the width that must be dragged away to dismiss. */
	dismissRatio?: number;
};

/**
 * Slide-over panel with a draggable edge.
 *
 * The drag is intentionally asymmetric: pulling the drawer closed tracks the
 * finger exactly, while pushing it further open is rubber-banded, because there
 * is nothing there to reach. A dismissal can be earned two ways — far enough or
 * fast enough — so a confident flick works without a long drag.
 */
export function useDrawer({
	open: controlled,
	defaultOpen = false,
	onOpenChange,
	side = 'right',
	width = 320,
	dismissRatio = 0.38,
}: UseDrawerOptions = {}) {
	const [uncontrolled, setUncontrolled] = useState(defaultOpen);
	const [dragging, setDragging] = useState(false);

	const open = controlled ?? uncontrolled;
	const sign = side === 'right' ? 1 : -1;
	const away = sign * (width + 24);

	const panelRef = useRef<HTMLDivElement>(null);
	const scrimRef = useRef<HTMLDivElement>(null);
	const offset = useRef(open ? 0 : away);
	const tween = useRef<gsap.core.Tween | null>(null);

	const changed = useRef(onOpenChange);
	changed.current = onOpenChange;

	const prefersReducedMotion = usePrefersReducedMotion();

	const setOpen = useCallback(
		(next: boolean) => {
			if (controlled === undefined) setUncontrolled(next);
			changed.current?.(next);
		},
		[controlled],
	);

	const close = useCallback(() => setOpen(false), [setOpen]);

	/** Writes the panel and scrim for a given offset. */
	const paint = useCallback((value: number) => {
		offset.current = value;
		if (panelRef.current) gsap.set(panelRef.current, { x: value });
		// The scrim tracks the drag, so the page behind brightens as you pull.
		if (scrimRef.current) {
			gsap.set(scrimRef.current, { opacity: 1 - Math.min(1, Math.abs(value) / width) });
		}
	}, [width]);

	const glide = useCallback(
		(to: number) => {
			tween.current?.kill();
			const state = { value: offset.current };
			tween.current = gsap.to(state, {
				value: to,
				duration: prefersReducedMotion ? 0 : DISCLOSE.duration,
				ease: DISCLOSE.ease,
				onUpdate: () => paint(state.value),
			});
		},
		[paint, prefersReducedMotion],
	);

	useEffect(() => {
		glide(open ? 0 : away);
		return () => {
			tween.current?.kill();
		};
	}, [open, away, glide]);

	const drag = useRef<{ pointerId: number; startX: number; startAt: number; lastX: number; lastAt: number } | null>(
		null,
	);

	const onPointerDown = useCallback(
		(event: React.PointerEvent) => {
			if (!open) return;
			tween.current?.kill();
			(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
			drag.current = {
				pointerId: event.pointerId,
				startX: event.clientX,
				startAt: performance.now(),
				lastX: event.clientX,
				lastAt: performance.now(),
			};
			setDragging(true);
		},
		[open],
	);

	const onPointerMove = useCallback(
		(event: React.PointerEvent) => {
			const state = drag.current;
			if (!state || event.pointerId !== state.pointerId) return;

			const delta = event.clientX - state.startX;
			const travel = sign * delta;
			// Closing direction tracks 1:1; the other way resists.
			paint(travel >= 0 ? sign * travel : sign * travel * RUBBER_BAND);

			state.lastX = event.clientX;
			state.lastAt = performance.now();
		},
		[paint, sign],
	);

	const endDrag = useCallback(
		(event: React.PointerEvent) => {
			const state = drag.current;
			if (!state || event.pointerId !== state.pointerId) return;
			drag.current = null;
			setDragging(false);

			const travel = sign * (event.clientX - state.startX);
			const elapsed = Math.max(1, performance.now() - state.lastAt);
			const velocity = (sign * (event.clientX - state.lastX)) / (elapsed / 1000);

			if (travel > width * dismissRatio || velocity > FLICK_VELOCITY) {
				close();
				return;
			}
			glide(0);
		},
		[sign, width, dismissRatio, close, glide],
	);

	return {
		open,
		side,
		width,
		dragging,
		setOpen,
		close,
		panelRef,
		scrimRef,
		gripProps: {
			onPointerDown,
			onPointerMove,
			onPointerUp: endDrag,
			onPointerCancel: endDrag,
		},
	};
}
