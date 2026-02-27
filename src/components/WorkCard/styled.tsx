import styled, { css } from "styled-components";
import { glassCard, hoveredPillStyles } from "../../styles/mixins";

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
	$isHovered: boolean;
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

	@media (min-width: 375px) {
		& {
			width: 335px;
			min-width: 300px;
			height: 250px;
		}
	}
	@media (min-width: 768px) {
		& {
			width: 340px;
			height: 250px;
		}
	}

	${StyledWorkLogo} {
		opacity: ${(props) => (props.$isHovered ? "var(--opacity-full)" : "var(--opacity-subtle)")};
	}

	${(props) => hoveredPillStyles(props.$isHovered)}
`;

export const StyledWorkCard = styled.a<{
	$isHovered: boolean;
	$m?: string[];
	$p?: string[];
}>`
	${workCardBase}
`;

export const StyledWorkCardDiv = styled.div<{
	$isHovered: boolean;
	$m?: string[];
	$p?: string[];
}>`
	${workCardBase}
`;
