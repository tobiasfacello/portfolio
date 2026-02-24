import {
	BashIcon,
	NodeJSIcon,
	JSIcon,
	TSIcon,
	CSSIcon,
	WCIcon,
	ReactJSIcon,
	NextJSIcon,
	ExpressJSIcon,
	PostmanIcon,
	FirebaseIcon,
	PostgreSQLIcon,
	SequelizeJSIcon,
	PrismaIcon,
	GitIcon,
	ThreeJSIcon,
	FramerMotionIcon,
	FigmaIcon,
	FramerIcon,
	AISDKIcon,
} from './icons';

export interface SkillIcon {
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	title: string;
}

export const skillRows: SkillIcon[][] = [
	[
		{ Icon: BashIcon, title: 'Bash' },
		{ Icon: NodeJSIcon, title: 'Node.js' },
		{ Icon: JSIcon, title: 'JavaScript' },
		{ Icon: TSIcon, title: 'TypeScript' },
	],
	[
		{ Icon: CSSIcon, title: 'CSS' },
		{ Icon: WCIcon, title: 'Web Components' },
		{ Icon: ReactJSIcon, title: 'React.js' },
		{ Icon: NextJSIcon, title: 'Next.js' },
	],
	[
		{ Icon: ExpressJSIcon, title: 'Express.js' },
		{ Icon: PostmanIcon, title: 'Postman' },
		{ Icon: FirebaseIcon, title: 'Firebase' },
		{ Icon: PostgreSQLIcon, title: 'PostgreSQL' },
	],
	[
		{ Icon: SequelizeJSIcon, title: 'Sequelize' },
		{ Icon: PrismaIcon, title: 'Prisma' },
		{ Icon: GitIcon, title: 'Git' },
		{ Icon: ThreeJSIcon, title: 'Three.js' },
	],
	[
		{ Icon: FramerMotionIcon, title: 'Framer Motion' },
		{ Icon: FigmaIcon, title: 'Figma' },
		{ Icon: FramerIcon, title: 'Framer' },
		{ Icon: AISDKIcon, title: 'AI SDK' },
	],
];
