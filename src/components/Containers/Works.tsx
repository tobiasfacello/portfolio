import styled from "styled-components";
import { useTranslation } from "react-i18next";

//* Components
import Container from "./Container";
import WorkCardsCarousel from "../WorkCardsCarousel";
import Text from "../Text";

//? Hooks & Config
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { worksConfig } from "../../config/responsive";

//* Styles
import { glassBorder, noisePatternBackground } from "../../styles/mixins";

const StyledWorks = styled.section`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 0 var(--20);
	${glassBorder(true)}
	${noisePatternBackground}

	@media (min-width: 1280px) {
		grid-area: works;
	}
`;

function Works() {
	const bp = useBreakpoint();
	const cfg = worksConfig[bp];
	const { t } = useTranslation('home');

	if (cfg.titleOutside) {
		return (
			<StyledWorks>
				<Container
					h={"auto"}
					w={cfg.outerW}
					justify={"flex-start"}
					align={"center"}
				>
					<Text
						as="h2"
						variant={"subtitle-snd"}
						m={cfg.titleM}
					>
						{t('works.title')}
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
				gap={cfg.outerGap}
			>
				<Container
					h={"auto"}
					w={"100%"}
					justify={"flex-start"}
					align={"center"}
				>
					<Text
						as="h2"
						variant={"subtitle-snd"}
					>
						{t('works.title')}
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
