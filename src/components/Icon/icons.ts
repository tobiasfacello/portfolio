//! SVG Icon Registry
//? Maps camelCase icon names to their SVGR component imports.
//? All SVG files live in src/assets/icons/ and are imported via Vite's ?react plugin.

//* Technology icons
import AISDKIcon from '../../assets/icons/AISDK.svg?react';
import BashIcon from '../../assets/icons/Bash.svg?react';
import CSSIcon from '../../assets/icons/CSS.svg?react';
import ExpressJSIcon from '../../assets/icons/ExpressJS.svg?react';
import FigmaIcon from '../../assets/icons/Figma.svg?react';
import FirebaseIcon from '../../assets/icons/Firebase.svg?react';
import FramerIcon from '../../assets/icons/Framer.svg?react';
import FramerMotionIcon from '../../assets/icons/FramerMotion.svg?react';
import GitIcon from '../../assets/icons/Git.svg?react';
import GSAPIcon from '../../assets/icons/GSAP.svg?react';
import JavaScriptIcon from '../../assets/icons/JavaScript.svg?react';
import NextJSIcon from '../../assets/icons/NextJS.svg?react';
import NodeJSIcon from '../../assets/icons/NodeJS.svg?react';
import OpenAIIcon from '../../assets/icons/OpenAI.svg?react';
import PostgreSQLIcon from '../../assets/icons/PostgreSQL.svg?react';
import PostmanIcon from '../../assets/icons/Postman.svg?react';
import PrismaIcon from '../../assets/icons/Prisma.svg?react';
import ReactJSIcon from '../../assets/icons/ReactJS.svg?react';
import SequelizeJSIcon from '../../assets/icons/SequelizeJS.svg?react';
import StyledComponentsIcon from '../../assets/icons/StyledComponents.svg?react';
import SupabaseIcon from '../../assets/icons/Supabase.svg?react';
import ThreeJSIcon from '../../assets/icons/ThreeJS.svg?react';
import TypeScriptIcon from '../../assets/icons/TypeScript.svg?react';
import ViteIcon from '../../assets/icons/Vite.svg?react';
import WebComponentsIcon from '../../assets/icons/WebComponents.svg?react';

//* Social icons
import ContraIcon from '../../assets/icons/Contra.svg?react';
import GithubIcon from '../../assets/icons/Github.svg?react';
import InstagramIcon from '../../assets/icons/Instagram.svg?react';
import LinkedinIcon from '../../assets/icons/Linkedin.svg?react';
import ThreadsIcon from '../../assets/icons/Threads.svg?react';
import TwitterIcon from '../../assets/icons/Twitter.svg?react';

//* UI icons
import ArrowRightCircleIcon from '../../assets/icons/arrow-right-circle.svg?react';
import ArrowUpRightIcon from '../../assets/icons/arrow-up-right.svg?react';
import ExternalLinkIcon from '../../assets/icons/external-link.svg?react';
import HammerIcon from '../../assets/icons/hammer.svg?react';
import PackageCheckIcon from '../../assets/icons/package-check.svg?react';
import PenLineIcon from '../../assets/icons/pen-line.svg?react';
import RadioTowerIcon from '../../assets/icons/radio-tower.svg?react';
import ToolCaseIcon from '../../assets/icons/tool-case.svg?react';

export const iconRegistry = {
	//* Technology
	aiSdk: AISDKIcon,
	bash: BashIcon,
	css: CSSIcon,
	expressJs: ExpressJSIcon,
	figma: FigmaIcon,
	firebase: FirebaseIcon,
	framer: FramerIcon,
	framerMotion: FramerMotionIcon,
	git: GitIcon,
	gsap: GSAPIcon,
	javascript: JavaScriptIcon,
	nextJs: NextJSIcon,
	nodeJs: NodeJSIcon,
	openAi: OpenAIIcon,
	postgreSql: PostgreSQLIcon,
	postman: PostmanIcon,
	prisma: PrismaIcon,
	react: ReactJSIcon,
	sequelizeJs: SequelizeJSIcon,
	styledComponents: StyledComponentsIcon,
	supabase: SupabaseIcon,
	threeJs: ThreeJSIcon,
	typescript: TypeScriptIcon,
	vite: ViteIcon,
	webComponents: WebComponentsIcon,

	//* Social
	contra: ContraIcon,
	github: GithubIcon,
	instagram: InstagramIcon,
	linkedin: LinkedinIcon,
	threads: ThreadsIcon,
	twitter: TwitterIcon,

	//* UI
	arrowRightCircle: ArrowRightCircleIcon,
	arrowUpRight: ArrowUpRightIcon,
	externalLink: ExternalLinkIcon,
	hammer: HammerIcon,
	packageCheck: PackageCheckIcon,
	penLine: PenLineIcon,
	radioTower: RadioTowerIcon,
	toolCase: ToolCaseIcon,
} as const;

export type IconName = keyof typeof iconRegistry;
