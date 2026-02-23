import moldeLogo from '../assets/works/molde.svg';
import indaloLogo from '../assets/works/indalo.svg';
import ranchoLogo from '../assets/works/rancho.svg';
import clamacoLogo from '../assets/works/clamaco.svg';

export interface WorkItem {
	title: string;
	tags: string[];
	details: string;
	url: string;
	showcaseUrl?: string;
	src: string;
}

export const works: WorkItem[] = [
	{
		title: 'Molde',
		tags: ['Development'],
		details: 'Landing Page for an architecture studio.',
		url: 'https://www.estudiomolde.com/',
		showcaseUrl: 'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development',
		src: moldeLogo,
	},
	{
		title: 'Indalo',
		tags: ['Development'],
		details: 'Landing Page for an enterprises group',
		url: 'https://www.grupoindalo.com.ar/',
		showcaseUrl: 'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development',
		src: indaloLogo,
	},
	{
		title: 'Rancho',
		tags: ['Design', 'Development'],
		details: 'Landing Page for a rental business',
		url: 'https://bungalowselrancho.com.ar/',
		showcaseUrl:
			'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development',
		src: ranchoLogo,
	},
	{
		title: 'Clamaco',
		tags: ['Design'],
		details: 'Landing Page for a construction company',
		url: 'https://clamaco.com.ar/',
		src: clamacoLogo,
	},
];
