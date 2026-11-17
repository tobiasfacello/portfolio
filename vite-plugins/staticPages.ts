// Build-time pages for crawlers and AI agents. The site renders in the browser,
// so the raw HTML used to be an empty #root. After the build this writes, per
// route, the page's text into its HTML (visually hidden; React replaces it on
// mount), a Markdown copy that vercel.json serves for `Accept: text/markdown`,
// plus llms.txt, sitemap.xml and a 404 page. The text comes from the English
// locale files the app itself renders, so the two can't drift apart.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';

import home from '../src/i18n/locales/en/home.json';
import works from '../src/i18n/locales/en/works.json';
import workDetail from '../src/i18n/locales/en/workDetail.json';
import projects from '../src/i18n/locales/en/projects.json';
import { CONTRA_URL, GITHUB_URL, LINKEDIN_URL, TWITTER_URL } from '../src/data/socialFeed';

export const SITE_URL = 'https://www.fache.com.ar';
// Must match index.html: the work pages swap these for their own values.
const HOME_TITLE = 'Tobias Facello (FACHE) • Frontend Developer Portfolio';
const HOME_DESCRIPTION =
	'Portfolio of Tobias Facello (Fache), frontend developer from Argentina: shipped client work, current projects and contact.';
const BOOKING_URL = 'https://cal.com/tobiasfacello';

type Item = { text: string; href?: string };
type Section = { heading?: string; paragraphs?: string[]; items?: Item[] };
type Page = { path: string; title: string; description: string; h1: string; sections: Section[] };

const slugs = (Object.keys(works) as (keyof typeof works)[]).filter((slug) => slug in workDetail);

const contact: Section = {
	heading: 'Contact',
	items: [
		{ text: 'Book a call', href: BOOKING_URL },
		{ text: 'LinkedIn', href: LINKEDIN_URL },
		{ text: 'GitHub', href: GITHUB_URL },
		{ text: 'X (Twitter)', href: TWITTER_URL },
		{ text: 'Contra', href: CONTRA_URL },
	],
};

const homePage: Page = {
	path: '/',
	title: HOME_TITLE,
	description: HOME_DESCRIPTION,
	h1: 'Tobias Facello — Frontend Developer',
	sections: [
		{ heading: 'About', paragraphs: home.about.paragraphs },
		{
			heading: 'Work',
			items: slugs.map((slug) => ({ text: `${works[slug].title} — ${works[slug].details}`, href: `/work/${slug}` })),
		},
		{
			heading: 'Projects',
			items: Object.values(projects).map((p) => ({
				text: `${p.title} — ${p.details}${'tag' in p ? ` (${p.tag})` : ''}`,
			})),
		},
		contact,
	],
};

const workPages: Page[] = slugs.map((slug) => {
	const work = works[slug];
	const detail = workDetail[slug];
	const labels = workDetail.sections;
	return {
		path: `/work/${slug}`,
		title: `${work.title} • FACHE`,
		description: `${work.details} ${detail.type} case study by Tobias Facello.`,
		h1: `${work.title} — ${detail.livePreviewDescription}`,
		sections: [
			{
				heading: labels.overview,
				paragraphs: [detail.overview, `${labels.publishedDate}: ${detail.publishedDate}. ${labels.outcome}: ${detail.outcome}.`],
				items: [{ text: `${labels.livePreview}: ${detail.livePreviewUrl}`, href: `https://${detail.livePreviewUrl}` }],
			},
			{ heading: labels.process, paragraphs: Object.values(detail.process).map((step) => `${step.title}: ${step.content}`) },
			{ heading: labels.roles, items: detail.roles.map((text) => ({ text })) },
			{ heading: labels.tools, items: detail.tools.map((text) => ({ text })) },
			{ heading: labels.collaborators, items: detail.collaborators.map((text) => ({ text })) },
			{ items: [{ text: 'All work by Tobias Facello', href: '/' }] },
		],
	};
});

const notFoundPage: Page = {
	path: '/404',
	title: 'Page not found • FACHE',
	description: HOME_DESCRIPTION,
	h1: 'Page not found',
	sections: [
		{
			paragraphs: ["This page doesn't exist on Tobias Facello's portfolio."],
			items: [
				{ text: 'Homepage', href: '/' },
				{ text: 'Sitemap', href: '/sitemap.xml' },
				{ text: 'Site guide for AI agents (llms.txt)', href: '/llms.txt' },
			],
		},
	],
};

const absolute = (href: string) => (href.startsWith('/') ? SITE_URL + href : href);

const escapeHtml = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function toMarkdown(page: Page): string {
	const lines = [`# ${page.h1}`, ''];
	for (const section of page.sections) {
		if (section.heading) lines.push(`## ${section.heading}`, '');
		for (const text of section.paragraphs ?? []) lines.push(text, '');
		for (const item of section.items ?? []) lines.push(item.href ? `- [${item.text}](${absolute(item.href)})` : `- ${item.text}`);
		if (section.items?.length) lines.push('');
	}
	return lines.join('\n');
}

function toHtml(page: Page): string {
	const parts = [`<h1>${escapeHtml(page.h1)}</h1>`];
	for (const section of page.sections) {
		if (section.heading) parts.push(`<h2>${escapeHtml(section.heading)}</h2>`);
		for (const text of section.paragraphs ?? []) parts.push(`<p>${escapeHtml(text)}</p>`);
		if (section.items?.length) {
			const items = section.items.map((item) =>
				item.href ? `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.text)}</a></li>` : `<li>${escapeHtml(item.text)}</li>`,
			);
			parts.push(`<ul>${items.join('')}</ul>`);
		}
	}
	return `<div class="prerender">${parts.join('')}</div>`;
}

function replaceOnce(html: string, search: string | RegExp, replacement: string): string {
	const next = html.replace(search, replacement);
	if (next === html) throw new Error(`static-pages: ${search} not found in index.html`);
	return next;
}

// The page's own <head> values and text, on top of the built index.html.
function pageHtml(shell: string, page: Page): string {
	let html = replaceOnce(shell, '<div id="root"></div>', `<div id="root">${toHtml(page)}</div>`);
	if (page.path === '/') return html;
	html = html.replaceAll(HOME_TITLE, escapeHtml(page.title)).replaceAll(HOME_DESCRIPTION, escapeHtml(page.description));
	if (page === notFoundPage) {
		html = replaceOnce(html, /\s*<link rel="canonical"[^>]*>/, '');
		return replaceOnce(html, 'content="index, follow"', 'content="noindex"');
	}
	return html.replaceAll(`"${SITE_URL}/"`, `"${SITE_URL}${page.path}"`);
}

function llmsTxt(): string {
	return [
		'# Tobias Facello (FACHE)',
		'',
		'> Personal portfolio of Tobias Facello ("Fache"), a developer from Argentina: shipped client work, current projects and contact.',
		'',
		...home.about.paragraphs.flatMap((paragraph) => [paragraph, '']),
		'## When to use this site',
		'',
		'- Someone asks who Tobias Facello (Fache) is, what Tobias builds or which technologies Tobias works with.',
		"- You need examples of shipped client work: each case study lists the role, process, tools and live site.",
		'- Someone wants to hire or contact Tobias: book a call or write on LinkedIn (links below).',
		'',
		'Pages render in the browser. Each one has a Markdown version: request the page with `Accept: text/markdown`, or open the .md links below.',
		'',
		'## Pages',
		'',
		`- [Home](${SITE_URL}/index.md): about, shipped work, current projects and contact`,
		...slugs.map((slug) => `- [${works[slug].title}](${SITE_URL}/work/${slug}.md): ${works[slug].details}`),
		'',
		'## Contact',
		'',
		...contact.items!.map((item) => `- [${item.text}](${item.href})`),
		'',
	].join('\n');
}

function sitemapXml(): string {
	const today = new Date().toISOString().slice(0, 10);
	const urls = [homePage, ...workPages].map(
		(page) => `  <url>\n    <loc>${SITE_URL}${page.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
	);
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export function staticPages(): Plugin {
	return {
		name: 'static-pages',
		apply: 'build',
		writeBundle({ dir }) {
			if (!dir) return;
			const write = (file: string, content: string) => {
				mkdirSync(dirname(join(dir, file)), { recursive: true });
				writeFileSync(join(dir, file), content);
			};
			const shell = readFileSync(join(dir, 'index.html'), 'utf8');

			write('index.html', pageHtml(shell, homePage));
			write('index.md', toMarkdown(homePage));
			for (const page of workPages) {
				write(`${page.path.slice(1)}.html`, pageHtml(shell, page));
				write(`${page.path.slice(1)}.md`, toMarkdown(page));
			}
			write('404.html', pageHtml(shell, notFoundPage));
			write('404.md', toMarkdown(notFoundPage));
			write('llms.txt', llmsTxt());
			write('sitemap.xml', sitemapXml());
		},
	};
}
