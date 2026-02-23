import { StyleSheetManager } from "styled-components";
import { StyledSocialButton } from "./styled";

function SocialButton(props: any) {
	const handleClick = (url: string) => {
		window.open(url, '_blank', 'noopener,noreferrer');
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
