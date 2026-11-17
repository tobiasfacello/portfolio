import type { PinnedTweet } from '../types';
import pinnedTweetData from '../data/pinned-tweet.json';

interface PinnedTweetState {
	tweet: PinnedTweet | null;
	loading: boolean;
	error: string | null;
}

/**
 * The pinned tweet is fixed, edited by hand in src/data/pinned-tweet.json and
 * baked into the bundle — no API calls. The shape is validated
 * once at module load so a malformed or emptied file degrades to an error state
 * (which WidgetBase renders) instead of throwing during render or leaving the
 * card body blank.
 */
function buildState(): PinnedTweetState {
	const data = pinnedTweetData as Partial<PinnedTweet> | null;
	const isValid =
		!!data &&
		typeof data.id === 'string' &&
		typeof data.text === 'string' &&
		typeof data.url === 'string' &&
		typeof data.date === 'string' &&
		!!data.author &&
		typeof data.author.name === 'string' &&
		!!data.stats;

	if (!isValid) {
		return { tweet: null, loading: false, error: 'invalid-pinned-tweet' };
	}

	return { tweet: data as PinnedTweet, loading: false, error: null };
}

const state = buildState();

export function usePinnedTweet(): PinnedTweetState {
	return state;
}
