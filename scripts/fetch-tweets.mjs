#!/usr/bin/env node

/**
 * Fetches metadata for the pinned tweet referenced by the activity widget and
 * writes it to src/data/pinned-tweet.json. Media attachments (photo / gif /
 * video posters) are downloaded into public/ so the bundle stays self-contained
 * at runtime — no third-party CDN dependency once the build is shipped.
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
 * If the env var is missing, the script logs a warning and exits without
 * touching pinned-tweet.json so the build still succeeds against the committed
 * fallback data.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_PATH = join(ROOT, 'src', 'data', 'pinned-tweet.json');
const PUBLIC_DIR = join(ROOT, 'public');

const PINNED_TWEET_ID = '2056714255550882288';
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

function pickFirst(...candidates) {
	for (const c of candidates) {
		if (c !== undefined && c !== null && c !== '') return c;
	}
	return undefined;
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

// Resolve a media object from the raw tweet, handling several payload shapes
// the twitterapi.io endpoint may return depending on the upstream Twitter
// response (entities.media, extendedEntities.media, top-level media, etc).
function extractMedia(rawTweet) {
	const candidates = [
		rawTweet?.extendedEntities?.media,
		rawTweet?.extended_entities?.media,
		rawTweet?.entities?.media,
		rawTweet?.media,
	];
	const list = candidates.find((c) => Array.isArray(c) && c.length > 0);
	if (!list) return [];

	return list.map((m) => {
		const rawType = m?.type ?? m?.mediaType ?? 'photo';
		const type = rawType === 'animated_gif' ? 'gif' : rawType;

		// For photos: media_url_https / url / media_url
		// For video/gif: variants[].url (pick highest bitrate) — but we use the
		// poster image for static preview. Falls back to media_url_https.
		const url = pickFirst(
			m?.media_url_https,
			m?.media_url,
			m?.url,
			m?.display_url,
		);

		return {
			type,
			remoteUrl: url,
			width: m?.original_info?.width ?? m?.sizes?.large?.w,
			height: m?.original_info?.height ?? m?.sizes?.large?.h,
		};
	}).filter((m) => Boolean(m.remoteUrl));
}

function extensionForContentType(contentType, fallbackUrl = '') {
	if (contentType?.includes('webp')) return 'webp';
	if (contentType?.includes('jpeg')) return 'jpg';
	if (contentType?.includes('png')) return 'png';
	if (contentType?.includes('gif')) return 'gif';
	if (contentType?.includes('mp4')) return 'mp4';
	// Fallback: try to read from the URL
	const match = fallbackUrl.match(/\.(webp|jpe?g|png|gif|mp4)(?:\?|$)/i);
	if (match) return match[1].toLowerCase().replace('jpeg', 'jpg');
	return 'jpg';
}

async function downloadMediaTo(publicPath, remoteUrl) {
	const { signal, clear } = withTimeout(FETCH_TIMEOUT_MS);
	try {
		const res = await fetch(remoteUrl, { signal });
		if (!res.ok) throw new Error(`media fetch HTTP ${res.status}`);
		const contentType = res.headers.get('content-type') ?? '';
		const ext = extensionForContentType(contentType, remoteUrl);
		const buf = Buffer.from(await res.arrayBuffer());
		const filename = `${publicPath}.${ext}`;
		writeFileSync(join(PUBLIC_DIR, filename), buf);
		return { filename: `/${filename}`, ext };
	} finally {
		clear();
	}
}

// ── Main ─────────────────────────────────────────────────

async function main() {
	const apiKey = process.env.TWITTERAPI_IO_KEY;
	if (!apiKey) {
		console.warn('[fetch-tweets] TWITTERAPI_IO_KEY not set — skipping refresh.');
		console.warn('[fetch-tweets] Existing src/data/pinned-tweet.json is preserved.');
		return;
	}

	console.log(`[fetch-tweets] Fetching pinned tweet ${PINNED_TWEET_ID}…`);

	let body;
	try {
		body = await callApi('/twitter/tweets', { tweet_ids: PINNED_TWEET_ID }, apiKey);
	} catch (err) {
		console.error('[fetch-tweets] Request failed:', err?.message ?? err);
		process.exit(0); // non-fatal — committed pinned-tweet.json keeps the build green
	}

	if (body?.status && body.status !== 'success') {
		console.error(`[fetch-tweets] API status="${body.status}": ${body.msg ?? body.message ?? ''}`);
		process.exit(0);
	}

	// Support both shapes — top-level `tweets` array (documented) or nested
	// under `data` for defensive parity with the previous endpoint.
	const tweetsArr = body?.tweets ?? body?.data?.tweets ?? [];
	const raw = Array.isArray(tweetsArr) ? tweetsArr[0] : null;
	if (!raw) {
		console.warn('[fetch-tweets] API returned no tweet — keeping existing data.');
		return;
	}

	const author = raw.author ?? {};
	const userName = pickFirst(author.screen_name, author.userName, 'fachebits');

	const media = extractMedia(raw);
	const downloadedMedia = [];
	for (let i = 0; i < media.length; i += 1) {
		const m = media[i];
		try {
			const { filename } = await downloadMediaTo(`pinned-tweet-${i}`, m.remoteUrl);
			downloadedMedia.push({
				type: m.type,
				src: filename,
				...(m.width ? { width: m.width } : {}),
				...(m.height ? { height: m.height } : {}),
			});
			console.log(`[fetch-tweets] Saved media → public${filename}`);
		} catch (err) {
			console.warn(`[fetch-tweets] Could not download media[${i}]: ${err?.message ?? err}`);
		}
	}

	const pinnedTweet = {
		id: String(raw.id ?? PINNED_TWEET_ID),
		text: cleanText(String(raw.text ?? '')),
		date: toIsoDate(raw.createdAt ?? raw.created_at),
		url: `https://twitter.com/${userName}/status/${raw.id ?? PINNED_TWEET_ID}`,
		author: {
			name: String(author.name ?? ''),
			userName: String(userName),
			profilePicture: pickFirst(author.profile_image_url, author.profilePicture) || undefined,
			isVerified: Boolean(pickFirst(author.verified, author.isVerified, false)),
		},
		media: downloadedMedia,
		stats: {
			likes: Number(raw.likeCount ?? 0),
			retweets: Number(raw.retweetCount ?? 0),
			replies: Number(raw.replyCount ?? 0),
			views: Number(raw.viewCount ?? 0),
		},
	};

	writeFileSync(OUTPUT_PATH, JSON.stringify(pinnedTweet, null, '\t') + '\n', 'utf-8');
	console.log(`[fetch-tweets] Wrote pinned tweet to src/data/pinned-tweet.json.`);
}

main().catch((err) => {
	console.error('[fetch-tweets] Unexpected error:', err);
	process.exit(0);
});
