import centryBoardVector from '../assets/vectors/centryboard.svg';
import facheAIVector from '../assets/vectors/facheai.svg';
import facheVector from '../assets/vectors/fache.svg';

export interface ProjectItem {
	slug: string;
	src: string;
	url: string;
}

export const projects: ProjectItem[] = [
	{
		slug: 'centryboard',
		src: centryBoardVector,
		url: 'https://centryboard.site/',
	},
	{
		slug: 'fache-ai',
		src: facheAIVector,
		url: 'https://fache-ai-agent.vercel.app/',
	},
	{
		slug: 'fache',
		src: facheVector,
		url: 'https://fache.vercel.app',
	},
];
