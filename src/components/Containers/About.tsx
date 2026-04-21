import styled from "styled-components";
import { useTranslation } from "react-i18next";

//* Components
import Container from "./Container";
import Text from "../Text";

//? Hooks & Config
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { aboutConfig } from "../../config/responsive";

//* Styles
import { sectionBase } from "../../styles/mixins";

const StyledAbout = styled.section`
	${sectionBase('about')}
	justify-content: space-evenly;
	padding: 0 var(--20);
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
					<Text as="h2" variant={"subtitle-sm"} alignment={cfg.titleAlign}>
						{t('about.title')}
					</Text>
				</Container>
				<Container
					w={cfg.innerW}
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
