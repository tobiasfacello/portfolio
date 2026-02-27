import { iconRegistry } from '../components/Icon';

export const toolIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
	'Figma': iconRegistry.figma,
	'React': iconRegistry.react,
	'TypeScript': iconRegistry.typescript,
	'Styled Components': iconRegistry.styledComponents,
	'GSAP': iconRegistry.gsap,
	'Vite': iconRegistry.vite,
};
