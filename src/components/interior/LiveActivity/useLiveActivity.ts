import { useCallback, useEffect, useRef, useState } from 'react';

export type ActivityPhase = 'running' | 'success' | 'error';

export type Activity = {
	id: string;
	title: string;
	detail?: string;
	/** `null` means the work is unmeasured. */
	progress?: number | null;
	phase: ActivityPhase;
	action?: { label: string; onClick: () => void };
};

export type ActivityInput = {
	title: string;
	detail?: string;
	progress?: number | null;
};

export type UseLiveActivityOptions = {
	/** How long a resolved activity stays before dismissing itself, in ms. */
	linger?: number;
};

/**
 * A single ambient activity that reports itself and then gets out of the way.
 *
 * Success dismisses itself after `linger`, because a finished job has nothing
 * left to say. Failure does not: an error that disappears on its own is an
 * error nobody read. Each start takes a new id, so a late update from a
 * previous run cannot write over the current one.
 */
export function useLiveActivity({ linger = 2000 }: UseLiveActivityOptions = {}) {
	const [activity, setActivity] = useState<Activity | null>(null);
	const seq = useRef(0);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clear = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);
		timer.current = null;
	}, []);

	const start = useCallback(
		(input: ActivityInput) => {
			clear();
			seq.current += 1;
			const id = `activity-${seq.current}`;
			setActivity({ progress: null, ...input, id, phase: 'running' });
			return id;
		},
		[clear],
	);

	const update = useCallback((patch: Partial<ActivityInput>) => {
		setActivity((prev) => (prev ? { ...prev, ...patch } : prev));
	}, []);

	const dismiss = useCallback(() => {
		clear();
		setActivity(null);
	}, [clear]);

	const succeed = useCallback(
		(patch?: Partial<ActivityInput>) => {
			setActivity((prev) => (prev ? { ...prev, ...patch, phase: 'success', progress: 1 } : prev));
			clear();
			timer.current = setTimeout(() => {
				timer.current = null;
				setActivity(null);
			}, linger);
		},
		[clear, linger],
	);

	const fail = useCallback(
		(patch?: Partial<ActivityInput>) => {
			// Deliberately no timer: a failure waits to be acknowledged.
			setActivity((prev) => (prev ? { ...prev, ...patch, phase: 'error' } : prev));
			clear();
		},
		[clear],
	);

	useEffect(() => clear, [clear]);

	return { activity, start, update, succeed, fail, dismiss };
}
