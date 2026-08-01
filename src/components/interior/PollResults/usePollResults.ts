import { useCallback, useRef, useState } from 'react';

export type PollOption = {
	id: string;
	label: string;
	votes: number;
};

export type UsePollResultsOptions = {
	options: PollOption[];
	/** The chosen option id, or null while unvoted. */
	value?: string | null;
	defaultValue?: string | null;
	onVote?: (id: string) => void;
};

/**
 * Poll state, with results hidden until a vote is cast.
 *
 * Voting is one-way on purpose: showing the tally is the reward for choosing,
 * and letting someone change their answer after seeing which side is winning
 * changes what the poll measures.
 */
export function usePollResults({
	options,
	value,
	defaultValue = null,
	onVote,
}: UsePollResultsOptions) {
	const [internal, setInternal] = useState<string | null>(defaultValue);
	const controlled = value !== undefined;
	const chosen = controlled ? value : internal;

	const emit = useRef(onVote);
	emit.current = onVote;

	const vote = useCallback(
		(id: string) => {
			if (chosen !== null) return;
			if (!controlled) setInternal(id);
			emit.current?.(id);
		},
		[chosen, controlled],
	);

	const total = options.reduce((sum, o) => sum + Math.max(0, o.votes), 0);
	const top = options.reduce((best, o) => (o.votes > best ? o.votes : best), 0);

	const rows = options.map((option) => ({
		...option,
		share: total > 0 ? Math.max(0, option.votes) / total : 0,
		// A tie marks every leader, rather than silently picking one.
		winner: total > 0 && option.votes === top,
		mine: option.id === chosen,
	}));

	return { rows, total, chosen, revealed: chosen !== null, vote };
}
