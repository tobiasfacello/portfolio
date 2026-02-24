import {
	FigmaIcon,
	ReactJSIcon,
	TSIcon,
	StyledComponentsIcon,
	GSAPIcon,
	ViteIcon,
} from './icons';

export const toolIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
	'Figma': FigmaIcon,
	'React': ReactJSIcon,
	'TypeScript': TSIcon,
	'Styled Components': StyledComponentsIcon,
	'GSAP': GSAPIcon,
	'Vite': ViteIcon,
};
