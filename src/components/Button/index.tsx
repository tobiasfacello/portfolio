import { StyleSheetManager } from "styled-components";
import { StyledButton } from "./styled";
import { useState } from "react";

//* Components
import Text from "../Text";

function WorkCard(props: any) {
	const [isHovered, setIsHovered] = useState(false);
	const handleClick = (url: string) => {
		window.location.href = url;
	};

	const filteredProps: string[] = ["isHovered", "p", "m", "url"];

	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledButton
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={() => {
					handleClick(props.url);
				}}
				isHovered={isHovered}
				p={props.p}
				m={props.m}
			>
				<Text variant={"details-fst"} alignment={"center"}>
					{props.title}
				</Text>
				{props.children}
			</StyledButton>
		</StyleSheetManager>
	);
}

export default WorkCard;
