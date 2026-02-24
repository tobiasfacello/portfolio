import styled from "styled-components";

export const StyledSocialIcon = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	color: var(--text);
	transition: color var(--transition-fast);

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const StyledSocialButton = styled.a`
	text-decoration: none;
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	object-fit: contain;
	background-color: var(--glass-bg);
	border: 1px solid var(--glass-border-start);
	border-radius: var(--radius-md);
	opacity: 0.6;
	color: var(--text);
	transition: all var(--transition-fast);

	&:hover {
		opacity: 1;
		background-color: var(--accent);
		border: 1px solid var(--primary);

		${StyledSocialIcon} {
			color: var(--pill-text-hovered);
		}
	}

	&:active {
		background-color: var(--primary);
		transition: all 100ms;
	}
`;
