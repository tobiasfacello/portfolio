import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

type OEmbedResponse = {
	html: string;
	author_name: string;
	url: string;
};

type ParsedTweet = {
	id: string;
	text: string;
	date: string;
	authorName: string;
	url: string;
	image: string | null;
};

function parseTweetHtml(html: string): { text: string; date: string } {
	// Extract text from <p> tag
	const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
	const rawText = pMatch ? pMatch[1].replace(/<[^>]+>/g, '').trim() : '';

	// Extract date from last <a> tag (Twitter blockquote format)
	const dateMatches = html.match(
		/<a[^>]*>([A-Za-z]+ \d{1,2}, \d{4})<\/a>/g
	);
	let date = '';
	if (dateMatches && dateMatches.length > 0) {
		const lastMatch = dateMatches[dateMatches.length - 1];
		const dateTextMatch = lastMatch.match(
			/>([A-Za-z]+ \d{1,2}, \d{4})</
		);
		if (dateTextMatch) {
			const parsed = new Date(dateTextMatch[1]);
			if (!isNaN(parsed.getTime())) {
				date = parsed.toISOString().split('T')[0];
			}
		}
	}

	return { text: rawText, date };
}

function extractTweetId(url: string): string {
	const match = url.match(/status\/(\d+)/);
	return match ? match[1] : url;
}

async function fetchOgImage(url: string): Promise<string | null> {
	try {
		const response = await fetch(url, {
			headers: { 'User-Agent': 'Twitterbot/1.0' },
			redirect: 'follow',
		});
		if (!response.ok) return null;
		const html = await response.text();
		const match = html.match(
			/<meta\s+property="og:image"\s+content="([^"]+)"/
		);
		return match ? match[1] : null;
	} catch {
		return null;
	}
}

export default async function handler(
	_req: VercelRequest,
	res: VercelResponse
) {
	try {
		const configPath = join(process.cwd(), 'api', '_config', 'tweets.json');
		const urls: string[] = JSON.parse(readFileSync(configPath, 'utf-8'));

		const results = await Promise.allSettled(
			urls.map(async (url): Promise<ParsedTweet> => {
				const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;
				const response = await fetch(oembedUrl);
				if (!response.ok)
					throw new Error(`oEmbed failed for ${url}`);
				const data: OEmbedResponse = await response.json();
				const { text, date } = parseTweetHtml(data.html);
				const image = await fetchOgImage(url);

				return {
					id: extractTweetId(url),
					text,
					date,
					authorName: data.author_name,
					url: data.url || url,
					image,
				};
			})
		);

		const tweets = results
			.filter(
				(r): r is PromiseFulfilledResult<ParsedTweet> =>
					r.status === 'fulfilled'
			)
			.map((r) => r.value);

		res.setHeader(
			'Cache-Control',
			's-maxage=86400, stale-while-revalidate=172800'
		);
		return res.status(200).json(tweets);
	} catch {
		return res.status(500).json({ error: 'Failed to fetch tweets' });
	}
}
