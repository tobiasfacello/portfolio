import styled from 'styled-components';

//* Components
import { StyledPillTag } from '../Pill/styled';

export const StyledProjectCard = styled.div<{
	isHovered: boolean;
}>`
	width: 100%;
	height: 120px;
	min-width: 320px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	background-color: rgba(197, 199, 188, 5%);
	background-clip: padding-box;
	border: 1px solid transparent;
	/* box-shadow: 0px -1px 0px 0px rgba(255, 255, 255, 0.2),
		-1px 0px 0px 0px rgba(255, 255, 255, 0.1),
		1px 0px 0px 0px rgba(255, 255, 255, 0.1); */
	border-radius: 20px;
	backdrop-filter: blur(4px);
	cursor: pointer;
	transition: all 300ms;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 20px;
		padding: 1px;
		background: linear-gradient(
			to bottom,
			rgba(197, 199, 188, 10%),
			rgba(197, 199, 188, 0%)
		);
		mask: linear-gradient(#f2e8ea 0 0) content-box, linear-gradient(#f2e8ea 0 0);
		-webkit-mask: linear-gradient(#f2e8ea 0 0) content-box,
			linear-gradient(#f2e8ea 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		transition: all 300ms;
	}

	&:hover::before {
		background: linear-gradient(
			to bottom,
			rgba(197, 199, 188, 30%),
			rgba(197, 199, 188, 6%)
		);
	}

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
		opacity: ${(props) => (props.isHovered ? '1' : '0.6')};
		transition: all 300ms;
	}

	${StyledPillTag} {
		color: ${(props) =>
		props.isHovered ? "var(--pill-text-hovered)" : "var(--text)"};
		background-color: ${(props) =>
		props.isHovered ? "var(--text)" : "transparent"};
		opacity: ${(props) => (props.isHovered ? "1" : "0.6")};
	}
`;
