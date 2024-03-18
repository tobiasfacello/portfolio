import { StyleSheetManager } from "styled-components";
import { StyledText } from "./styled";

export default function Text(props: any) {
	const filteredProps: string[] = ["variant", "alignment", "m", "p"];
	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledText
				variant={props.variant}
				alignment={props.alignment}
				m={props.m}
				p={props.p}
			>
				{props.children}
			</StyledText>
		</StyleSheetManager>
	);
}
