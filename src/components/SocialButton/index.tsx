import { StyledSocialButton } from "./styled";
import { SocialButtonProps } from "../../types";

function SocialButton(props: SocialButtonProps) {
	return (
		<StyledSocialButton
			className={"button"}
			href={props.url}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={props.alt}
		>
			<img src={props.src} alt={props.alt || ""} />
		</StyledSocialButton>
	);
}

export default SocialButton;
