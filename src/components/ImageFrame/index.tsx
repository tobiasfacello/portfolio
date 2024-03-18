import { StyleSheetManager } from "styled-components";
import { StyledImageFrame } from "./styled";

function ImageFrame(props: any) {
	const filteredProps: string[] = ["p", "m", "src"];

	const containerStyles = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "none",
		overflow: "hidden",
	};

	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<div style={containerStyles}>
				<StyledImageFrame p={props.p} m={props.m}>
					<img src={props.src}></img>
				</StyledImageFrame>
			</div>
		</StyleSheetManager>
	);
}

export default ImageFrame;
