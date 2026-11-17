import type { LinkedInProfile } from '../types';

//* Company logos
import henryLogo from '../assets/companies/Henry.svg';
import yetaStudioLogo from '../assets/companies/YETAStudio.svg';
import typelandLogo from '../assets/companies/Typeland.svg';

export const linkedinProfile: LinkedInProfile = {
	name: 'Tobias Facello',
	headline: 'AI Developer \u00B7 Design Engineer \u00B7 TypeScript \u00B7 Next.js \u00B7 Node.js',
	position: 'AI Developer \u00B7 Design Engineer',
	company: 'Henry',
	location: 'Argentina',
	experience: [
		{
			title: 'AI Developer \u00B7 Design Engineer',
			company: 'Henry',
			companyLogo: henryLogo,
			period: 'Oct 2025 - Present',
			current: true,
		},
		{
			title: 'Fullstack Developer (UX-Oriented)',
			company: 'Yeta Studio',
			companyLogo: yetaStudioLogo,
			period: 'Jun 2024 - Oct 2025',
		},
		{
			title: 'Frontend Developer \u00B7 UX Designer',
			company: 'Typeland',
			companyLogo: typelandLogo,
			period: 'Feb 2023 - Jun 2024',
		},
	],
};
