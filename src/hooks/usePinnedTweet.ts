import type { PinnedTweet } from '../types';
import pinnedTweetData from '../data/pinned-tweet.json';

interface PinnedTweetState {
	tweet: PinnedTweet | null;
	loading: false;
	error: null;
}

/**
 * Pinned tweet is fetched at build time (scripts/fetch-tweets.mjs)
 * and baked into the bundle as static JSON — no runtime API calls.
 */
const state: PinnedTweetState = {
	tweet: pinnedTweetData as PinnedTweet,
	loading: false,
	error: null,
};

export function usePinnedTweet(): PinnedTweetState {
	return state;
}
