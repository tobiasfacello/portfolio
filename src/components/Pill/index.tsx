import { StyledPillTag } from "./styled";

//* Components
import Text from "../Text";
import UnicodeSpinner from "../UnicodeSpinner";

const tagSpinnerMap: Record<string, "braille" | "diagswipe" | "breathe"> = {
	"Work in progress": "braille",
	"V2.0": "diagswipe",
	"Development": "breathe",
	"Design": "breathe",
};

function PillTag(props: any) {
	const spinnerName = tagSpinnerMap[props.tag];

	return (
		<StyledPillTag $isHovered={props.isHovered} $maxW={props.maxW} $m={props.m} $p={props.p}>
			{spinnerName && (
				<UnicodeSpinner name={spinnerName} style={{ fontSize: "10px" }} />
			)}
			<Text variant={"details-snd"} alignment={"center"}>
				{props.tag}
			</Text>
		</StyledPillTag>
	);
}

export default PillTag;
