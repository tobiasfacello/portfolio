import { useCallback, useLayoutEffect, useRef, useState } from 'react';

//? Hooks
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type PresenceAnimation = gsap.core.Tween | gsap.core.Timeline | void | null;

type PresenceCallback<T extends HTMLElement> = (
	element: T,
	context: { reducedMotion: boolean },
) => PresenceAnimation;

type UsePresenceOptions<T extends HTMLElement> = {
	/** Runs once the element is in the DOM. */
	enter?: PresenceCallback<T>;
	/**
	 * Runs before unmount; the element stays mounted until it resolves. The
	 * returned animation's `onComplete` is claimed by this hook to drive the
	 * unmount, so sequence any teardown inside the tween itself.
	 */
	exit?: PresenceCallback<T>;
	/** Skip the enter animation on the very first render when already open. */
	skipInitialEnter?: boolean;
};

/**
 * Keeps an element mounted for the length of its exit animation — the piece of
 * `AnimatePresence` these components actually rely on.
 *
 * Reopening mid-exit kills the outgoing tween and replays the enter from
 * wherever the element currently sits, so a fast toggle never strands a panel
 * half-faded or double-mounts it.
 */
export function usePresence<T extends HTMLElement>(
	isOpen: boolean,
	{ enter, exit, skipInitialEnter = false }: UsePresenceOptions<T> = {},
) {
	const [isMounted, setIsMounted] = useState(isOpen);
	const [previousIsOpen, setPreviousIsOpen] = useState(isOpen);

	const ref = useRef<T | null>(null);
	const animationRef = useRef<PresenceAnimation>(null);
	const isFirstRun = useRef(true);
	const reducedMotion = usePrefersReducedMotion();

	// Callbacks are read through refs so a caller passing inline closures does
	// not restart the animation on every render.
	const enterRef = useRef(enter);
	enterRef.current = enter;
	const exitRef = useRef(exit);
	exitRef.current = exit;

	// Mount synchronously on open so the enter animation has an element to run
	// against in the same commit (React's derived-state-during-render pattern).
	if (isOpen !== previousIsOpen) {
		setPreviousIsOpen(isOpen);
		if (isOpen) setIsMounted(true);
	}

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;

		animationRef.current?.kill();
		animationRef.current = null;

		if (isOpen) {
			const skip = isFirstRun.current && skipInitialEnter;
			isFirstRun.current = false;
			if (!skip) animationRef.current = enterRef.current?.(element, { reducedMotion }) ?? null;
			return;
		}

		isFirstRun.current = false;
		const outgoing = exitRef.current?.(element, { reducedMotion });
		animationRef.current = outgoing ?? null;

		if (!outgoing) {
			setIsMounted(false);
			return;
		}

		outgoing.eventCallback('onComplete', () => setIsMounted(false));
	}, [isOpen, isMounted, reducedMotion, skipInitialEnter]);

	useLayoutEffect(
		() => () => {
			animationRef.current?.kill();
		},
		[],
	);

	/** Cuts any in-flight animation short and unmounts now. */
	const unmountNow = useCallback(() => {
		animationRef.current?.kill();
		animationRef.current = null;
		setIsMounted(false);
	}, []);

	return { isMounted, ref, unmountNow, reducedMotion };
}

/**
 * `usePresence` for elements this component does not own the ref of — the
 * caller drives mounting and reports the node once it exists.
 */
export function usePresenceGroup() {
	const elements = useRef(new Map<string, HTMLElement>());
	const animations = useRef(new Map<string, PresenceAnimation>());

	const register = useCallback((key: string, element: HTMLElement | null) => {
		if (element) elements.current.set(key, element);
		else elements.current.delete(key);
	}, []);

	const animate = useCallback(
		(key: string, run: (element: HTMLElement) => PresenceAnimation) => {
			const element = elements.current.get(key);
			if (!element) return null;

			animations.current.get(key)?.kill();
			const animation = run(element);
			animations.current.set(key, animation ?? null);
			return animation;
		},
		[],
	);

	useLayoutEffect(
		() => () => {
			animations.current.forEach((animation) => animation?.kill());
			animations.current.clear();
		},
		[],
	);

	return { register, animate, elements };
}
