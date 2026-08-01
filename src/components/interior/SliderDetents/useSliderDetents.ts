import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const THUMB = 18;

const plain = (value: number) => String(value);

/** Kills floating-point dust so a detent compares equal to the value on it. */
function tidy(value: number) {
	return Math.round(value * 1e6) / 1e6;
}

export type SliderDetent = { value: number; label?: string };

const NONE: readonly (number | SliderDetent)[] = [];

export type UseSliderDetentsOptions = {
	value: number;
	onValueChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	detents?: readonly (number | SliderDetent)[];
	/** Radius within which a detent captures the thumb, in value units. */
	pull?: number;
	thumbSize?: number;
	disabled?: boolean;
	haptic?: boolean;
	format?: (value: number) => string;
};

/**
 * A slider with magnetic detents.
 *
 * Within `pull` of a marked value the thumb snaps to it exactly, so meaningful
 * settings — zero, a default, a midpoint — are easy to hit and hard to miss by
 * one. Everything between them still moves in ordinary steps, so the control
 * does not become a segmented picker. A short haptic fires on *crossing* into a
 * detent, not on every value change, which is what makes the notches feel
 * physical rather than noisy.
 */
export function useSliderDetents({
	value,
	onValueChange,
	min = 0,
	max = 100,
	step = 1,
	detents = NONE,
	pull,
	thumbSize = THUMB,
	disabled = false,
	haptic = true,
	format = plain,
}: UseSliderDetentsOptions) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);

	const list = useMemo<SliderDetent[]>(
		() => detents.map((d) => (typeof d === 'number' ? { value: d } : d)),
		[detents],
	);

	const range = max - min;
	const grab = pull ?? range * 0.045;

	const emit = useRef(onValueChange);
	emit.current = onValueChange;
	const emitted = useRef(value);
	emitted.current = value;

	const activeDetent = useMemo(
		() => list.findIndex((d) => tidy(d.value) === tidy(value)),
		[list, value],
	);

	const marked = useRef(activeDetent);
	const held = useRef(false);

	const commit = useCallback(
		(next: number) => {
			const settled = Math.min(max, Math.max(min, tidy(next)));
			const index = list.findIndex((d) => tidy(d.value) === settled);
			// Only on entering a *different* detent — sliding along one is silent.
			if (index !== marked.current) {
				marked.current = index;
				if (haptic && index >= 0) navigator.vibrate?.(6);
			}
			if (settled !== emitted.current) {
				emitted.current = settled;
				emit.current(settled);
			}
		},
		[haptic, list, max, min],
	);

	const capture = useCallback(
		(clientX: number) => {
			const el = trackRef.current;
			if (!el || range <= 0) return null;
			const rect = el.getBoundingClientRect();
			// Travel excludes the thumb's own width, so its centre reaches both ends.
			const travel = rect.width - thumbSize;
			if (travel <= 0) return null;

			const ratio = (clientX - rect.left - thumbSize / 2) / travel;
			const raw = Math.min(max, Math.max(min, min + ratio * range));

			let index = -1;
			let nearest = grab;
			for (let i = 0; i < list.length; i += 1) {
				const distance = Math.abs(raw - list[i].value);
				if (distance <= nearest) {
					nearest = distance;
					index = i;
				}
			}
			if (index >= 0) return list[index].value;
			return min + Math.round((raw - min) / step) * step;
		},
		[grab, list, max, min, range, step, thumbSize],
	);

	const release = useCallback(() => {
		if (!held.current) return;
		held.current = false;
		setDragging(false);
	}, []);

	/** PageUp/PageDown jump between detents rather than by a fixed amount. */
	const toDetent = useCallback(
		(direction: number) => {
			const sorted = list.map((d) => d.value).sort((a, b) => a - b);
			const forward = sorted.find((d) => d > value + 1e-6);
			let backward: number | undefined;
			for (let i = sorted.length - 1; i >= 0; i -= 1) {
				if (sorted[i] < value - 1e-6) {
					backward = sorted[i];
					break;
				}
			}
			const target = direction > 0 ? forward : backward;
			commit(target ?? (direction > 0 ? max : min));
		},
		[commit, list, max, min, value],
	);

	useEffect(() => {
		window.addEventListener('blur', release);
		return () => window.removeEventListener('blur', release);
	}, [release]);

	const detentLabel = list[activeDetent]?.label;
	const valueText = detentLabel ? `${format(value)}, ${detentLabel}` : format(value);
	const percent = range > 0 ? Math.min(1, Math.max(0, (value - min) / range)) : 0;

	const onPointerDown = (event: React.PointerEvent) => {
		if (disabled) return;
		event.preventDefault();
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
		held.current = true;
		setDragging(true);
		const next = capture(event.clientX);
		if (next !== null) commit(next);
	};

	const onPointerMove = (event: React.PointerEvent) => {
		if (!held.current) return;
		const next = capture(event.clientX);
		if (next !== null) commit(next);
	};

	const onKeyDown = (event: React.KeyboardEvent) => {
		if (disabled) return;
		const big = Math.max(step, range / 10);
		let next: number | null = null;

		if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = value + step;
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = value - step;
		else if (event.key === 'Home') next = min;
		else if (event.key === 'End') next = max;
		else if (event.key === 'PageUp') {
			event.preventDefault();
			if (list.length > 0) return toDetent(1);
			next = value + big;
		} else if (event.key === 'PageDown') {
			event.preventDefault();
			if (list.length > 0) return toDetent(-1);
			next = value - big;
		}

		if (next === null) return;
		event.preventDefault();
		commit(next);
	};

	return {
		trackRef,
		dragging,
		percent,
		valueText,
		detents: list,
		activeDetent,
		trackProps: {
			ref: trackRef,
			role: 'slider' as const,
			tabIndex: disabled ? -1 : 0,
			'aria-valuemin': min,
			'aria-valuemax': max,
			'aria-valuenow': value,
			'aria-valuetext': valueText,
			'aria-disabled': disabled || undefined,
			// Vertical scrolling still belongs to the page.
			style: { touchAction: 'pan-y' as const },
			onPointerDown,
			onPointerMove,
			onPointerUp: release,
			onPointerCancel: release,
			onLostPointerCapture: release,
			onKeyDown,
			onBlur: release,
		},
	};
}
