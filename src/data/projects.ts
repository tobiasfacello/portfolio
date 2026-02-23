import centryBoardVector from '../assets/vectors/centryboard.svg';
import facheAIVector from '../assets/vectors/facheai.svg';
import facheVector from '../assets/vectors/fache.svg';

export interface ProjectItem {
	title: string;
	details: string;
	tag: string;
	src: string;
	url: string;
}

export const projects: ProjectItem[] = [
	{
		title: 'CentryBoard',
		details: 'Productivity Booster App',
		tag: 'Work in progress',
		src: centryBoardVector,
		url: 'https://centryboard.site/',
	},
	{
		title: 'fache.ai',
		details: 'AI Assistant App',
		tag: 'Work in progress',
		src: facheAIVector,
		url: 'https://fache-ai-agent.vercel.app/',
	},
	{
		title: 'fache.',
		details: 'Personal Website',
		tag: 'V2.0',
		src: facheVector,
		url: 'https://fache.vercel.app',
	},
];
