import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

//* Components
import Container from "../../components/Containers/Container";
import ProjectCard from "../../components/ProjectCard";
import Text from "../../components/Text";

//* Assets
import patternVector from "../../assets/vectors/pattern-vector.svg";
import portfolioVector from "../../assets/vectors/portfolio-vector.svg";
import chatAppVector from "../../assets/vectors/chatapp-vector.svg";
import rpsVector from "../../assets/vectors/rps-vector.svg";

const StyledProjects = styled.div`
	width: 100%;
	height: 100%;
	padding: 0 20px;
	border-top: 1px solid var(--secondary-60);
	background-image: url(${patternVector});
	background-size: auto;
	background-position: top center;
	background-repeat: repeat;

	@media (min-width: 960px) {
		& {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border: none;
			border-left: 1px solid var(--secondary-60);
			border-right: 1px solid var(--secondary-60);
		}
	}
`;

function Projects() {
	const isDesktop = useMediaQuery({ minWidth: "960px" });

	return (
		<StyledProjects>
			<Container h={"auto"} w={"70%"} justify={"start"} align={"center"}>
				<Text
					variant={"subtitle-snd"}
					m={
						isDesktop
							? ["xxl", "zero", "l", "zero"]
							: ["m", "zero", "m", "zero"]
					}
				>
					PROJECTS
				</Text>
			</Container>
			<Container direction={"column"} justify={"center"} align={"center"}>
				<ProjectCard
					title={"Portfolio"}
					details={"Personal Website"}
					src={portfolioVector}
				></ProjectCard>
				<ProjectCard
					title={"Apxgram"}
					details={"Realtime Chat App"}
					src={chatAppVector}
				></ProjectCard>
				<ProjectCard
					title={"RPS"}
					details={"Realtime Game"}
					src={rpsVector}
				></ProjectCard>
			</Container>
		</StyledProjects>
	);
}

export default Projects;
