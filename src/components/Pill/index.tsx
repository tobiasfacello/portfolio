import { memo } from "react";
import { StyledPillTag } from "./styled";

//* Components
import Text from "../Text";
import UnicodeAnimation from "../UnicodeAnimations";

//? Types
import { PillProps } from "../../types";

const animationStyle = { fontSize: "10px" } as const;

export default memo(function PillTag(props: PillProps) {
	return (
		<StyledPillTag $hasIcon={!!props.animationName} $m={props.m} $p={props.p}>
			{props.animationName && (
				<UnicodeAnimation name={props.animationName} style={animationStyle} />
			)}
			{props.tag && (
				<Text variant={"caption"} alignment={"center"}>
					{props.tag}
				</Text>
			)}
		</StyledPillTag>
	);
});
