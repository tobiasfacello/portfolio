import styled from "styled-components";

//* Components
import Container from "./Container";
import WorkCard from "../WorkCard";
import Text from "../Text";

//* Assets
import patternVector from "../../assets/vectors/pattern-vector.svg";
import moldeLogo from "../../assets/works/molde.svg";
import indaloLogo from "../../assets/works/indalo.svg";
import clamacoLogo from "../../assets/works/clamaco.svg";

const StyledWorks = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 20px;
	border-top: 1px solid var(--secondary);
	background-image: url(${patternVector});
	background-size: auto;
	background-position: center;
	background-repeat: repeat;

	& .projects__title {
		width: 100%;
		display: flex;
		justify-content: start;
		align-items: center;
	}
`;

function Works() {
	return (
		<StyledWorks>
			<Container justify={"start"} align={"center"}>
				<Text variant={"subtitle-snd"} m={["m", "zero", "m", "zero"]}>
					WORKS
				</Text>
			</Container>
			<Container direction={"column"} justify={"center"} align={"center"}>
				<WorkCard
					title={"Molde"}
					tag={"Development"}
					details={"Landing Page for an architecture studio."}
					src={moldeLogo}
				></WorkCard>
				<WorkCard
					title={"Indalo"}
					tag={"Development"}
					details={"Landing Page for an enterprises group."}
					src={indaloLogo}
				></WorkCard>
				<WorkCard
					title={"Clamaco"}
					tag={"Design"}
					details={"Landing Page for a construction company."}
					src={clamacoLogo}
				></WorkCard>
			</Container>
		</StyledWorks>
	);
}

export default Works;
