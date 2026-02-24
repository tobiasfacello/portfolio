import { StyledButton } from "./styled";
import { useState, useCallback } from "react";

//* Components
import Text from "../Text";

//? Types
import { ButtonProps } from "../../types";

function Button(props: ButtonProps) {
	const [isHovered, setIsHovered] = useState(false);
	const isLink = !!props.url;

	const handleMouseEnter = useCallback(() => setIsHovered(true), []);
	const handleMouseLeave = useCallback(() => setIsHovered(false), []);

	return (
		<StyledButton
			as={isLink ? "a" : "span"}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...(isLink ? { href: props.url, target: "_blank", rel: "noopener noreferrer" } : {})}
			{...(props.onClick ? { onClick: props.onClick } : {})}
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
