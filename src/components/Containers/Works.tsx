import styled from "styled-components";
import MediaQuery from "react-responsive";

//* Components
import Container from "./Container";
import WorkCardsCarousel from "../WorkCardsCarousel";
import Text from "../Text";

//* Assets
import patternVector from "../../assets/vectors/pattern-vector.svg";

const StyledWorks = styled.div<{
	flex: number;
}>`
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
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
			background-position: center right;
		}
	}

	@media (min-width: 1280px) {
		& {
			border: none;
			border-right: 1px solid var(--secondary-60);
		}
	}

	@media (min-width: 1440px) {
		& {
		}
	}
`;

function Works(props: any) {
	return (
		<StyledWorks flex={props.flex}>
			<MediaQuery minWidth={360} maxWidth={767}>
				<Container
					h={"100%"}
					w={"100%"}
					maxW={"500px"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}
				>
					<Container
						h={"100%"}
						w={"100%"}
						justify={"start"}
						align={"center"}
					>
						<Text
							variant={"subtitle-snd"}
						>
							WORK
						</Text>
					</Container>
					<Container
						direction={"column"}
						justify={"center"}
						align={"center"}
					>
						<WorkCardsCarousel />
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={768} maxWidth={959}>
				<Container
					h={"100%"}
					w={"80%"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}
				>
					<Container
						h={"auto"}
						w={"100%"}
						justify={"flex-start"}
						align={"center"}
					>
						<Text
							variant={"subtitle-snd"}
						>
							WORK
						</Text>
					</Container>
					<Container
						direction={"column"}
						justify={"center"}
						align={"center"}
					>
						<WorkCardsCarousel />
					</Container>
				</Container>
			</MediaQuery>
			<MediaQuery minWidth={960} maxWidth={1279}>
				<Container
					h={"100%"}
					w={"80%"}
					m={["36", "0", "36", "0"]}
					direction={"column"}
					justify={"center"}
					align={"center"}
					gap={"36px"}
				>
					<Container
						h={"auto"}
						w={"100%"}
						justify={"start"}
						align={"center"}
					>
						<Text
							variant={"subtitle-snd"}
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
						<WorkCardsCarousel />
					</Container>
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
						m={["36", "0", "0", "0"]}
					>
						WORK
					</Text>
				</Container>
				<Container
					style={"overflow: hidden;"}
					minH={"402px"}
					w={"56.4vw"}
					direction={"row"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel />
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
						m={["36", "0", "0", "0"]}
					>
						WORK
					</Text>
				</Container>
				<Container
					style={"overflow: hidden;"}
					minH={"402px"}
					w={"57.1vw"}
					direction={"row"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel />
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
						m={["48", "0", "0", "0"]}
					>
						WORK
					</Text>
				</Container>
				<Container
					style={"overflow: hidden;"}
					minH={"402px"}
					w={"57.55vw"}
					direction={"row"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel />
				</Container>
			</MediaQuery>
		</StyledWorks>
	);
}

export default Works;
