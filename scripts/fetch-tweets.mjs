#!/usr/bin/env node

/**
 * Refreshes the engagement stats (likes / retweets / replies / views) of the
 * pinned tweet rendered by TwitterWidget. The widget content itself — text,
 * date, author — is intentionally hardcoded in src/data/pinned-tweet.json, so
 * the visual surface does not depend on the API at runtime. Only the numbers move.
 *
 * Source: twitterapi.io (https://twitterapi.io). Auth is a single `x-api-key`
 * header — no OAuth, no Twitter cookies, no ban risk.
 *
 * Usage
 * -----
 * Set TWITTERAPI_IO_KEY in the environment:
 *   - Locally: export TWITTERAPI_IO_KEY=...
 *   - CI:      add it as a GitHub Secret consumed by .github/workflows/refresh-tweets.yml
 *
 * If the env var is missing, or the API call fails, the script logs a warning
 * and exits without touching pinned-tweet.json so the build still succeeds
 * against the committed data.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_PATH = join(ROOT, 'src', 'data', 'pinned-tweet.json');

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
			throw new Error(`HTTP ${res.status} ${res.statusText} — ${body?.msg ?? body?.detail ?? body?.message ?? 'unknown'}`);
		}
		return body;
	} finally {
		clear();
	}
}

// Coerce an API stat to a finite number, falling back to the committed value
// for missing / empty / non-numeric inputs — so a bad field never zeroes a
// previously-good count, and "1,234"-style strings still parse.
function toCount(raw, fallback) {
	if (raw === undefined || raw === null) return fallback;
	const str = String(raw).trim().replace(/,/g, '');
	if (str === '') return fallback;
	const n = Number(str);
	return Number.isFinite(n) ? n : fallback;
}

// ── Main ─────────────────────────────────────────────────

async function main() {
	const apiKey = process.env.TWITTERAPI_IO_KEY;
	if (!apiKey) {
		console.warn('[fetch-tweets] TWITTERAPI_IO_KEY not set — skipping refresh.');
		console.warn('[fetch-tweets] Existing src/data/pinned-tweet.json is preserved.');
		return;
	}

	let pinned;
	try {
		pinned = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'));
	} catch (err) {
		console.error('[fetch-tweets] Could not read existing pinned-tweet.json:', err?.message ?? err);
		process.exit(0);
	}

	const tweetId = pinned?.id;
	if (!tweetId) {
		console.error('[fetch-tweets] pinned-tweet.json has no id — aborting.');
		process.exit(0);
	}

	console.log(`[fetch-tweets] Refreshing stats for pinned tweet ${tweetId}…`);

	let body;
	try {
		body = await callApi('/twitter/tweets', { tweet_ids: tweetId }, apiKey);
	} catch (err) {
		console.error('[fetch-tweets] Request failed:', err?.message ?? err);
		process.exit(0); // non-fatal — committed pinned-tweet.json keeps the build green
	}

	if (body?.status && body.status !== 'success') {
		console.error(`[fetch-tweets] API status="${body.status}": ${body.msg ?? body.message ?? ''}`);
		process.exit(0);
	}

	const tweetsArr = body?.tweets ?? body?.data?.tweets ?? [];
	const raw = Array.isArray(tweetsArr) ? tweetsArr[0] : null;
	if (!raw) {
		console.warn('[fetch-tweets] API returned no tweet — keeping existing data.');
		return;
	}

	// If NONE of the expected stat fields are present, the endpoint shape has
	// likely changed — surface it loudly instead of silently freezing the file.
	const statFields = [
		{ key: 'likes', api: 'likeCount' },
		{ key: 'retweets', api: 'retweetCount' },
		{ key: 'replies', api: 'replyCount' },
		{ key: 'views', api: 'viewCount' },
	];
	const missing = statFields.filter(({ api }) => raw[api] === undefined || raw[api] === null);
	if (missing.length === statFields.length) {
		console.error(
			'[fetch-tweets] None of the expected stat fields (likeCount/retweetCount/replyCount/viewCount) were present — the API response shape may have changed. Leaving pinned-tweet.json untouched.',
		);
		process.exit(0);
	}
	if (missing.length > 0) {
		console.warn(
			`[fetch-tweets] Missing stat field(s), keeping previous values for: ${missing.map(({ key }) => key).join(', ')}`,
		);
	}

	const nextStats = {
		likes: toCount(raw.likeCount, pinned.stats?.likes ?? 0),
		retweets: toCount(raw.retweetCount, pinned.stats?.retweets ?? 0),
		replies: toCount(raw.replyCount, pinned.stats?.replies ?? 0),
		views: toCount(raw.viewCount, pinned.stats?.views ?? 0),
	};

	const updated = { ...pinned, stats: nextStats };
	writeFileSync(OUTPUT_PATH, JSON.stringify(updated, null, '\t') + '\n', 'utf-8');
	console.log(
		`[fetch-tweets] Updated stats: ❤ ${nextStats.likes}  ↻ ${nextStats.retweets}  💬 ${nextStats.replies}  👁 ${nextStats.views}`,
	);
}

main().catch((err) => {
	console.error('[fetch-tweets] Unexpected error:', err);
	process.exit(0);
});
