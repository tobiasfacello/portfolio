import type { GitHubContributionData } from '../types';
import { GITHUB_USERNAME } from '../data/socialFeed';

const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4';

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
