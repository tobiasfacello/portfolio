import type { Tweet, TwitterProfile, LinkedInProfile } from '../types';

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

export const staticTwitterProfile: TwitterProfile = {
	name: '',
	username: 'fachebits',
	description: '',
	profileImageUrl: '',
	followers: 0,
	following: 0,
	tweetCount: 0,
};

export const staticTweets: Tweet[] = [
	{
		id: '1',
		text: 'Shipping a new portfolio built with React 19, GSAP animations, and smooth scroll. Check it out!',
		date: '2025-01-15',
		url: 'https://x.com/fachebits',
	},
	{
		id: '2',
		text: 'TypeScript + styled-components + Vite = the perfect stack for a fast, type-safe frontend.',
		date: '2025-01-10',
		url: 'https://x.com/fachebits',
	},
	{
		id: '3',
		text: 'Just explored GSAP quickTo() for cursor animations. The easing feels incredibly smooth.',
		date: '2025-01-05',
		url: 'https://x.com/fachebits',
	},
	{
		id: '4',
		text: 'Been diving deep into Lenis for smooth scroll — the lerp config makes a huge difference in feel.',
		date: '2025-01-03',
		url: 'https://x.com/fachebits',
	},
	{
		id: '5',
		text: 'Dark mode support with CSS custom properties is underrated. One source of truth for all your colors.',
		date: '2024-12-28',
		url: 'https://x.com/fachebits',
	},
];
