import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

//? EN locales
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enWorks from './locales/en/works.json';
import enProjects from './locales/en/projects.json';
import enWorkDetail from './locales/en/workDetail.json';

//? ES locales
import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';
import esWorks from './locales/es/works.json';
import esProjects from './locales/es/projects.json';
import esWorkDetail from './locales/es/workDetail.json';

i18n.use(initReactI18next).init({
	resources: {
		en: {
			common: enCommon,
			home: enHome,
			works: enWorks,
			projects: enProjects,
			workDetail: enWorkDetail,
		},
		es: {
			common: esCommon,
			home: esHome,
			works: esWorks,
			projects: esProjects,
			workDetail: esWorkDetail,
		},
	},
	lng: localStorage.getItem('language') || 'en',
	fallbackLng: 'en',
	defaultNS: 'common',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
