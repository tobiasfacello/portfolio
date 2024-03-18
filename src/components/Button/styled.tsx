import styled from "styled-components";
import { StyledIconFrame } from "../IconFrame/styled";

export const StyledButton = styled.button<{
	isHovered: boolean;
	m: string[];
	p: string[];
}>`
	width: auto;
	height: 36px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: ${(props) =>
		props.m != null &&
		props.m.map((marginSize) => `var(--${marginSize})`).join(" ")};
	padding: ${(props) =>
		props.p != null &&
		props.p.map((paddingSize) => `var(--${paddingSize})`).join(" ")};
	opacity: ${(props) => (props.isHovered ? "0.8" : "0.6")};
	background-color: transparent;
	border: 1px solid var(--text);
	border-radius: 10px;
	cursor: pointer;
	transition: all 0.3s;

	&:active {
		opacity: 1;
		transition: all 50ms;
	}

	${StyledIconFrame} {
		width: 30px;
		height: 30px;
		margin: 0;
	}
`;
