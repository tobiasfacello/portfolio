import { StyledButton } from "./styled";
import { useState } from "react";

//* Components
import Text from "../Text";

function Button(props: any) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<StyledButton
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			href={props.url}
			target="_blank"
			rel="noopener noreferrer"
			$isHovered={isHovered}
			$p={props.p}
			$m={props.m}
		>
			<Text variant={"details-fst"} alignment={"center"}>
				{props.title}
			</Text>
			{props.children}
		</StyledButton>
	);
}

export default Button;
