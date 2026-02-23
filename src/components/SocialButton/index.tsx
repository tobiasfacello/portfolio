import { StyleSheetManager } from "styled-components";
import { StyledSocialButton } from "./styled";

function SocialButton(props: any) {
	const filteredProps: string[] = ["src", "url", "alt"];

	return (
		<StyleSheetManager
			shouldForwardProp={(prop) => !filteredProps.includes(prop)}
		>
			<StyledSocialButton
				className={"button"}
				href={props.url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={props.alt}
			>
				<img src={props.src} alt={props.alt || ""} />
			</StyledSocialButton>
		</StyleSheetManager>
	);
}

export default SocialButton;
