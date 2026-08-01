import { useEffect, useRef, useState } from 'react';

export type FlashDirection = 'up' | 'down';

export type UseValueFlashOptions<T> = {
	/** How long the flash colour stays on, in ms. */
	hold?: number;
	/** Returns >0 when `next` is higher than `previous`. */
	compare?: (next: T, previous: T) => number;
};

export type ValueFlashState<T> = {
	direction: FlashDirection | null;
	from: T;
	changeId: number;
	flashing: boolean;
};

/**
 * Reports which way a value moved, and for how long to say so.
 *
 * A value that changes to something equal in rank — a re-render, a re-fetch
 * returning the same number — produces no flash at all. Nothing moves unless
 * something happened.
 */
export function useValueFlash<T>(
	value: T,
	{ hold = 900, compare }: UseValueFlashOptions<T> = {},
): ValueFlashState<T> {
	const [state, setState] = useState<ValueFlashState<T>>({
		direction: null,
		from: value,
		changeId: 0,
		flashing: false,
	});

	const previous = useRef(value);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const rank = useRef(compare);

	useEffect(() => {
		rank.current = compare;
	});

	useEffect(() => {
		const prior = previous.current;
		if (Object.is(prior, value)) return;
		previous.current = value;

		const measure = rank.current;
		const delta = measure
			? measure(value, prior)
			: typeof value === 'number' && typeof prior === 'number'
				? value - prior
				: 0;

		if (delta === 0) return;

		setState((prev) => ({
			direction: delta > 0 ? 'up' : 'down',
			from: prior,
			changeId: prev.changeId + 1,
			flashing: true,
		}));

		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			timer.current = null;
			setState((prev) => (prev.flashing ? { ...prev, flashing: false } : prev));
		}, hold);
	}, [value, hold]);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	return state;
}
