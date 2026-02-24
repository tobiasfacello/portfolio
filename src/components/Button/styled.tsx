import styled from "styled-components";

//* Components
import { StyledIconFrame } from "../IconFrame/styled";
import { StyledText } from "../Text/styled";

export const StyledButton = styled.a<{
	$isHovered: boolean;
	$m?: string[];
	$p?: string[];
}>`
	width: auto;
	height: 36px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: ${(props) =>
		props.$m != null &&
		props.$m.map((marginSize) => `var(--${marginSize})`).join(" ")};
	padding: ${(props) =>
		props.$p != null &&
		props.$p.map((paddingSize) => `var(--${paddingSize})`).join(" ")};
	opacity: 0.4;
	background-color: transparent;
	border: 1px solid var(--text);
	border-radius: var(--radius-md);
	text-decoration: none;
	transition: all var(--transition-fast);
	z-index: 10;

	&:hover {
		opacity: 1;
		background-color: var(--accent);
		border: 1px solid var(--primary);

		${StyledText} {
			font-weight: 500;
			color: var(--pill-text-hovered);
		}
	}

	&:active {
		background-color: var(--primary);
		transition: all 100ms;
	}


	${StyledIconFrame} {
		width: 30px;
		height: 30px;
		margin: 0;
	}

	&:hover ${StyledIconFrame} {
		color: var(--pill-text-hovered);
	}
`;
