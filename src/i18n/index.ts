import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

//? EN locales
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enWorks from './locales/en/works.json';
import enProjects from './locales/en/projects.json';

//? ES locales
import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';
import esWorks from './locales/es/works.json';
import esProjects from './locales/es/projects.json';

//? PT locales
import ptCommon from './locales/pt/common.json';
import ptHome from './locales/pt/home.json';
import ptWorks from './locales/pt/works.json';
import ptProjects from './locales/pt/projects.json';

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
		es: {
			common: esCommon,
			home: esHome,
			works: esWorks,
			projects: esProjects,
		},
		pt: {
			common: ptCommon,
			home: ptHome,
			works: ptWorks,
			projects: ptProjects,
		},
	},
	lng: initialLanguage,
	fallbackLng: 'en',
	defaultNS: 'common',
	interpolation: {
		escapeValue: false,
	},
});

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
