import styled from "styled-components";
import { useTranslation } from "react-i18next";

//* Components
import Container from "./Container";
import Text from "../../components/Text";

//? Hooks & Config
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { aboutConfig } from "../../config/responsive";

//* Styles
import { glassBorder } from "../../styles/mixins";

const StyledAbout = styled.section`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	padding: 0 var(--20);
	${glassBorder(true)}

	@media (min-width: 1280px) {
		grid-area: about;
	}
`;

export default function About() {
	const bp = useBreakpoint();
	const cfg = aboutConfig[bp];
	const { t } = useTranslation('home');
	const paragraphs = t('about.paragraphs', { returnObjects: true }) as string[];

	return (
		<StyledAbout>
			<Container
				w={cfg.outerW}
				maxW={cfg.outerMaxW}
				h={cfg.outerH}
				minH={cfg.outerMinH}
				m={['36', '0', '36', '0']}
				direction={"column"}
				justify={"space-between"}
				align={"center"}
				gap={cfg.outerGap}
			>
				<Container
					w={"100%"}
					h={"auto"}
					justify={"flex-start"}
					align={"center"}
				>
					<Text
						as="h2"
						variant={"subtitle-sm"}
						alignment={cfg.titleAlign}
					>
						{t('about.title')}
					</Text>
				</Container>
				<Container
					w={cfg.innerW}
					display={"flex"}
					direction={"column"}
					justify={"space-between"}
					align={"flex-start"}
					gap={cfg.paragraphGap}
				>
					{paragraphs.map((text, i) => (
						<Text
							key={i}
							variant={cfg.paragraphVariant}
							alignment={"left"}
						>
							{text}
						</Text>
					))}
				</Container>
			</Container>
		</StyledAbout>
	);
}
