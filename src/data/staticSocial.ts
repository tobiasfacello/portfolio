import type { LinkedInProfile } from '../types';

//* Company logos (dark)
import henryLogo from '../assets/companies/Henry.svg';
import yetaStudioLogo from '../assets/companies/YETAStudio.svg';
import typelandLogo from '../assets/companies/Typeland.svg';

//* Company logos (light)
import henryLogoLight from '../assets/companies/HenryLight.svg';
import yetaStudioLogoLight from '../assets/companies/YETAStudioLight.svg';
import typelandLogoLight from '../assets/companies/TypelandLight.svg';

export const linkedinProfile: LinkedInProfile = {
	name: 'Tobias Facello',
	headline: 'AI Developer \u00B7 UX Engineer \u00B7 TypeScript \u00B7 Next.js \u00B7 Node.js',
	position: 'AI Developer \u00B7 UX Engineer',
	company: 'Henry',
	location: 'Argentina',
	experience: [
		{
			title: 'AI Developer \u00B7 UX Engineer',
			company: 'Henry',
			companyLogo: henryLogo,
			companyLogoLight: henryLogoLight,
			period: 'Oct 2025 - Present',
			current: true,
		},
		{
			title: 'Fullstack Developer (UX-Oriented)',
			company: 'Yeta Studio',
			companyLogo: yetaStudioLogo,
			companyLogoLight: yetaStudioLogoLight,
			period: 'Jun 2024 - Oct 2025',
		},
		{
			title: 'Frontend Developer \u00B7 UX Designer',
			company: 'Typeland',
			companyLogo: typelandLogo,
			companyLogoLight: typelandLogoLight,
			period: 'Feb 2023 - Jun 2024',
		},
	],
};
