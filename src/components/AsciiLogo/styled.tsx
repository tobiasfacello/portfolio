import styled from "styled-components";

export const StyledAsciiLogo = styled.h1`
	width: 100%;
	padding: 0;
	margin: 0;
	font-family: "Courier New", Courier, monospace;
	font-weight: normal;
	line-height: 1.15;
	text-align: center;
	overflow: hidden;
	contain: layout style paint;
	font-size: 8px;

	@media (min-width: 425px) {
		font-size: 9.5px;
	}

	@media (min-width: 768px) {
		font-size: 15px;
	}

	@media (min-width: 960px) {
		font-size: 19px;
	}

	@media (min-width: 1280px) {
		font-size: 24px;
	}

	@media (min-width: 1440px) {
		font-size: 26px;
	}

	@media (min-width: 1800px) {
		font-size: 30px;
	}
`;

export const AsciiLine = styled.span`
	display: block;
	white-space: pre;
	color: var(--primary);
	opacity: 1;
`;
