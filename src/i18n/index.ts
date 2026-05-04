import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

//? EN locales (always loaded — universal fallback)
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enWorks from './locales/en/works.json';
import enProjects from './locales/en/projects.json';

const SUPPORTED_LANGUAGES = ['en', 'es', 'pt'];

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
	es: () => Promise.all([
		import('./locales/es/common.json'),
		import('./locales/es/home.json'),
		import('./locales/es/works.json'),
		import('./locales/es/projects.json'),
	]),
	pt: () => Promise.all([
		import('./locales/pt/common.json'),
		import('./locales/pt/home.json'),
		import('./locales/pt/works.json'),
		import('./locales/pt/projects.json'),
	]),
} as const;

export async function loadLanguageBundle(lang: string): Promise<void> {
	if (!(lang in LAZY_BUNDLES)) return;
	if (i18n.hasResourceBundle(lang, 'common')) return;
	const [common, home, works, projects] = await LAZY_BUNDLES[lang as keyof typeof LAZY_BUNDLES]();
	i18n.addResourceBundle(lang, 'common', common.default, true, true);
	i18n.addResourceBundle(lang, 'home', home.default, true, true);
	i18n.addResourceBundle(lang, 'works', works.default, true, true);
	i18n.addResourceBundle(lang, 'projects', projects.default, true, true);
}

// Load the initial language bundle if it isn't English
if (initialLanguage !== 'en') {
	loadLanguageBundle(initialLanguage);
}

let workDetailLoaded = false;

export async function loadWorkDetailNamespace() {
	if (workDetailLoaded) return;
	const [en, es, pt] = await Promise.all([
		import('./locales/en/workDetail.json'),
		import('./locales/es/workDetail.json'),
		import('./locales/pt/workDetail.json'),
	]);
	i18n.addResourceBundle('en', 'workDetail', en.default, true, true);
	i18n.addResourceBundle('es', 'workDetail', es.default, true, true);
	i18n.addResourceBundle('pt', 'workDetail', pt.default, true, true);
	workDetailLoaded = true;
}

export default i18n;
