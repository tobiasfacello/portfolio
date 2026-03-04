import type { Tweet } from '../types';
import tweetsData from '../data/tweets.json';

interface TweetsState {
	tweets: Tweet[];
	loading: false;
	error: null;
}

/**
 * Tweets are fetched at build time (scripts/fetch-tweets.mjs)
 * and baked into the bundle as static JSON — no runtime API calls.
 */
const state: TweetsState = {
	tweets: tweetsData as Tweet[],
	loading: false,
	error: null,
};

export function useTweets(): TweetsState {
	return state;
}
