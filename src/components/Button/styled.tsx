import styled, { css } from "styled-components";

//? Types
import { ButtonVariant } from "../../types";

//* Components
import { StyledIconFrame } from "../IconFrame/styled";
import { StyledText } from "../Text/styled";

//* Mixins
import { spacingArray, glassGradientBorder, interactiveHover } from "../../styles/mixins";

const defaultVariant = css`
	font-size: var(--font-size-label);
	opacity: var(--opacity-muted);
	background-color: transparent;
	border: 1px solid var(--text);

	${interactiveHover}

	&:hover {
		${StyledText} {
			font-weight: var(--font-weight-medium);
			color: var(--pill-text-hovered);
		}
	}

	&:active {
		background-color: var(--primary);
		transform: scale(0.97);
		transition: all var(--transition-fast);
	}

	${StyledIconFrame} {
		width: 2.5em;
		height: 2.5em;
		margin: 0;
	}

	&:hover ${StyledIconFrame} {
		color: var(--pill-text-hovered);
	}
`;

const glassVariant = css`
	font-size: var(--font-size-caption);
	position: relative;
	gap: var(--4);
	opacity: var(--opacity-full);
	background-color: var(--glass-bg);
	backdrop-filter: blur(var(--blur-sm));
	-webkit-backdrop-filter: blur(var(--blur-sm));
	${glassGradientBorder({ radius: 'var(--radius-md)' })}

	${StyledText} {
		font-size: inherit;
		font-weight: var(--font-weight-medium);
	}

	${StyledIconFrame} {
		width: 1.1em;
		height: 1.1em;
		margin: 0;
	}

	&:hover {
		background-color: var(--accent);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-color: var(--primary);

		&::after {
			opacity: 0;
		}

		${StyledText} {
			font-weight: var(--font-weight-medium);
			color: var(--pill-text-hovered);
		}

		${StyledIconFrame} {
			color: var(--pill-text-hovered);
		}
	}

	&:active {
		background-color: var(--primary);
		transform: scale(0.97);
		transition: all var(--transition-fast);
	}
`;

export const StyledButton = styled.a<{
	$variant: ButtonVariant;
	$hasIcon?: boolean;
	$disabled?: boolean;
	$m?: string[];
	$p?: string[];
}>`
	background: none;
	border: none;
	color: inherit;
	width: fit-content;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: ${(props) => spacingArray(props.$m)};
	padding: ${(props) =>
		spacingArray(props.$p) ??
		(props.$variant === 'glass'
			? (props.$hasIcon ? 'var(--4) var(--8) var(--4) var(--6)' : 'var(--4) var(--8)')
			: (props.$hasIcon ? 'var(--6) var(--12) var(--6) var(--8)' : 'var(--6) var(--12)'))};
	border-radius: var(--radius-md);
	text-decoration: none;
	transition: all var(--transition-fast);
	z-index: 10;
	cursor: ${(props) => props.$disabled ? 'default' : 'pointer'};

	${(props) => props.$variant === 'glass' ? glassVariant : defaultVariant}

	${(props) => props.$disabled && css`
		opacity: 0.35;

		&:hover {
			background-color: var(--glass-bg);
			backdrop-filter: blur(var(--blur-sm));
			-webkit-backdrop-filter: blur(var(--blur-sm));
			border-color: transparent;

			&::after { opacity: var(--opacity-full); }
			${StyledText} { color: inherit; }
			${StyledIconFrame} { color: inherit; }
		}
	`}
`;
