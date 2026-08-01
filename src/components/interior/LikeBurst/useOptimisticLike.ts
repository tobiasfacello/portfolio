import { useCallback, useEffect, useRef, useState } from 'react';

export type LikeCommit = (liked: boolean, signal: AbortSignal) => Promise<unknown>;

export type UseOptimisticLikeOptions = {
	initialLiked?: boolean;
	initialCount?: number;
	onCommit?: LikeCommit;
	onError?: (error: unknown) => void;
	/** Quiet period before the intent is sent, in ms. */
	settle?: number;
};

/**
 * Optimistic like with a debounced commit and a real rollback.
 *
 * The UI updates on the press; the network call waits for the user to stop
 * tapping. Someone who taps four times has toggled twice — if the settled
 * intent matches what the server already believes, nothing is sent at all.
 * A request in flight is aborted when a newer intent arrives, and results from
 * a superseded request are ignored, so a slow response can never resurrect a
 * state the user already moved past. On failure the count returns to the last
 * confirmed truth rather than to a guess.
 */
export function useOptimisticLike({
	initialLiked = false,
	initialCount = 0,
	onCommit,
	onError,
	settle = 400,
}: UseOptimisticLikeOptions = {}) {
	const [liked, setLiked] = useState(initialLiked);
	const [count, setCount] = useState(initialCount);
	const [pending, setPending] = useState(false);
	const [burst, setBurst] = useState(0);
	const [settled, setSettled] = useState({ liked: initialLiked, count: initialCount });

	const likedNow = useRef(initialLiked);
	const countNow = useRef(initialCount);
	/** The last state the server confirmed — the only safe rollback target. */
	const truth = useRef({ liked: initialLiked, count: initialCount });
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const inFlight = useRef<AbortController | null>(null);
	const seq = useRef(0);

	const commit = useRef(onCommit);
	commit.current = onCommit;
	const failed = useRef(onError);
	failed.current = onError;

	const flush = useCallback(() => {
		timer.current = null;
		inFlight.current?.abort();
		inFlight.current = null;
		seq.current += 1;

		const intent = likedNow.current;

		// Toggled back to where it started: there is nothing to tell the server.
		if (intent === truth.current.liked) {
			countNow.current = truth.current.count;
			setLiked(truth.current.liked);
			setCount(truth.current.count);
			setPending(false);
			return;
		}

		const target = { liked: intent, count: countNow.current };
		const run = commit.current;

		if (!run) {
			truth.current = target;
			setSettled(target);
			setPending(false);
			return;
		}

		const controller = new AbortController();
		const id = seq.current;
		inFlight.current = controller;
		setPending(true);

		run(intent, controller.signal).then(
			() => {
				if (id !== seq.current) return;
				inFlight.current = null;
				truth.current = target;
				setSettled(target);
				setPending(false);
			},
			(error: unknown) => {
				if (id !== seq.current) return;
				inFlight.current = null;
				likedNow.current = truth.current.liked;
				countNow.current = truth.current.count;
				setLiked(truth.current.liked);
				setCount(truth.current.count);
				setPending(false);
				failed.current?.(error);
			},
		);
	}, []);

	const toggle = useCallback(() => {
		const next = !likedNow.current;
		likedNow.current = next;
		countNow.current += next ? 1 : -1;

		setLiked(next);
		setCount(countNow.current);
		setPending(true);
		// Only liking bursts. Unliking is a correction, not a celebration.
		if (next) setBurst((b) => b + 1);

		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(flush, settle);
	}, [flush, settle]);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
			timer.current = null;
			seq.current += 1;
			inFlight.current?.abort();
			inFlight.current = null;
		},
		[],
	);

	return {
		liked,
		count,
		base: liked ? count - 1 : count,
		pending,
		burst,
		settled,
		toggle,
	};
}
