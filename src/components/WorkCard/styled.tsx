import styled, { css } from "styled-components";
import { glassCard, hoveredPillStyles } from "../../styles/mixins";
import { mq } from "../../config/breakpoints";

export const StyledWorkLogo = styled.span`
	display: block;
	position: absolute;
	left: 180px;
	width: 190px;
	height: 190px;
	color: var(--primary);
	transition: all var(--transition-normal);
	z-index: -1;

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const StyledWorkCardContent = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: space-between;
	align-items: center;
	overflow: hidden;
	border-radius: var(--radius-lg);
	padding: 10px;
`;

const workCardBase = css<{
	$m?: string[];
	$p?: string[];
}>`
	position: relative;
	text-decoration: none;
	color: inherit;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	${glassCard(true)}

	${mq.up(375)} {
		& {
			width: 335px;
			min-width: 300px;
			height: 250px;
		}
	}
	${mq.up('mobile-lg')} {
		& {
			width: 340px;
			height: 250px;
		}
	}

	${StyledWorkLogo} {
		opacity: var(--opacity-subtle);
	}

	&:hover {
		transform: translateY(-2px);
	}

	&:hover ${StyledWorkLogo} {
		opacity: var(--opacity-full);
	}

	${hoveredPillStyles}
`;

export const StyledWorkCard = styled.a<{
	$m?: string[];
	$p?: string[];
}>`
	${workCardBase}
`;

export const StyledWorkCardDiv = styled.div<{
	$m?: string[];
	$p?: string[];
}>`
	${workCardBase}
`;
