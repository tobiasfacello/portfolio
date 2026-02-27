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
			as={isLink ? "a" : "button"}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...(isLink && !props.disabled ? { href: props.url, target: "_blank", rel: "noopener noreferrer" } : {})}
			{...(!isLink ? { type: "button" as const } : {})}
			{...(props.onClick && !props.disabled ? { onClick: props.onClick } : {})}
			$isHovered={isHovered}
			$variant={props.variant || 'default'}
			$disabled={props.disabled}
			$p={props.p}
			$m={props.m}
		>
			<Text variant={"label"} alignment={"center"}>
				{props.title}
			</Text>
			{props.children}
		</StyledButton>
	);
}

export default Button;
