import { useCallback, useEffect, useMemo, useRef } from 'react';

//? Lib
import { gsap } from '../lib/gsap';

//? Types
import type { Tween } from '../lib/motion';

/**
 * A single animatable number that lives outside React state — the role
 * `useMotionValue` plays in the source components.
 *
 * Updates are pushed straight to subscribers on GSAP's ticker rather than
 * through a re-render, which is what lets a thumb track a spring at 120fps
 * without the component re-rendering once per frame.
 */
export type GsapValue = {
	get(): number;
	/** Jumps to `next` immediately, killing any running tween. */
	set(next: number): void;
	/** Animates to `next`; a zero-duration tween lands instantly. */
	animate(next: number, tween: Tween): gsap.core.Tween;
	/** Returns an unsubscribe function. */
	subscribe(listener: (value: number) => void): () => void;
	/** Stops the value where it currently sits. */
	stop(): void;
};

export function useGsapValue(initial: number): GsapValue {
	const state = useRef({ value: initial });
	const listeners = useRef(new Set<(value: number) => void>());
	const tween = useRef<gsap.core.Tween | null>(null);

	const notify = useCallback(() => {
		const { value } = state.current;
		listeners.current.forEach((listener) => listener(value));
	}, []);

	const value = useMemo<GsapValue>(
		() => ({
			get: () => state.current.value,

			set: (next) => {
				tween.current?.kill();
				tween.current = null;
				state.current.value = next;
				notify();
			},

			animate: (next, config) => {
				tween.current?.kill();
				tween.current = gsap.to(state.current, {
					value: next,
					duration: config.duration,
					ease: config.ease,
					onUpdate: notify,
					onComplete: notify,
				});
				return tween.current;
			},

			subscribe: (listener) => {
				listeners.current.add(listener);
				listener(state.current.value);
				return () => {
					listeners.current.delete(listener);
				};
			},

			stop: () => {
				tween.current?.kill();
				tween.current = null;
			},
		}),
		[notify],
	);

	useEffect(
		() => () => {
			tween.current?.kill();
			listeners.current.clear();
		},
		[],
	);

	return value;
}

/**
 * Writes a `GsapValue` into a DOM node every frame. `apply` receives the raw
 * value and is responsible for the transform — the equivalent of chaining
 * `useTransform` onto a motion value and binding it to a style prop.
 */
export function useGsapValueEffect<T extends HTMLElement>(
	value: GsapValue,
	apply: (element: T, current: number) => void,
) {
	const ref = useRef<T | null>(null);
	const applyRef = useRef(apply);
	applyRef.current = apply;

	useEffect(
		() =>
			value.subscribe((current) => {
				const element = ref.current;
				if (element) applyRef.current(element, current);
			}),
		[value],
	);

	return ref;
}
