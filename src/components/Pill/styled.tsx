import styled from "styled-components";

export const StyledPillTag = styled.span<{
	isHovered: boolean;
	maxW: string;
	m: string[];
	p: string[];
}>`
	width: auto;
	max-width: ${(props) => (props.maxW == null ? "85px" : props.maxW)};
	height: 22px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: ${(props) =>
		props.m &&
		props.m.map((marginSize) => `var(--${marginSize})`).join(" ")};

	padding: ${(props) =>
		props.p &&
		props.p.map((paddingSize) => `var(--${paddingSize})`).join(" ")};
	border: 1px solid var(--text);
	border-radius: 30px;
	transition: all 0.3s;
`;
