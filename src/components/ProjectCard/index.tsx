import { StyleSheetManager } from "styled-components";
import { StyledProjectCard } from "./styled";

//* Components
import Text from "../Text";
import Container from "../Containers/Container";
import { useState } from "react";

function ProjectCard(props: any) {
	const [isHovered, setIsHovered] = useState(false);

	const filteredProps: string[] = [
		"isHovered",
		"p",
		"m",
		"variant",
		"title",
		"details",
		"src",
	];

	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledProjectCard
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				isHovered={isHovered}
				p={props.p}
				m={props.m}
			>
				<Container
					direction={"column"}
					justify={"flex-start"}
					align={"start"}
				>
					<Text
						variant={"subtitle-fst"}
						m={["xxxs", "xs", "xs", "xs"]}
					>
						{props.title}
					</Text>
					<Text
						variant={"details-fst"}
						m={["zero", "zero", "xs", "xs"]}
					>
						{props.details}
					</Text>
				</Container>
				<Container
					direction={"column"}
					justify={"center"}
					align={"end"}
				>
					<img src={props.src}></img>
				</Container>
			</StyledProjectCard>
		</StyleSheetManager>
	);
}

export default ProjectCard;
