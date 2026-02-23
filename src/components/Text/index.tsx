import { StyledText } from "./styled";

export default function Text(props: any) {
	return (
		<StyledText
			as={props.as}
			$w={props.w}
			$h={props.h}
			$m={props.m}
			$p={props.p}
			$variant={props.variant}
			$alignment={props.alignment}
		>
			{props.children}
		</StyledText>
	);
}
