import styled from "styled-components";

export const Wrapper = styled.div`
	position: relative;
	border-radius: 50%;
	overflow: hidden;

	@media (min-width: 360px) {
		width: 175px;
		height: 175px;
	}

	@media (min-width: 1280px) {
		width: 275px;
		height: 275px;
	}

	@media (min-width: 1440px) {
		width: 345px;
		height: 345px;
	}

	&:hover > div:first-child {
		opacity: 0;
	}

	&:hover > div:last-child {
		opacity: 1;
	}
`;

export const AsciiLayer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-family: "Courier New", Courier, monospace;
	white-space: pre;
	line-height: 1;
	color: var(--primary);
	opacity: 1;
	transition: opacity 0.3s ease;
	font-size: 5.3px;

	@media (min-width: 1280px) {
		font-size: 8.33px;
	}

	@media (min-width: 1440px) {
		font-size: 10.45px;
	}
`;

export const ImageLayer = styled.div`
	position: absolute;
	inset: 0;
	opacity: 0;
	transition: opacity 0.3s ease;

	& > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}
`;
