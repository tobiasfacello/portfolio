import MoldeLogo from '../assets/works/molde.svg?react';
import IndaloLogo from '../assets/works/indalo.svg?react';
import RanchoLogo from '../assets/works/rancho.svg?react';

export interface WorkItem {
	slug: string;
	url: string;
	showcaseUrl?: string;
	Logo: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const works: WorkItem[] = [
	{
		slug: 'molde',
		url: 'https://www.estudiomolde.com/',
		showcaseUrl: 'https://contra.com/p/o3YcvW6c-molde-architecture-studio-development',
		Logo: MoldeLogo,
	},
	{
		slug: 'indalo',
		url: 'https://www.grupoindalo.com.ar/',
		showcaseUrl: 'https://contra.com/p/WPl3g6WF-indalo-enterprises-group-development',
		Logo: IndaloLogo,
	},
	{
		slug: 'rancho',
		url: 'https://bungalowselrancho.com.ar/',
		showcaseUrl:
			'https://contra.com/p/XFlM23XE-el-rancho-family-run-rental-business-design-and-development',
		Logo: RanchoLogo,
	},
];

export function hasDetailPage(work: WorkItem): boolean {
	return !!work.showcaseUrl;
}

export function getWorkBySlug(slug: string): WorkItem | undefined {
	return works.find((w) => w.slug === slug);
}
