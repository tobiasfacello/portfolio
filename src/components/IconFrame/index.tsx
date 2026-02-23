import { StyledIconFrame } from "./styled";
import { IconFrameProps } from "../../types";

function IconFrame(props: IconFrameProps) {
	return <StyledIconFrame src={props.src} alt={props.alt || ""} />;
}

export default IconFrame;
