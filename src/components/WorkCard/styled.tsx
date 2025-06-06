import styled from "styled-components";

//* Components
import { StyledPillTag } from "../Pill/styled";

export const StyledWorkCard = styled.div<{
	isHovered: boolean;
	m: string[];
	p: string[];
}>`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	background-color: rgba(197, 199, 188, 5%);
	background-clip: padding-box;
	border: 1px solid transparent;
	border-radius: 20px;
	backdrop-filter: blur(4px);
	cursor: pointer;
	overflow: hidden;
	transition: all 300ms;

	&::before {
		content: "";
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
		opacity: ${(props) => (props.isHovered ? "1" : "0.2")};
		transition: all 300ms;
		z-index: -1;
	}

	${StyledPillTag} {
		color: ${(props) =>
		props.isHovered ? "var(--pill-text-hovered)" : "var(--text)"};
		background-color: ${(props) =>
		props.isHovered ? "var(--accent)" : "transparent"};
			border-color: ${(props) =>
		props.isHovered ? "var(--primary)" : "inherit"};
		opacity: ${(props) => (props.isHovered ? "1" : "0.6")};
	}
`;
