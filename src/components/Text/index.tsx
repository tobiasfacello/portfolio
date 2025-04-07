import { StyleSheetManager } from "styled-components";
import { StyledText } from "./styled";

export default function Text(props: any) {
	const filteredProps: string[] = [
		"w",
		"h",
		"m",
		"p",
		"variant",
		"alignment",
	];
	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledText
				w={props.w}
				h={props.h}
				m={props.m}
				p={props.p}
				variant={props.variant}
				alignment={props.alignment}
			>
				{props.children}
			</StyledText>
		</StyleSheetManager>
	);
}
