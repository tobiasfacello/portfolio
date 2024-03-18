import styled from "styled-components";

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
	padding: 0 20px;
	border-top: 1px solid var(--secondary);
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
			<Text variant={"subtitle-snd"} m={["m", "zero", "m", "zero"]}>
				SKILLS & TOOLS
			</Text>
			<Container
				m={["l", "zero", "l", "zero"]}
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
