import { useState, useEffect } from 'react';
import { fetchGitHubContributions } from '../services/github';
import type { GitHubContribution } from '../types';

// The calendar is the only GitHub data the widget renders, so this is the only
// request made. It's persisted in localStorage and served stale-while-revalidate:
// a cached calendar renders instantly on repeat visits, and is only refetched
// once it's older than FRESH_TTL (the upstream API itself refreshes a few times
// a day, so polling it more often just burns requests).
const CACHE_KEY = 'github-contributions-v1';
const FRESH_TTL = 60 * 60 * 1000; // 1 hour
const MAX_STALE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface GitHubActivityState {
	contributions: GitHubContribution[];
	totalContributions: number;
	loading: boolean;
	error: string | null;
}

type CacheableData = Pick<GitHubActivityState, 'contributions' | 'totalContributions'>;

interface CacheEntry {
	data: CacheableData;
	timestamp: number;
}

const initialState: GitHubActivityState = {
	contributions: [],
	totalContributions: 0,
	loading: true,
	error: null,
};

function readCache(): CacheEntry | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const entry = JSON.parse(raw) as CacheEntry;
		if (Date.now() - entry.timestamp > MAX_STALE_AGE) return null;
		return entry;
	} catch {
		return null;
	}
}

function writeCache(data: CacheableData) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
	} catch {
		// localStorage full or unavailable
	}
}

export function useGitHubActivity(): GitHubActivityState {
	const [state, setState] = useState<GitHubActivityState>(() => {
		const cached = readCache();
		return cached ? { ...cached.data, loading: false, error: null } : initialState;
	});

	useEffect(() => {
		const cached = readCache();
		if (cached && Date.now() - cached.timestamp < FRESH_TTL) return;

		const controller = new AbortController();

		fetchGitHubContributions(controller.signal)
			.then(({ total, contributions }) => {
				const data: CacheableData = { contributions, totalContributions: total };
				writeCache(data);
				setState({ ...data, loading: false, error: null });
			})
			.catch((err: Error) => {
				if (controller.signal.aborted) return;
				// Keep showing a stale calendar rather than swapping it for an error.
				if (cached) return;
				setState((prev) => ({ ...prev, loading: false, error: err.message }));
			});

		return () => controller.abort();
	}, []);

	return state;
}
