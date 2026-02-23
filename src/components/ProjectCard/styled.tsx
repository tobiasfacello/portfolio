import styled from 'styled-components';
import { glassCard, hoveredPillStyles } from '../../styles/mixins';

export const StyledProjectCard = styled.a<{
	$isHovered: boolean;
}>`
	text-decoration: none;
	color: inherit;
	width: 100%;
	height: 120px;
	min-width: 320px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	${glassCard}

	@media (max-width: 768px) {
		& {
			max-width: 335px;
		}
	}

	@media (min-width: 768px) and (max-width: 1279px) {
		& {
			max-width: 380px;
		}
	}

	& img {
		opacity: ${(props) => (props.$isHovered ? '1' : '0.6')};
		transition: all 300ms;
	}

	${(props) => hoveredPillStyles(props.$isHovered)}
`;
