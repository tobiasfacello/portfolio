import { StyleSheetManager } from "styled-components";
import { StyledPillTag } from "./styled";

//* Components
import Text from "../Text";

function PillTag(props: any) {
	const filteredProps = ["isHovered", "maxW", "m", "p", "tag"];

	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledPillTag isHovered={props.isHovered} maxW={props.maxW} m={props.m} p={props.p}>
				<Text variant={"details-snd"} alignment={"center"}>
					{props.tag}
				</Text>
			</StyledPillTag>
		</StyleSheetManager>
	);
}

export default PillTag;
