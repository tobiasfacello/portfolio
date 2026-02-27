import styled from "styled-components";
import { interactiveHover } from "../../styles/mixins";

export const StyledSocialIcon = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: var(--icon-md);
	height: var(--icon-md);
	color: var(--text);
	transition: color var(--transition-fast);

	svg {
		width: 100%;
		height: 100%;
	}
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
