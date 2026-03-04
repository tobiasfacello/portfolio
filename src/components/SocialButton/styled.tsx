import styled from "styled-components";
import { interactiveHover, iconWrapper } from "../../styles/mixins";

export const StyledSocialIcon = styled.span`
	${iconWrapper('var(--icon-md)')}
	color: var(--text);
	transition: color var(--transition-fast);
`;

export const StyledSocialButton = styled.a`
	text-decoration: none;
	width: var(--control-md);
	height: var(--control-md);
	display: flex;
	align-items: center;
	justify-content: center;
	object-fit: contain;
	background-color: var(--glass-bg);
	border: 1px solid var(--glass-border-start);
	border-radius: var(--radius-md);
	color: var(--text);
	transition: all var(--transition-fast);

	${interactiveHover}

	&:hover {
		${StyledSocialIcon} {
			color: var(--pill-text-hovered);
		}
	}

	&:active {
		background-color: var(--primary);
		transition: all var(--transition-fast);
	}
`;
