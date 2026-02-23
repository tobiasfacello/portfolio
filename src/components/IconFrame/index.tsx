import { StyledIconFrame } from "./styled";

function IconFrame(props: any) {
	return <StyledIconFrame src={props.src} alt={props.alt || ""} />;
}

export default IconFrame;
