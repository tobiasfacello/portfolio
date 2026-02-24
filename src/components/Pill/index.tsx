import { memo } from "react";
import { StyledPillTag } from "./styled";

//* Components
import Text from "../Text";
import UnicodeSpinner from "../UnicodeSpinner";

//? Types
import { PillProps } from "../../types";

export default memo(function PillTag(props: PillProps) {
	return (
		<StyledPillTag $maxW={props.maxW} $m={props.m} $p={props.p}>
			{props.spinnerName && (
				<UnicodeSpinner name={props.spinnerName} style={{ fontSize: "10px" }} />
			)}
			<Text variant={"details-snd"} alignment={"center"}>
				{props.tag}
			</Text>
		</StyledPillTag>
	);
});
