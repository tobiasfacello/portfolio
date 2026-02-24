import { memo } from "react";
import { StyledSocialButton, StyledSocialIcon } from "./styled";
import { SocialButtonProps } from "../../types";
import Tooltip from "../Tooltip";

export default memo(function SocialButton(props: SocialButtonProps) {
	return (
		<Tooltip text={props.alt || ''} position={props.tooltipPosition}>
			<StyledSocialButton
				className={"button"}
				href={props.url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={props.alt}
			>
				<StyledSocialIcon aria-hidden="true">
					<props.Icon />
				</StyledSocialIcon>
			</StyledSocialButton>
		</Tooltip>
	);
});
