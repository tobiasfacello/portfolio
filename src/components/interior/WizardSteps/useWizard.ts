import { useCallback, useRef, useState } from 'react';

export type WizardDirection = 1 | -1;

export type UseWizardOptions = {
	total: number;
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number, direction: WizardDirection) => void;
	onComplete?: () => void;
};

function clampIndex(value: number, total: number) {
	if (total < 1) return 0;
	return Math.max(0, Math.min(total - 1, Math.trunc(value)));
}

/**
 * Wizard cursor that remembers how far the user actually got.
 *
 * `furthest` is what makes the rail navigable: you can jump back to any step
 * you have reached, but not forward past one you have not — so the sequence
 * still means something while remaining freely reversible.
 */
export function useWizard({
	total,
	index,
	defaultIndex = 0,
	onIndexChange,
	onComplete,
}: UseWizardOptions) {
	const [internal, setInternal] = useState(() => clampIndex(defaultIndex, total));
	const current = clampIndex(index ?? internal, total);

	// Derived during render so the panel knows which way it is moving on the
	// same commit the index changes, not a frame later.
	const [seen, setSeen] = useState<{ index: number; direction: WizardDirection }>({
		index: current,
		direction: 1,
	});
	if (seen.index !== current) {
		setSeen({ index: current, direction: current > seen.index ? 1 : -1 });
	}

	const [furthest, setFurthest] = useState(current);
	if (furthest < current) setFurthest(current);

	const emit = useRef(onIndexChange);
	emit.current = onIndexChange;
	const finish = useRef(onComplete);
	finish.current = onComplete;

	const controlled = index !== undefined;

	const goTo = useCallback(
		(to: number) => {
			const target = clampIndex(to, total);
			if (target === current) return;
			const direction: WizardDirection = target > current ? 1 : -1;
			if (!controlled) setInternal(target);
			emit.current?.(target, direction);
		},
		[controlled, current, total],
	);

	const next = useCallback(() => {
		if (current >= total - 1) {
			finish.current?.();
			return;
		}
		goTo(current + 1);
	}, [current, goTo, total]);

	const back = useCallback(() => goTo(current - 1), [current, goTo]);

	return {
		index: current,
		direction: seen.direction,
		furthest: Math.min(furthest, Math.max(total - 1, 0)),
		total,
		isFirst: current === 0,
		isLast: current === total - 1,
		next,
		back,
		goTo,
	};
}
