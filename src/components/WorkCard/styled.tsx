import styled from "styled-components";
import { glassCard, hoveredPillStyles } from "../../styles/mixins";

export const StyledWorkCard = styled.a<{
	$isHovered: boolean;
	$m: string[];
	$p: string[];
}>`
	text-decoration: none;
	color: inherit;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	overflow: hidden;
	${glassCard}

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

	& .work-logo {
		position: absolute;
		left: 180px;
		width: auto;
		height: 190px;
		opacity: ${(props) => (props.$isHovered ? "1" : "0.2")};
		transition: all 300ms;
		z-index: -1;
	}

	${(props) => hoveredPillStyles(props.$isHovered)}
`;
