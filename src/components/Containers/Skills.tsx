import styled from "styled-components";
import { useTranslation } from "react-i18next";

//* Components
import Container from "./Container";
import Text from "../Text";
import Tooltip from "../Tooltip";

//? Hooks, Config & Data
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { skillsConfig } from "../../config/responsive";
import { skillRows } from "../../data/skills";
import { mq } from "../../config/breakpoints";

//* Styles
import { sectionBase, iconWrapper } from "../../styles/mixins";

const StyledSkills = styled.section`
	${sectionBase('skills')}
	justify-content: space-between;
	padding: var(--36) var(--20);
`;

const StyledIcon = styled.span`
	${iconWrapper('2rem')}
	color: var(--text);
	opacity: var(--opacity-soft);
`;

const StyledIconGrid = styled.div<{ $gap: string }>`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: ${(props) => props.$gap};
	place-items: center;

	${mq.up('desktop-sm')} {
		margin-block: auto;
	}
`;

function Skills() {
	const bp = useBreakpoint();
	const cfg = skillsConfig[bp];
	const { t } = useTranslation('home');

	if (cfg.useGrid) {
		const allIcons = skillRows.flat();

		const gridElement = (
			<StyledIconGrid $gap={cfg.gridGap!}>
				{allIcons.map((icon) => (
					<Tooltip key={icon.title} text={icon.title}>
						<StyledIcon>
							<icon.Icon aria-hidden="true" />
						</StyledIcon>
					</Tooltip>
				))}
			</StyledIconGrid>
		);

		if (cfg.titleOutside) {
			return (
				<StyledSkills>
					<Container
						h={"auto"}
						w={"100%"}
						justify={"flex-start"}
						align={"center"}
					>
						<Text as="h2" variant={"subtitle-sm"}>
							{t('skills.title')}
						</Text>
					</Container>
					{gridElement}
				</StyledSkills>
			);
		}

		return (
			<StyledSkills>
				<Container
					w={cfg.outerW}
					h={cfg.outerH}
					direction={"column"}
					justify={cfg.outerJustify}
					align={"center"}
				>
					<Container
						w={"100%"}
						h={"auto"}
						justify={"flex-start"}
						align={"center"}
					>
						<Text as="h2" variant={"subtitle-sm"}>
							{t('skills.title')}
						</Text>
					</Container>
					{gridElement}
				</Container>
			</StyledSkills>
		);
	}

	const iconGrid = skillRows.map((row, i) => (
		<Container
			key={i}
			w={cfg.iconRowW}
			justify={cfg.iconRowJustify}
			align={"center"}
		>
			{row.map((icon) => (
				<Tooltip key={icon.title} text={icon.title}>
					<StyledIcon>
						<icon.Icon aria-hidden="true" />
					</StyledIcon>
				</Tooltip>
			))}
		</Container>
	));

	const needsIconWrapper = cfg.iconWrapperH != null;

	return (
		<StyledSkills>
			<Container
				w={cfg.outerW}
				maxW={cfg.outerMaxW}
				h={cfg.outerH}
				direction={"column"}
				justify={cfg.outerJustify}
				align={"center"}
				gap={cfg.outerGap}
			>
				<Container
					w={"100%"}
					h={"auto"}
					justify={"flex-start"}
					align={"center"}
				>
					<Text as="h2" variant={"subtitle-sm"}>
						{t('skills.title')}
					</Text>
				</Container>
				{needsIconWrapper ? (
					<Container
						h={cfg.iconWrapperH}
						direction={"column"}
						justify={"space-evenly"}
						align={"center"}
						gap={cfg.iconWrapperGap}
					>
						{iconGrid}
					</Container>
				) : (
					iconGrid
				)}
			</Container>
		</StyledSkills>
	);
}

export default Skills;
