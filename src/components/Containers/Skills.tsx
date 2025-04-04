import styled from "styled-components";
import MediaQuery from "react-responsive";

//* Components
import Container from "./Container";
import Text from "../Text";

//* Assets
import BashIcon from "../../assets/icons/Bash.svg";
import TSIcon from "../../assets/icons/TypeScript.svg";
import NodeJSIcon from "../../assets/icons/NodeJS.svg";
import JSIcon from "../../assets/icons/JavaScript.svg";
import CSSIcon from "../../assets/icons/CSS.svg";
import WCIcon from "../../assets/icons/WebComponents.svg";
import ReactJSIcon from "../../assets/icons/ReactJS.svg";
import NextJSIcon from "../../assets/icons/NextJS.svg";
import ExpressJSIcon from "../../assets/icons/ExpressJS.svg";
import PostmanIcon from "../../assets/icons/Postman.svg";
import FirebaseIcon from "../../assets/icons/Firebase.svg";
import PostgreSQLIcon from "../../assets/icons/PostgreSQL.svg";
import SequelizeJSIcon from "../../assets/icons/SequelizeJS.svg";
import PrismaIcon from "../../assets/icons/Prisma.svg";
import GitIcon from "../../assets/icons/Git.svg";
import ThreeJSIcon from "../../assets/icons/ThreeJS.svg";
import FramerMotionIcon from "../../assets/icons/FramerMotion.svg";
import FigmaIcon from "../../assets/icons/Figma.svg";
import FramerIcon from "../../assets/icons/Framer.svg";
import AISDKIcon from "../../assets/icons/AISDK.svg";

const StyledSkills = styled.div`
	width: 100%;
	height: 100%;
	padding: 0 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-top: 1px solid var(--secondary-60);

	@media (min-width: 960px) {
		& {
			width: 100%;
		}
	}

	@media (min-width: 1280px) {
		& {
			border: none;
			border-left: 1px solid var(--secondary-60);
			border-right: 1px solid var(--secondary-60);
		}
	}

	@media (min-width: 1440px) {
		& {
			padding: 0 10px;
		}
	}

	@media (min-width: 1800px) {
		& {
			padding: 0 10px;
		}
	}
`;

const StyledIcon = styled.img`
	width: 100%;
	height: 100%;
	max-width: 48px;
	max-height: 48px;
	color: var(--text);
	opacity: 0.8;
`;

function Skills() {
	return (
		<StyledSkills>
			<MediaQuery minWidth={360} maxWidth={767}>
				<Container
					w={"100%"}
					maxW={"500px"}
					h={"70%"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}
				>
					<Container
						w={"100%"}
						h={"100%"}
						justify={"flex-start"}
						align={"center"}
					>
						<Text alignment={"center"} variant={"subtitle-snd"} >
							SKILLS & TOOLS
						</Text>
					</Container>
					<Container
						justify={"space-between"}
						align={"center"}
					>
						<StyledIcon src={BashIcon} title="Bash" />
						<StyledIcon src={NodeJSIcon} title="Node.js" />
						<StyledIcon src={JSIcon} title="JavaScript" />
						<StyledIcon src={TSIcon} title="TypeScript" />
					</Container>
					<Container
						justify={"space-between"}
						align={"center"}
					>
						<StyledIcon src={CSSIcon} title="CSS" />
						<StyledIcon src={WCIcon} title="Web Components" />
						<StyledIcon src={ReactJSIcon} title="React.js" />
						<StyledIcon src={NextJSIcon} title="Next.js" />
					</Container>
					<Container justify={"space-between"} align={"center"}>
						<StyledIcon src={ExpressJSIcon} title="Express.js" />
						<StyledIcon src={PostmanIcon} title="Postman" />
						<StyledIcon src={FirebaseIcon} title="Firebase" />
						<StyledIcon src={PostgreSQLIcon} title="PostgreSQL" />
					</Container>
					<Container justify={"space-between"} align={"center"}>
						<StyledIcon src={SequelizeJSIcon} title="Sequelize" />
						<StyledIcon src={PrismaIcon} title="Prisma" />
						<StyledIcon src={GitIcon} title="Git" />
						<StyledIcon src={ThreeJSIcon} title="Three.js" />
					</Container>
					<Container justify={"space-between"} align={"center"}>
						<StyledIcon src={FramerMotionIcon} title="Framer Motion" />
						<StyledIcon src={FigmaIcon} title="Figma" />
						<StyledIcon src={FramerIcon} title="Framer" />
						<StyledIcon src={AISDKIcon} title="AI SDK" />
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={768} maxWidth={959}>
				<Container
					w={"80%"}
					h={"70%"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}
				>
					<Container
						w={"100%"}
						h={"100%"}
						justify={"flex-start"}
						align={"center"}
					>

						<Text variant={"subtitle-snd"}>
							SKILLS & TOOLS
						</Text>
					</Container>
					<Container
						h={"70%"}
						direction={"column"}
						justify={"center"}
						align={"center"}
						gap={"24px"}
					>
						<Container
							w={"100%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={BashIcon} title="Bash" />
							<StyledIcon src={NodeJSIcon} title="Node.js" />
							<StyledIcon src={JSIcon} title="JavaScript" />
							<StyledIcon src={TSIcon} title="TypeScript" />
						</Container>
						<Container
							w={"100%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={CSSIcon} title="CSS" />
							<StyledIcon src={WCIcon} title="Web Components" />
							<StyledIcon src={ReactJSIcon} title="React.js" />
							<StyledIcon src={NextJSIcon} title="Next.js" />
						</Container>
						<Container
							w={"100%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={ExpressJSIcon} title="Express.js" />
							<StyledIcon src={PostmanIcon} title="Postman" />
							<StyledIcon src={FirebaseIcon} title="Firebase" />
							<StyledIcon src={PostgreSQLIcon} title="PostgreSQL" />
						</Container>
						<Container
							w={"100%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={SequelizeJSIcon} title="Sequelize" />
							<StyledIcon src={PrismaIcon} title="Prisma" />
							<StyledIcon src={GitIcon} title="Git" />
							<StyledIcon src={ThreeJSIcon} title="Three.js" />
						</Container>
						<Container
							w={"100%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={FramerMotionIcon} title="Framer Motion" />
							<StyledIcon src={FigmaIcon} title="Figma" />
							<StyledIcon src={FramerIcon} title="Framer" />
							<StyledIcon src={AISDKIcon} title="AI SDK" />
						</Container>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={960} maxWidth={1279}>
				<Container
					w={"80%"}
					h={"100%"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}
				>
					<Container
						w={"100%"}
						h={"100%"}
						justify={"flex-start"}
						align={"center"}
					>
						<Text variant={"subtitle-snd"} >
							SKILLS & TOOLS
						</Text>
					</Container>
					<Container
						h={"70%"}
						direction={"column"}
						justify={"center"}
						align={"center"}
						gap={"24px"}
					>
						<Container
							w={"70%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={BashIcon} title="Bash" />
							<StyledIcon src={NodeJSIcon} title="Node.js" />
							<StyledIcon src={JSIcon} title="JavaScript" />
							<StyledIcon src={TSIcon} title="TypeScript" />
						</Container>
						<Container
							w={"70%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={CSSIcon} title="CSS" />
							<StyledIcon src={WCIcon} title="Web Components" />
							<StyledIcon src={ReactJSIcon} title="React.js" />
							<StyledIcon src={NextJSIcon} title="Next.js" />
						</Container>
						<Container
							w={"70%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={ExpressJSIcon} title="Express.js" />
							<StyledIcon src={PostmanIcon} title="Postman" />
							<StyledIcon src={FirebaseIcon} title="Firebase" />
							<StyledIcon src={PostgreSQLIcon} title="PostgreSQL" />
						</Container>
						<Container
							w={"70%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={SequelizeJSIcon} title="Sequelize" />
							<StyledIcon src={PrismaIcon} title="Prisma" />
							<StyledIcon src={GitIcon} title="Git" />
							<StyledIcon src={ThreeJSIcon} title="Three.js" />
						</Container>
						<Container
							w={"70%"}
							justify={"space-evenly"}
							align={"center"}
						>
							<StyledIcon src={FramerMotionIcon} title="Framer Motion" />
							<StyledIcon src={FigmaIcon} title="Figma" />
							<StyledIcon src={FramerIcon} title="Framer" />
							<StyledIcon src={AISDKIcon} title="AI SDK" />
						</Container>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1280} maxWidth={1439}>
				<Container
					w={"80%"}
					h={"100%"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}
				>
					<Container
						w={"100%"}
						h={"auto"}
						justify={"flex-start"}
						align={"center"}
					>
						<Text variant={"subtitle-snd"} >
							SKILLS & TOOLS
						</Text>
					</Container>
					<Container
						h={"100%"}
						direction={"column"}
						justify={"center"}
						align={"center"}
						gap={"24px"}
					>
						<Container
							justify={"space-between"}
							align={"center"}
						>
							<StyledIcon src={BashIcon} title="Bash" />
							<StyledIcon src={NodeJSIcon} title="Node.js" />
							<StyledIcon src={JSIcon} title="JavaScript" />
							<StyledIcon src={TSIcon} title="TypeScript" />
						</Container>
						<Container
							justify={"space-between"}
							align={"center"}
						>
							<StyledIcon src={CSSIcon} title="CSS" />
							<StyledIcon src={WCIcon} title="Web Components" />
							<StyledIcon src={ReactJSIcon} title="React.js" />
							<StyledIcon src={NextJSIcon} title="Next.js" />
						</Container>
						<Container justify={"space-between"} align={"center"}>
							<StyledIcon src={ExpressJSIcon} title="Express.js" />
							<StyledIcon src={PostmanIcon} title="Postman" />
							<StyledIcon src={FirebaseIcon} title="Firebase" />
							<StyledIcon src={PostgreSQLIcon} title="PostgreSQL" />
						</Container>
						<Container justify={"space-between"} align={"center"}>
							<StyledIcon src={SequelizeJSIcon} title="Sequelize" />
							<StyledIcon src={PrismaIcon} title="Prisma" />
							<StyledIcon src={GitIcon} title="Git" />
							<StyledIcon src={ThreeJSIcon} title="Three.js" />
						</Container>
						<Container justify={"space-between"} align={"center"}>
							<StyledIcon src={FramerMotionIcon} title="Framer Motion" />
							<StyledIcon src={FigmaIcon} title="Figma" />
							<StyledIcon src={FramerIcon} title="Framer" />
							<StyledIcon src={AISDKIcon} title="AI SDK" />
						</Container>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1440} maxWidth={1800}>
				<Container
					w={"80%"}
					h={"100%"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"space-between"}
					align={"center"}
					gap={"36px"}
				>
					<Container
						w={"100%"}
						h={"auto"}
						justify={"flex-start"}
						align={"center"}
					>
						<Text variant={"subtitle-snd"}>
							SKILLS & TOOLS
						</Text>
					</Container>
					<Container
						h={"100%"}
						direction={"column"}
						justify={"space-between"}
						align={"center"}
					>
						<Container
							justify={"space-between"}
							align={"center"}
						>
							<StyledIcon src={BashIcon} title="Bash" />
							<StyledIcon src={NodeJSIcon} title="Node.js" />
							<StyledIcon src={JSIcon} title="JavaScript" />
							<StyledIcon src={TSIcon} title="TypeScript" />
						</Container>
						<Container
							justify={"space-between"}
							align={"center"}
						>
							<StyledIcon src={CSSIcon} title="CSS" />
							<StyledIcon src={WCIcon} title="Web Components" />
							<StyledIcon src={ReactJSIcon} title="React.js" />
							<StyledIcon src={NextJSIcon} title="Next.js" />
						</Container>
						<Container justify={"space-between"} align={"center"}>
							<StyledIcon src={ExpressJSIcon} title="Express.js" />
							<StyledIcon src={PostmanIcon} title="Postman" />
							<StyledIcon src={FirebaseIcon} title="Firebase" />
							<StyledIcon src={PostgreSQLIcon} title="PostgreSQL" />
						</Container>
						<Container justify={"space-between"} align={"center"}>
							<StyledIcon src={SequelizeJSIcon} title="Sequelize" />
							<StyledIcon src={PrismaIcon} title="Prisma" />
							<StyledIcon src={GitIcon} title="Git" />
							<StyledIcon src={ThreeJSIcon} title="Three.js" />
						</Container>
						<Container justify={"space-between"} align={"center"}>
							<StyledIcon src={FramerMotionIcon} title="Framer Motion" />
							<StyledIcon src={FigmaIcon} title="Figma" />
							<StyledIcon src={FramerIcon} title="Framer" />
							<StyledIcon src={AISDKIcon} title="AI SDK" />
						</Container>
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1801}>
				<Text variant={"subtitle-snd"} m={["48", "0", "36", "0"]}>
					SKILLS & TOOLS
				</Text>
				<Container
					h={"70%"}
					m={["36", "0", "36", "0"]}
					p={["0", "72", "0", "72"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
				>
					<Container
						justify={"space-between"}
						align={"center"}
					>
						<StyledIcon src={BashIcon} title="Bash" />
						<StyledIcon src={NodeJSIcon} title="Node.js" />
						<StyledIcon src={JSIcon} title="JavaScript" />
						<StyledIcon src={TSIcon} title="TypeScript" />
					</Container>
					<Container
						justify={"space-between"}
						align={"center"}
					>
						<StyledIcon src={CSSIcon} title="CSS" />
						<StyledIcon src={WCIcon} title="Web Components" />
						<StyledIcon src={ReactJSIcon} title="React.js" />
						<StyledIcon src={NextJSIcon} title="Next.js" />
					</Container>
					<Container justify={"space-between"} align={"center"}>
						<StyledIcon src={ExpressJSIcon} title="Express.js" />
						<StyledIcon src={PostmanIcon} title="Postman" />
						<StyledIcon src={FirebaseIcon} title="Firebase" />
						<StyledIcon src={PostgreSQLIcon} title="PostgreSQL" />
					</Container>
					<Container justify={"space-between"} align={"center"}>
						<StyledIcon src={SequelizeJSIcon} title="Sequelize" />
						<StyledIcon src={PrismaIcon} title="Prisma" />
						<StyledIcon src={GitIcon} title="Git" />
						<StyledIcon src={ThreeJSIcon} title="Three.js" />
					</Container>
					<Container justify={"space-between"} align={"center"}>
						<StyledIcon src={FramerMotionIcon} title="Framer Motion" />
						<StyledIcon src={FigmaIcon} title="Figma" />
						<StyledIcon src={FramerIcon} title="Framer" />
						<StyledIcon src={AISDKIcon} title="AI SDK" />
					</Container>
				</Container>
			</MediaQuery>
		</StyledSkills>
	);
}

export default Skills;
