import { memo } from "react";
import { StyledText } from "./styled";
import { TextProps } from "../../types";

export default memo(function Text(props: TextProps) {
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
});
