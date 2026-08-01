import { useCallback, useEffect, useRef, useState } from 'react';

export type ExitListEntry<T> = {
	key: string;
	item: T;
	/** True once the item has left the source list but is still animating out. */
	exiting: boolean;
};

/**
 * Keeps removed items around until their exit animation finishes — the list
 * half of what `AnimatePresence` provides.
 *
 * An item that leaves and comes back before its exit finishes is revived in
 * place rather than being torn down and remounted, so a list that changes twice
 * in quick succession does not flash the same row out and back in.
 */
export function useExitList<T>(items: readonly T[], getKey: (item: T) => string) {
	const [entries, setEntries] = useState<ExitListEntry<T>[]>(() =>
		items.map((item) => ({ key: getKey(item), item, exiting: false })),
	);

	const keyOf = useRef(getKey);
	keyOf.current = getKey;

	useEffect(() => {
		setEntries((previous) => {
			const liveKeys = new Set(items.map((item) => keyOf.current(item)));

			// Anything still exiting keeps its slot so its position does not jump
			// while it animates away.
			const leaving = previous
				.filter((entry) => !liveKeys.has(entry.key))
				.map((entry) => ({ ...entry, exiting: true }));

			const present = items.map((item) => ({
				key: keyOf.current(item),
				item,
				exiting: false,
			}));

			const merged = [...present, ...leaving];

			const unchanged =
				merged.length === previous.length &&
				merged.every(
					(entry, i) =>
						previous[i].key === entry.key &&
						previous[i].exiting === entry.exiting &&
						Object.is(previous[i].item, entry.item),
				);

			return unchanged ? previous : merged;
		});
	}, [items]);

	/** Call when an item's exit animation has finished. */
	const remove = useCallback((key: string) => {
		setEntries((previous) => {
			const next = previous.filter((entry) => !(entry.key === key && entry.exiting));
			return next.length === previous.length ? previous : next;
		});
	}, []);

	return { entries, remove };
}
