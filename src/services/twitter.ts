import type { Tweet } from '../types';

export async function fetchTweets(): Promise<Tweet[]> {
	const res = await fetch('/api/tweets');
	if (!res.ok) throw new Error('Failed to fetch tweets');
	return res.json();
}
