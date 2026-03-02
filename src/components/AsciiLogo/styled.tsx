import styled from "styled-components";
import { mq } from "../../config/breakpoints";

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

	${mq.up(425)} {
		font-size: 9.5px;
	}

	${mq.up('mobile-lg')} {
		font-size: 15px;
	}

	${mq.up('tablet')} {
		font-size: 19px;
	}

	${mq.up('desktop-sm')} {
		font-size: 24px;
	}

	${mq.up('desktop-lg')} {
		font-size: 26px;
	}

	${mq.up(1800)} {
		font-size: 30px;
	}
`;

export const AsciiLine = styled.span`
	display: block;
	white-space: pre;
	color: var(--primary);
	opacity: 1;
`;
