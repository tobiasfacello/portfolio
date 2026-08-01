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

	/* The button already carries the resting dim; the label's own
	   --opacity-medium multiplied into it and landed the pair at 4.36:1. */
	${StyledText} {
		opacity: var(--opacity-full);
	}

	&:hover {
		${StyledText} {
			font-weight: var(--font-weight-medium);
			color: var(--pill-text-hovered);
		}
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
		/* Same reason as the default variant: no second layer of dimming. */
		opacity: var(--opacity-full);
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
	transition:
		background-color var(--transition-fast) var(--ease-state),
		border-color var(--transition-fast) var(--ease-state),
		color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state),
		padding var(--transition-fast) var(--ease-state);
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
