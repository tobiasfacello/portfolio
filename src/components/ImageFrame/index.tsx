import { StyledImageFrame } from "./styled";

function ImageFrame(props: any) {
	const containerStyles = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "none",
		overflow: "hidden",
	};

	return (
		<div style={containerStyles}>
			<StyledImageFrame $p={props.p} $m={props.m}>
				<img src={props.src} alt={props.alt || ""} />
			</StyledImageFrame>
		</div>
	);
}

export default ImageFrame;
