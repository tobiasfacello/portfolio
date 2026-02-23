import { css } from 'styled-components';
import { StyledPillTag } from '../components/Pill/styled';

export const glassCard = css`
	background-color: rgba(197, 199, 188, 5%);
	background-clip: padding-box;
	border: 1px solid transparent;
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
`;

export const hoveredPillStyles = (isHovered: boolean) => css`
	${StyledPillTag} {
		color: ${isHovered ? "var(--pill-text-hovered)" : "var(--text)"};
		background-color: ${isHovered ? "var(--accent)" : "transparent"};
		border-color: ${isHovered ? "var(--primary)" : "inherit"};
		opacity: ${isHovered ? "1" : "0.6"};
	}
`;

export const interactiveHover = css`
	opacity: 0.6;
	transition: all 150ms;

	&:hover {
		opacity: 1;
		background-color: var(--accent);
		border: 1px solid var(--primary);
	}

	&:active {
		background-color: var(--primary);
		transition: all 100ms;
	}
`;

export const spacingArray = (values: string[] | undefined) =>
	values ? values.map((v) => `var(--${v})`).join(' ') : undefined;
