import { StyledButton } from "./styled";

//* Components
import Text from "../Text";

//? Types
import { ButtonProps } from "../../types";

function Button(props: ButtonProps) {
	const isLink = !!props.url;

	return (
		<StyledButton
			as={isLink ? "a" : "button"}
			{...(isLink && !props.disabled ? { href: props.url, target: "_blank", rel: "noopener noreferrer" } : {})}
			{...(!isLink ? { type: "button" as const } : {})}
			{...(props.onClick && !props.disabled ? { onClick: props.onClick } : {})}
			$variant={props.variant || 'default'}
			aria-disabled={props.disabled || undefined}
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
