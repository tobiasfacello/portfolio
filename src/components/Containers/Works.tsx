import styled from "styled-components";

//* Components
import Container from "./Container";
import WorkCardsCarousel from "../WorkCardsCarousel";
import Text from "../Text";

//? Hooks & Config
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { worksConfig } from "../../config/responsive";

//* Styles
import { noisePatternBackground } from "../../styles/mixins";

const StyledWorks = styled.section`
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
	border-top: 1px solid var(--secondary-60);
	${noisePatternBackground}

	&::before {
		background-position: center;
	}

	@media (min-width: 960px) {
		&::before {
			background-position: center right;
		}
	}

	@media (min-width: 1280px) {
		grid-area: works;
	}
`;

function Works() {
	const bp = useBreakpoint();
	const cfg = worksConfig[bp];

	if (cfg.titleOutside) {
		return (
			<StyledWorks>
				<Container
					h={"auto"}
					w={cfg.outerW}
					justify={"start"}
					align={"center"}
				>
					<Text
						as="h2"
						variant={"subtitle-snd"}
						m={cfg.titleM}
					>
						WORK
					</Text>
				</Container>
				<Container
					$css={cfg.carouselCss}
					minH={cfg.carouselMinH}
					w={cfg.carouselW}
					direction={cfg.carouselDirection}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel />
				</Container>
			</StyledWorks>
		);
	}

	return (
		<StyledWorks>
			<Container
				h={cfg.outerH}
				w={cfg.outerW}
				maxW={cfg.outerMaxW}
				m={["36", "0", "36", "0"]}
				direction={"column"}
				justify={"center"}
				align={"center"}
				gap={"36px"}
			>
				<Container
					h={bp === 'mobile-sm' ? "100%" : "auto"}
					w={"100%"}
					justify={bp === 'mobile-sm' ? "start" : "flex-start"}
					align={"center"}
				>
					<Text
						as="h2"
						variant={"subtitle-snd"}
					>
						WORK
					</Text>
				</Container>
				<Container
					$css={cfg.carouselCss}
					w={cfg.carouselW}
					direction={"column"}
					justify={"center"}
					align={"center"}
				>
					<WorkCardsCarousel />
				</Container>
			</Container>
		</StyledWorks>
	);
}

export default Works;
