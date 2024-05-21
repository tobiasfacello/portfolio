import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

//* Components
import Container from "./Container";
import Text from "../Text";

//* Assets
import BashIcon from "../../assets/icons/Bash.svg";
import HTMLIcon from "../../assets/icons/HTML.svg";
import CSSIcon from "../../assets/icons/CSS.svg";
import JSIcon from "../../assets/icons/JavaScript.svg";
import TSIcon from "../../assets/icons/TypeScript.svg";
import NodeJSIcon from "../../assets/icons/NodeJS.svg";
import ReactJSIcon from "../../assets/icons/ReactJS.svg";
import ThreeJSIcon from "../../assets/icons/ThreeJS.svg";
import VSCIcon from "../../assets/icons/VSC.svg";
import GitIcon from "../../assets/icons/Git.svg";
import PostmanIcon from "../../assets/icons/Postman.svg";
import FirebaseIcon from "../../assets/icons/Firebase.svg";

const StyledSkills = styled.div`
	width: 100%;
	height: 100%;
	padding: 0 10px;
	border-top: 1px solid var(--secondary-60);

	@media (min-width: 960px) {
		& {
			width: 100%;
		}
	}

	@media (min-width: 1440px) {
		& {
			border: none;
			border-left: 1px solid var(--secondary-60);
			border-right: 1px solid var(--secondary-60);
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
	const isDesktop = useMediaQuery({ minWidth: 960 });
	return (
		<StyledSkills>
			<Text
				variant={"subtitle-snd"}
				m={
					isDesktop
						? ["xl", "zero", "l", "zero"]
						: ["m", "zero", "m", "zero"]
				}
			>
				SKILLS & TOOLS
			</Text>
			<Container
				h={"70%"}
				m={["l", "zero", "l", "zero"]}
				p={isDesktop ? ["zero", "xxxl", "zero", "xxxl"] : ""}
				direction={"column"}
				justify={"center"}
				align={"center"}
			>
				<Container
					m={["zero", "zero", "l", "zero"]}
					justify={"space-evenly"}
					align={"center"}
				>
					<StyledIcon src={BashIcon}></StyledIcon>
					<StyledIcon src={JSIcon}></StyledIcon>
					<StyledIcon src={TSIcon}></StyledIcon>
					<StyledIcon src={NodeJSIcon}></StyledIcon>
				</Container>
				<Container
					m={["zero", "zero", "l", "zero"]}
					justify={"space-evenly"}
					align={"center"}
				>
					<StyledIcon src={HTMLIcon}></StyledIcon>
					<StyledIcon src={CSSIcon}></StyledIcon>
					<StyledIcon src={ReactJSIcon}></StyledIcon>
					<StyledIcon src={ThreeJSIcon}></StyledIcon>
				</Container>
				<Container justify={"space-evenly"} align={"center"}>
					<StyledIcon src={VSCIcon}></StyledIcon>
					<StyledIcon src={GitIcon}></StyledIcon>
					<StyledIcon src={PostmanIcon}></StyledIcon>
					<StyledIcon src={FirebaseIcon}></StyledIcon>
				</Container>
			</Container>
		</StyledSkills>
	);
}

export default Skills;
