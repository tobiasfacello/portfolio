import { useState, useEffect } from 'react';
import type { Tweet } from '../types';
import { fetchTweets } from '../services/twitter';
import { staticTweets } from '../data/staticSocial';

const CACHE_KEY = 'twitter-tweets';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface TweetsState {
	tweets: Tweet[];
	loading: boolean;
	error: string | null;
}

function getCached(): TweetsState | null {
	try {
		const raw = sessionStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const { data, timestamp } = JSON.parse(raw);
		if (Date.now() - timestamp > CACHE_TTL) return null;
		return { tweets: data, loading: false, error: null };
	} catch {
		return null;
	}
}

function setCache(data: Tweet[]) {
	try {
		sessionStorage.setItem(
			CACHE_KEY,
			JSON.stringify({ data, timestamp: Date.now() })
		);
	} catch {
		// sessionStorage full or unavailable
	}
}

export function useTweets(): TweetsState {
	const [state, setState] = useState<TweetsState>(() => {
		const cached = getCached();
		return cached || { tweets: [], loading: true, error: null };
	});

	useEffect(() => {
		if (getCached()) return;

		let cancelled = false;

		async function load() {
			try {
				const tweets = await fetchTweets();
				if (cancelled) return;
				setCache(tweets);
				setState({ tweets, loading: false, error: null });
			} catch {
				if (!cancelled) {
					setState({
						tweets: staticTweets,
						loading: false,
						error: null,
					});
				}
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	return state;
}
