import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncActionStatus = 'idle' | 'pending' | 'success' | 'error';

export type UseAsyncActionOptions = {
	action: () => unknown;
	/** How long the resolved state shows before returning to idle, in ms. */
	resetAfter?: number;
	onError?: (error: unknown) => void;
};

/**
 * Runs an action and reports its outcome, without letting a stale run win.
 *
 * Every run takes a ticket; results from an earlier run are discarded, so a
 * slow first request cannot overwrite the outcome of a faster second one. The
 * action is wrapped in `Promise.resolve` so a synchronous throw is reported the
 * same way a rejected promise is.
 */
export function useAsyncAction({ action, resetAfter = 1400, onError }: UseAsyncActionOptions) {
	const [status, setStatus] = useState<AsyncActionStatus>('idle');

	const phase = useRef<AsyncActionStatus>('idle');
	const runId = useRef(0);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const alive = useRef(true);

	const act = useRef(action);
	const fail = useRef(onError);

	useEffect(() => {
		act.current = action;
		fail.current = onError;
	});

	const clear = useCallback(() => {
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
		}
	}, []);

	const reset = useCallback(() => {
		runId.current += 1;
		clear();
		phase.current = 'idle';
		setStatus('idle');
	}, [clear]);

	const run = useCallback(() => {
		// A second press while pending is not a second action.
		if (phase.current === 'pending') return;

		clear();
		const id = ++runId.current;
		phase.current = 'pending';
		setStatus('pending');

		const settle = (next: 'success' | 'error') => {
			if (!alive.current || id !== runId.current) return;
			clear();
			phase.current = next;
			setStatus(next);
			timer.current = setTimeout(() => {
				if (!alive.current || id !== runId.current) return;
				phase.current = 'idle';
				setStatus('idle');
			}, resetAfter);
		};

		Promise.resolve()
			.then(() => act.current())
			.then(
				() => settle('success'),
				(error: unknown) => {
					fail.current?.(error);
					settle('error');
				},
			);
	}, [clear, resetAfter]);

	useEffect(() => {
		alive.current = true;
		return () => {
			alive.current = false;
			clear();
		};
	}, [clear]);

	return { status, run, reset, pending: status === 'pending' };
}
