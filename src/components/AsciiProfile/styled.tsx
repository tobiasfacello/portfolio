import styled from "styled-components";
import { mq } from "../../config/breakpoints";

export const Wrapper = styled.div`
	position: relative;
	border-radius: 50%;
	overflow: hidden;

	${mq.up(360)} {
		width: 175px;
		height: 175px;
	}

	${mq.up('desktop-sm')} {
		width: 275px;
		height: 275px;
	}

	${mq.up('desktop-lg')} {
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

	${mq.up('desktop-sm')} {
		font-size: 8.33px;
	}

	${mq.up('desktop-lg')} {
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
