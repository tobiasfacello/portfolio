import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

//* Components
import Container from "./Container";
import WorkCardsCarousel from "../WorkCardsCarousel";
import Text from "../Text";

//* Assets
import patternVector from "../../assets/vectors/pattern-vector.svg";

const StyledWorks = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0 20px;
	border-top: 1px solid var(--secondary-60);
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

	@media (min-width: 960px) {
		& {
			width: 100vw;
		}
	}

	@media (min-width: 1440px) {
		& {
			width: 200%;
			border: none;
			border-right: 1px solid var(--secondary-60);
		}
	}
`;

function Works() {
	const isDesktop = useMediaQuery({ minWidth: 1440 });

	return (
		<StyledWorks>
			<Container h={"auto"} w={"90%"} justify={"start"} align={"center"}>
				<Text
					variant={"subtitle-snd"}
					m={
						isDesktop
							? ["xl", "zero", "l", "zero"]
							: ["m", "zero", "m", "zero"]
					}
				>
					WORK
				</Text>
			</Container>
			<Container
				style={"overflow: hidden;"}
				w={isDesktop ? "57vw" : "100vw"}
				direction={isDesktop ? "row" : "column"}
				justify={"center"}
				align={"center"}
			>
				<WorkCardsCarousel></WorkCardsCarousel>
			</Container>
		</StyledWorks>
	);
}

export default Works;
