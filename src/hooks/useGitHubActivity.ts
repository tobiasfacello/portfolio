import { useState, useEffect } from 'react';
import {
	fetchGitHubUser,
	fetchGitHubRepos,
	fetchGitHubEvents,
	fetchGitHubContributions,
} from '../services/github';
import type {
	GitHubRepo,
	GitHubEvent,
	GitHubContribution,
	GitHubTopRepo,
} from '../types';

const CACHE_KEY = 'github-activity';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface GitHubActivityState {
	username: string;
	avatarUrl: string;
	publicRepos: number;
	followers: number;
	repos: GitHubRepo[];
	events: GitHubEvent[];
	contributions: GitHubContribution[];
	totalContributions: number;
	topRepos: GitHubTopRepo[];
	loading: boolean;
	error: string | null;
}

const initialState: GitHubActivityState = {
	username: '',
	avatarUrl: '',
	publicRepos: 0,
	followers: 0,
	repos: [],
	events: [],
	contributions: [],
	totalContributions: 0,
	topRepos: [],
	loading: true,
	error: null,
};

type CacheableData = Omit<GitHubActivityState, 'loading' | 'error'>;

function getCached(): GitHubActivityState | null {
	try {
		const raw = sessionStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const { data, timestamp } = JSON.parse(raw);
		if (Date.now() - timestamp > CACHE_TTL) return null;
		return { ...data, loading: false, error: null };
	} catch {
		return null;
	}
}

function setCache(data: CacheableData) {
	try {
		sessionStorage.setItem(
			CACHE_KEY,
			JSON.stringify({ data, timestamp: Date.now() })
		);
	} catch {
		// sessionStorage full or unavailable
	}
}

function deriveTopRepos(events: GitHubEvent[]): GitHubTopRepo[] {
	const counts = new Map<string, number>();
	for (const event of events) {
		// Strip owner prefix: "owner/repo" → "repo"
		const repoName = event.repo.includes('/')
			? event.repo.split('/')[1]
			: event.repo;
		counts.set(repoName, (counts.get(repoName) || 0) + 1);
	}
	return Array.from(counts.entries())
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 3);
}

export function useGitHubActivity(): GitHubActivityState {
	const [state, setState] = useState<GitHubActivityState>(() => {
		const cached = getCached();
		return cached || initialState;
	});

	useEffect(() => {
		if (getCached()) return;

		let cancelled = false;

		async function load() {
			try {
				const [user, repos, events, contribData] = await Promise.all([
					fetchGitHubUser(),
					fetchGitHubRepos(),
					fetchGitHubEvents(),
					fetchGitHubContributions().catch(() => ({
						total: 0,
						contributions: [],
					})),
				]);

				if (cancelled) return;

				const topRepos = deriveTopRepos(events);

				const result: CacheableData = {
					username: user.login,
					avatarUrl: user.avatar_url,
					publicRepos: user.public_repos,
					followers: user.followers,
					repos,
					events,
					contributions: contribData.contributions,
					totalContributions: contribData.total,
					topRepos,
				};

				setCache(result);
				setState({ ...result, loading: false, error: null });
			} catch (err) {
				if (!cancelled) {
					setState((prev) => ({
						...prev,
						loading: false,
						error: (err as Error).message,
					}));
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
