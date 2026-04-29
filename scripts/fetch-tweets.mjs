#!/usr/bin/env node

/**
 * Discovers and writes the latest tweets for the configured handle into
 * src/data/tweets.json — consumed by the activity widget at runtime.
 *
 * Source: twitterapi.io (https://twitterapi.io). Pricing is pay-as-you-go
 * (~$0.07/year at this cadence) with $0.10 free credit on signup. Auth is a
 * single `x-api-key` header — no OAuth, no Twitter cookies, no ban risk.
 *
 * Usage
 * -----
 * Set TWITTERAPI_IO_KEY in the environment:
 *   - Locally: export TWITTERAPI_IO_KEY=...
 *   - CI:      add it as a GitHub Secret consumed by .github/workflows/refresh-tweets.yml
 *
 * If the env var is missing, the script logs a warning and exits without
 * touching tweets.json so the build still succeeds against the committed
 * fallback data.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_PATH = join(ROOT, 'src', 'data', 'tweets.json');

const USERNAME = 'fachebits';
const TWEET_COUNT = 10;
const FETCH_TIMEOUT_MS = 15_000;
const API_BASE = 'https://api.twitterapi.io';

// ── Helpers ──────────────────────────────────────────────

function withTimeout(ms) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), ms);
	return {
		signal: controller.signal,
		clear: () => clearTimeout(timer),
	};
}

function cleanText(text) {
	return text
		.replace(/https?:\/\/t\.co\/\w+/g, '')
		.replace(/pic\.twitter\.com\/\w+/g, '')
		.replace(/[ \t]{2,}/g, ' ')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

function toIsoDate(twitterDateString) {
	// Twitter format: "Tue Apr 28 20:57:14 +0000 2026" → "2026-04-28"
	const parsed = new Date(twitterDateString);
	if (isNaN(parsed.getTime())) return '';
	return parsed.toISOString().split('T')[0];
}

function isOriginalTweet(tweet) {
	// Skip retweets ("RT @user: …"). Replies are excluded server-side via
	// includeReplies=false default. Quote-tweets are kept — they're original
	// posts authored by the user.
	return !/^RT @/.test(tweet.text ?? '');
}

async function callApi(path, params, apiKey) {
	const url = new URL(`${API_BASE}${path}`);
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== '' && v !== null) {
			url.searchParams.set(k, String(v));
		}
	}

	const { signal, clear } = withTimeout(FETCH_TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			signal,
			headers: { 'x-api-key': apiKey },
		});
		const body = await res.json().catch(() => ({}));
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} ${res.statusText} — ${body?.msg ?? body?.detail ?? 'unknown'}`);
		}
		return body;
	} finally {
		clear();
	}
}

// ── Main ─────────────────────────────────────────────────

async function main() {
	const apiKey = process.env.TWITTERAPI_IO_KEY;
	if (!apiKey) {
		console.warn('[fetch-tweets] TWITTERAPI_IO_KEY not set — skipping refresh.');
		console.warn('[fetch-tweets] Existing src/data/tweets.json is preserved.');
		return;
	}

	console.log(`[fetch-tweets] Fetching last ${TWEET_COUNT} tweets for @${USERNAME}…`);

	let body;
	try {
		body = await callApi('/twitter/user/last_tweets', { userName: USERNAME }, apiKey);
	} catch (err) {
		console.error('[fetch-tweets] Request failed:', err?.message ?? err);
		process.exit(0); // non-fatal — committed tweets.json keeps the build green
	}

	if (body?.status && body.status !== 'success') {
		console.error(`[fetch-tweets] API status="${body.status}": ${body.msg ?? ''}`);
		process.exit(0);
	}

	// last_tweets returns the data-wrapped envelope: { status, msg, data: {...} }.
	// Defensively support both shapes — flat or wrapped — so we don't break if
	// the backend layout shifts.
	const rawTweets = body?.data?.tweets ?? body?.tweets ?? [];
	if (!Array.isArray(rawTweets) || rawTweets.length === 0) {
		console.warn('[fetch-tweets] API returned no tweets — keeping existing data.');
		return;
	}

	const tweets = rawTweets
		.filter(isOriginalTweet)
		.slice(0, TWEET_COUNT)
		.map((t) => ({
			id: String(t.id),
			text: cleanText(String(t.text ?? '')),
			date: toIsoDate(t.createdAt),
			authorName: String(t.author?.name ?? ''),
			url: `https://twitter.com/${t.author?.userName ?? USERNAME}/status/${t.id}`,
		}));

	if (tweets.length === 0) {
		console.warn('[fetch-tweets] All fetched tweets filtered out — keeping existing data.');
		return;
	}

	writeFileSync(OUTPUT_PATH, JSON.stringify(tweets, null, '\t') + '\n', 'utf-8');
	console.log(`[fetch-tweets] Wrote ${tweets.length} tweets to src/data/tweets.json.`);
}

main().catch((err) => {
	console.error('[fetch-tweets] Unexpected error:', err);
	process.exit(0);
});
