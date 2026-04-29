import type { GitHubRepo, GitHubEvent, GitHubContributionData } from '../types';
import { GITHUB_USERNAME } from '../data/socialFeed';

const BASE_URL = 'https://api.github.com';
const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4';

interface GitHubUserResponse {
	login: string;
	avatar_url: string;
	public_repos: number;
	followers: number;
}

export async function fetchGitHubUser(signal?: AbortSignal): Promise<GitHubUserResponse> {
	const res = await fetch(`${BASE_URL}/users/${GITHUB_USERNAME}`, { signal });
	if (!res.ok) throw new Error('Failed to fetch GitHub user');
	return res.json();
}

export async function fetchGitHubRepos(signal?: AbortSignal): Promise<GitHubRepo[]> {
	const res = await fetch(
		`${BASE_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
		{ signal }
	);
	if (!res.ok) throw new Error('Failed to fetch GitHub repos');
	const data = await res.json();
	return data.map((repo: Record<string, unknown>) => ({
		name: repo.name as string,
		description: (repo.description as string) || '',
		language: (repo.language as string) || '',
		stars: repo.stargazers_count as number,
		forks: repo.forks_count as number,
		url: repo.html_url as string,
	}));
}

export async function fetchGitHubEvents(signal?: AbortSignal): Promise<GitHubEvent[]> {
	const res = await fetch(
		`${BASE_URL}/users/${GITHUB_USERNAME}/events/public?per_page=30`,
		{ signal }
	);
	if (!res.ok) throw new Error('Failed to fetch GitHub events');
	const data = await res.json();
	return data.map((event: Record<string, unknown>) => ({
		type: event.type as string,
		repo: (event.repo as Record<string, unknown>).name as string,
		createdAt: event.created_at as string,
	}));
}

export async function fetchGitHubContributions(signal?: AbortSignal): Promise<GitHubContributionData> {
	const res = await fetch(
		`${CONTRIBUTIONS_API}/${GITHUB_USERNAME}?y=last`,
		{ signal }
	);
	if (!res.ok) throw new Error('Failed to fetch contributions');
	const data = await res.json();
	return {
		total: data.total?.lastYear ?? 0,
		contributions: (data.contributions ?? []).map(
			(c: { date: string; count: number; level: number }) => ({
				date: c.date,
				count: c.count,
				level: Math.min(c.level, 4) as 0 | 1 | 2 | 3 | 4,
			})
		),
	};
}
