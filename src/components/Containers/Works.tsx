import styled from "styled-components";
import MediaQuery from "react-responsive";

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
	background-repeat: no-repeat;

	& .projects__title {
		width: 100%;
		display: flex;
		justify-content: start;
		align-items: center;
	}

	@media (min-width: 960px) {
		& {
			width: 100vw;
			background-position: center right;
		}
	}

	@media (min-width: 1280px) {
		& {
			width: 200%;
			border: none;
			border-right: 1px solid var(--secondary-60);
		}
	}

	@media (min-width: 1440px) {
		& {
		}
	}
`;

function Works() {
	return (
		<StyledWorks>
			<MediaQuery minWidth={360} maxWidth={767}>
				<Container
					h={"auto"}
					w={"90%"}
					justify={"start"}
					align={"center"}
				>
					<Text
						variant={"subtitle-snd"}
						m={["m", "zero", "m", "zero"]}
					>
						WORK
					</Text>
				</Container>
				<Container
					style={"overflow: hidden;"}
					direction={"column"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel></WorkCardsCarousel>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={768} maxWidth={959}>
				<Container
					h={"auto"}
					w={"90%"}
					justify={"start"}
					align={"center"}
				>
					<Text
						variant={"subtitle-snd"}
						m={["m", "zero", "m", "zero"]}
					>
						WORK
					</Text>
				</Container>
				<Container
					style={"overflow: hidden;"}
					direction={"column"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel></WorkCardsCarousel>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={960} maxWidth={1279}>
				<Container
					h={"auto"}
					w={"90%"}
					justify={"start"}
					align={"center"}
				>
					<Text
						variant={"subtitle-snd"}
						m={["m", "zero", "m", "zero"]}
					>
						WORK
					</Text>
				</Container>
				<Container
					style={"overflow: hidden;"}
					w={"100vw"}
					direction={"column"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel></WorkCardsCarousel>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1280} maxWidth={1439}>
				<Container
					h={"auto"}
					w={"90%"}
					justify={"start"}
					align={"center"}
				>
					<Text
						variant={"subtitle-snd"}
						m={["xl", "zero", "l", "zero"]}
					>
						WORK
					</Text>
				</Container>
				<Container
					style={"overflow: hidden;"}
					h={"50vh"}
					w={"57vw"}
					direction={"row"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel></WorkCardsCarousel>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1440} maxWidth={1800}>
				<Container
					h={"auto"}
					w={"90%"}
					justify={"start"}
					align={"center"}
				>
					<Text
						variant={"subtitle-snd"}
						m={["xl", "zero", "l", "zero"]}
					>
						WORK
					</Text>
				</Container>
				<Container
					style={"overflow: hidden;"}
					w={"57vw"}
					direction={"row"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel></WorkCardsCarousel>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={1801}>
				<Container
					h={"auto"}
					w={"90%"}
					justify={"start"}
					align={"center"}
				>
					<Text
						variant={"subtitle-snd"}
						m={["xl", "zero", "l", "zero"]}
					>
						WORK
					</Text>
				</Container>
				<Container
					style={"overflow: hidden;"}
					w={"57vw"}
					direction={"row"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel></WorkCardsCarousel>
				</Container>
			</MediaQuery>
		</StyledWorks>
	);
}

export default Works;
