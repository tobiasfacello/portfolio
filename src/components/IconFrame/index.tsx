import { memo } from "react";
import { StyledIconFrame } from "./styled";
import { IconFrameProps } from "../../types";

export default memo(function IconFrame(props: IconFrameProps) {
	return (
		<StyledIconFrame>
			<props.Icon aria-hidden="true" />
		</StyledIconFrame>
	);
});
