#!/usr/bin/env node

/**
 * Build-time script: fetches tweets via Twitter oEmbed API
 * and writes static JSON consumed by the frontend.
 *
 * Runs before every build (local + CI/CD) so the serverless
 * function is no longer needed — data is baked into the bundle.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const URLS_PATH = join(ROOT, 'scripts', 'tweets-config.json');
const OUTPUT_PATH = join(ROOT, 'src', 'data', 'tweets.json');
const FETCH_TIMEOUT_MS = 8_000;

// ── Helpers ──────────────────────────────────────────────

function withTimeout(ms) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), ms);
	return {
		signal: controller.signal,
		clear: () => clearTimeout(timer),
	};
}

function extractTweetId(url) {
	const match = url.match(/status\/(\d+)/);
	if (!match) throw new Error(`Could not extract tweet ID from: ${url}`);
	return match[1];
}

function parseTweetHtml(html) {
	const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
	const rawText = pMatch ? pMatch[1].replace(/<[^>]+>/g, '').trim() : '';

	const dateMatches = html.match(/<a[^>]*>([A-Za-z]+ \d{1,2}, \d{4})<\/a>/g);
	let date = '';
	if (dateMatches?.length) {
		const last = dateMatches[dateMatches.length - 1];
		const m = last.match(/>([A-Za-z]+ \d{1,2}, \d{4})</);
		if (m) {
			const parsed = new Date(m[1]);
			if (!isNaN(parsed.getTime())) {
				date = parsed.toISOString().split('T')[0];
			}
		}
	}

	if (!rawText) console.warn('[fetch-tweets] parseTweetHtml: empty text extracted');
	if (!date) console.warn('[fetch-tweets] parseTweetHtml: empty date extracted');

	return { text: rawText, date };
}

function cleanTweetText(text) {
	return text
		.replace(/https?:\/\/t\.co\/\w+/g, '')
		.replace(/pic\.twitter\.com\/\w+/g, '')
		.replace(/\s{2,}/g, ' ')
		.trim();
}

async function fetchTweet(url) {
	const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;

	const { signal, clear } = withTimeout(FETCH_TIMEOUT_MS);
	let data;
	try {
		const res = await fetch(oembedUrl, { signal });
		if (!res.ok) throw new Error(`oEmbed ${res.status} for ${url}`);
		data = await res.json();
	} finally {
		clear();
	}

	const { text, date } = parseTweetHtml(data.html);
	const tweetId = extractTweetId(url);

	return {
		id: tweetId,
		text: cleanTweetText(text),
		date,
		authorName: data.author_name,
		url: data.url || url,
	};
}

// ── Main ─────────────────────────────────────────────────

async function main() {
	console.log('[fetch-tweets] Starting build-time tweet fetch…');

	let urls;
	try {
		urls = JSON.parse(readFileSync(URLS_PATH, 'utf-8'));
	} catch (err) {
		console.error('[fetch-tweets] Could not read config:', err.message);
		process.exit(0); // non-fatal — keep existing tweets.json
	}

	const results = await Promise.allSettled(urls.map(fetchTweet));

	const tweets = results
		.filter((r) => r.status === 'fulfilled')
		.map((r) => r.value);

	results.forEach((r, i) => {
		if (r.status === 'rejected') {
			console.warn(`[fetch-tweets] Failed for ${urls[i]}: ${r.reason?.message}`);
		}
	});

	if (tweets.length === 0) {
		console.warn('[fetch-tweets] No tweets fetched — keeping existing data.');
		if (!existsSync(OUTPUT_PATH)) {
			console.error('[fetch-tweets] No existing tweets.json found either. Writing empty array.');
			writeFileSync(OUTPUT_PATH, '[]', 'utf-8');
		}
		return;
	}

	writeFileSync(OUTPUT_PATH, JSON.stringify(tweets, null, '\t'), 'utf-8');
	console.log(`[fetch-tweets] Wrote ${tweets.length} tweets to src/data/tweets.json`);
}

main().catch((err) => {
	console.error('[fetch-tweets] Unexpected error:', err);
	// Non-fatal: if tweets.json already exists the build continues fine.
	process.exit(0);
});
