import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

//? EN locales (always loaded — universal fallback)
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enWorks from './locales/en/works.json';
import enProjects from './locales/en/projects.json';

import { SUPPORTED_LANGUAGES } from './languages';

// Mirrored by the inline locale preload in index.html (vite.config.ts) — keep
// the two resolving the same language.
function getInitialLanguage(): string {
	const saved = localStorage.getItem('language');
	if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved;

	for (const lang of navigator.languages ?? [navigator.language]) {
		const code = lang.split('-')[0].toLowerCase();
		if (SUPPORTED_LANGUAGES.includes(code)) return code;
	}

	return 'en';
}

const initialLanguage = getInitialLanguage();
document.documentElement.lang = initialLanguage;

i18n.use(initReactI18next).init({
	resources: {
		en: {
			common: enCommon,
			home: enHome,
			works: enWorks,
			projects: enProjects,
		},
	},
	lng: initialLanguage,
	fallbackLng: 'en',
	defaultNS: 'common',
	interpolation: {
		escapeValue: false,
	},
});

const LAZY_BUNDLES = {
	es: () => import('./locales/es'),
	pt: () => import('./locales/pt'),
} as const;

const WORK_DETAIL_BUNDLES = {
	en: () => import('./locales/en/workDetail.json'),
	es: () => import('./locales/es/workDetail.json'),
	pt: () => import('./locales/pt/workDetail.json'),
} as const;

// Set once a work-detail page asks for its namespace, so later language
// switches fetch that namespace for the new language too.
let workDetailRequested = false;

export async function loadLanguageBundle(lang: string): Promise<void> {
	const pending: Promise<void>[] = [];
	if (lang in LAZY_BUNDLES && !i18n.hasResourceBundle(lang, 'common')) {
		pending.push(
			LAZY_BUNDLES[lang as keyof typeof LAZY_BUNDLES]().then(({ default: bundle }) => {
				for (const [ns, resources] of Object.entries(bundle)) {
					i18n.addResourceBundle(lang, ns, resources, true, true);
				}
			}),
		);
	}
	if (workDetailRequested) pending.push(loadWorkDetailNamespace(lang));
	await Promise.all(pending);
}

/**
 * Resolves once the initial language's strings are registered. main.tsx waits
 * on it before the first render, so non-English visitors get their language on
 * first paint instead of English that never re-renders (adding resources
 * doesn't notify react-i18next). A failed fetch falls back to English.
 */
export const i18nReady: Promise<void> =
	initialLanguage === 'en' ? Promise.resolve() : loadLanguageBundle(initialLanguage).catch(() => {});

// Only the active language's workDetail strings are fetched — the locales are
// key-for-key complete, so the English fallback is never needed.
export async function loadWorkDetailNamespace(lang: string = i18n.language): Promise<void> {
	workDetailRequested = true;
	const code = (lang in WORK_DETAIL_BUNDLES ? lang : 'en') as keyof typeof WORK_DETAIL_BUNDLES;
	if (i18n.hasResourceBundle(code, 'workDetail')) return;
	const { default: resources } = await WORK_DETAIL_BUNDLES[code]();
	i18n.addResourceBundle(code, 'workDetail', resources, true, true);
}

export default i18n;
