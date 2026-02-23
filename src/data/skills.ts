import BashIcon from '../assets/icons/Bash.svg';
import TSIcon from '../assets/icons/TypeScript.svg';
import NodeJSIcon from '../assets/icons/NodeJS.svg';
import JSIcon from '../assets/icons/JavaScript.svg';
import CSSIcon from '../assets/icons/CSS.svg';
import WCIcon from '../assets/icons/WebComponents.svg';
import ReactJSIcon from '../assets/icons/ReactJS.svg';
import NextJSIcon from '../assets/icons/NextJS.svg';
import ExpressJSIcon from '../assets/icons/ExpressJS.svg';
import PostmanIcon from '../assets/icons/Postman.svg';
import FirebaseIcon from '../assets/icons/Firebase.svg';
import PostgreSQLIcon from '../assets/icons/PostgreSQL.svg';
import SequelizeJSIcon from '../assets/icons/SequelizeJS.svg';
import PrismaIcon from '../assets/icons/Prisma.svg';
import GitIcon from '../assets/icons/Git.svg';
import ThreeJSIcon from '../assets/icons/ThreeJS.svg';
import FramerMotionIcon from '../assets/icons/FramerMotion.svg';
import FigmaIcon from '../assets/icons/Figma.svg';
import FramerIcon from '../assets/icons/Framer.svg';
import AISDKIcon from '../assets/icons/AISDK.svg';

export interface SkillIcon {
	src: string;
	title: string;
}

export const skillRows: SkillIcon[][] = [
	[
		{ src: BashIcon, title: 'Bash' },
		{ src: NodeJSIcon, title: 'Node.js' },
		{ src: JSIcon, title: 'JavaScript' },
		{ src: TSIcon, title: 'TypeScript' },
	],
	[
		{ src: CSSIcon, title: 'CSS' },
		{ src: WCIcon, title: 'Web Components' },
		{ src: ReactJSIcon, title: 'React.js' },
		{ src: NextJSIcon, title: 'Next.js' },
	],
	[
		{ src: ExpressJSIcon, title: 'Express.js' },
		{ src: PostmanIcon, title: 'Postman' },
		{ src: FirebaseIcon, title: 'Firebase' },
		{ src: PostgreSQLIcon, title: 'PostgreSQL' },
	],
	[
		{ src: SequelizeJSIcon, title: 'Sequelize' },
		{ src: PrismaIcon, title: 'Prisma' },
		{ src: GitIcon, title: 'Git' },
		{ src: ThreeJSIcon, title: 'Three.js' },
	],
	[
		{ src: FramerMotionIcon, title: 'Framer Motion' },
		{ src: FigmaIcon, title: 'Figma' },
		{ src: FramerIcon, title: 'Framer' },
		{ src: AISDKIcon, title: 'AI SDK' },
	],
];
