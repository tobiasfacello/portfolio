import styled from "styled-components";

//* Components
import Container from "./Container";
import Text from "../Text";

//? Types
import { SectionProps } from "../../types";

//? Hooks, Config & Data
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { skillsConfig } from "../../config/responsive";
import { skillRows } from "../../data/skills";

const StyledSkills = styled.section<{
	$flex?: number;
}>`
	width: 100%;
	height: 100%;
	padding: 0 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-top: 1px solid var(--secondary-60);

	@media (min-width: 1280px) {
		& {
			width: 0;
			border: none;
			border-left: 1px solid var(--secondary-60);
			border-right: 1px solid var(--secondary-60);
			flex: ${(props) => props.$flex};
		}
	}
`;

const StyledIcon = styled.img`
	width: 100%;
	height: 100%;
	max-width: 48px;
	max-height: 48px;
	color: var(--text);
	opacity: 0.8;
`;

function Skills(props: SectionProps) {
	const bp = useBreakpoint();
	const cfg = skillsConfig[bp];

	const iconGrid = skillRows.map((row, i) => (
		<Container
			key={i}
			w={cfg.iconRowW}
			justify={cfg.iconRowJustify}
			align={"center"}
		>
			{row.map((icon) => (
				<StyledIcon
					key={icon.title}
					src={icon.src}
					title={icon.title}
					alt={icon.title}
				/>
			))}
		</Container>
	));

	if (cfg.titleOutside) {
		return (
			<StyledSkills $flex={props.flex}>
				<Text as="h2" variant={"subtitle-snd"} m={cfg.titleM}>
					SKILLS & TOOLS
				</Text>
				<Container
					h={cfg.outerH}
					m={["36", "0", "36", "0"]}
					p={cfg.iconContainerP}
					direction={"column"}
					justify={"center"}
					align={"center"}
				>
					{iconGrid}
				</Container>
			</StyledSkills>
		);
	}

	const needsIconWrapper = cfg.iconWrapperH != null;

	return (
		<StyledSkills $flex={props.flex}>
			<Container
				w={cfg.outerW}
				maxW={cfg.outerMaxW}
				h={cfg.outerH}
				m={["36", "0", "36", "0"]}
				direction={"column"}
				justify={cfg.outerJustify}
				align={"center"}
				gap={"36px"}
			>
				<Container
					w={"100%"}
					h={cfg.iconWrapperH ? undefined : "100%"}
					justify={"flex-start"}
					align={"center"}
				>
					<Text as="h2" variant={"subtitle-snd"}>
						SKILLS & TOOLS
					</Text>
				</Container>
				{needsIconWrapper ? (
					<Container
						h={cfg.iconWrapperH}
						direction={"column"}
						justify={"center"}
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
