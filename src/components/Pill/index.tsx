import { memo } from "react";
import { StyledPillTag } from "./styled";

//* Components
import Text from "../Text";

//? Types
import { PillProps } from "../../types";

export default memo(function PillTag(props: PillProps) {
	return (
		<StyledPillTag $m={props.m} $p={props.p}>
			{props.tag && (
				<Text variant={"caption"} alignment={"center"}>
					{props.tag}
				</Text>
			)}
		</StyledPillTag>
	);
});
