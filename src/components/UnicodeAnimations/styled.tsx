import styled from "styled-components";

export const StyledAnimation = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-family: var(--font-geist-pixel-circle);
	color: var(--primary);
	font-size: var(--icon-sm);
	line-height: 1;
	white-space: pre;
	transition: color var(--transition-normal);
`;

export const CharSpan = styled.span`
	display: inline-block;
	white-space: pre;
	transition: opacity 150ms ease;
`;
