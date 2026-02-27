import centryBoardVector from '../assets/vectors/centryboard.svg';
import facheAIVector from '../assets/vectors/facheai.svg';
import facheVector from '../assets/vectors/fache.svg';

export interface ProjectItem {
	slug: string;
	src: string;
	url: string;
	tech: string[];
}

export const projects: ProjectItem[] = [
	{
		slug: 'centryboard',
		src: centryBoardVector,
		url: 'https://centryboard.site/',
		tech: ['Next.js', 'TypeScript', 'Supabase'],
	},
	{
		slug: 'fache-ai',
		src: facheAIVector,
		url: 'https://fache-ai-agent.vercel.app/',
		tech: ['Next.js', 'TypeScript', 'OpenAI'],
	},
	{
		slug: 'fache',
		src: facheVector,
		url: 'https://fache.vercel.app',
		tech: ['React', 'TypeScript', 'Vite'],
	},
];
