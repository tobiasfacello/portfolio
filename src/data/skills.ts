import { iconRegistry } from '../components/Icon';

export interface SkillIcon {
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	title: string;
}

export const skillRows: SkillIcon[][] = [
	[
		{ Icon: iconRegistry.bash, title: 'Bash' },
		{ Icon: iconRegistry.nodeJs, title: 'Node.js' },
		{ Icon: iconRegistry.javascript, title: 'JavaScript' },
		{ Icon: iconRegistry.typescript, title: 'TypeScript' },
	],
	[
		{ Icon: iconRegistry.css, title: 'CSS' },
		{ Icon: iconRegistry.webComponents, title: 'Web Components' },
		{ Icon: iconRegistry.react, title: 'React.js' },
		{ Icon: iconRegistry.nextJs, title: 'Next.js' },
	],
	[
		{ Icon: iconRegistry.expressJs, title: 'Express.js' },
		{ Icon: iconRegistry.postman, title: 'Postman' },
		{ Icon: iconRegistry.firebase, title: 'Firebase' },
		{ Icon: iconRegistry.postgreSql, title: 'PostgreSQL' },
	],
	[
		{ Icon: iconRegistry.sequelizeJs, title: 'Sequelize' },
		{ Icon: iconRegistry.prisma, title: 'Prisma' },
		{ Icon: iconRegistry.git, title: 'Git' },
		{ Icon: iconRegistry.threeJs, title: 'Three.js' },
	],
	[
		{ Icon: iconRegistry.framerMotion, title: 'Framer Motion' },
		{ Icon: iconRegistry.figma, title: 'Figma' },
		{ Icon: iconRegistry.framer, title: 'Framer' },
		{ Icon: iconRegistry.aiSdk, title: 'AI SDK' },
	],
];
