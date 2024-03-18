import { StyledSocialButton } from "./styled";

function SocialButton(props: any) {
	return (
		<StyledSocialButton>
			<img src={props.src}></img>
		</StyledSocialButton>
	);
}

export default SocialButton;
