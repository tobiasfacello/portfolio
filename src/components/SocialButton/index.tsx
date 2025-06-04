import { StyleSheetManager } from "styled-components";
import { StyledSocialButton } from "./styled";

function SocialButton(props: any) {
	const handleClick = (url: string) => {
		window.location.href = url;
	};

	const filteredProps: string[] = ["src", "url"];

	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledSocialButton
				className={"button"}
				onClick={() => {
					handleClick(props.url);
				}}
			>
				<img src={props.src}></img>
			</StyledSocialButton>
		</StyleSheetManager>
	);
}

export default SocialButton;
