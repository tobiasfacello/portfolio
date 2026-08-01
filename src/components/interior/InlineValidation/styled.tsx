import styled from 'styled-components';

//* Shared
import { uiLabel } from '../shared/styled';

/** Line height of the message row — the reserve is a multiple of this. */
export const MESSAGE_LINE = 16;

export const StyledValidationRoot = styled.div`
	width: 100%;
`;

export const StyledValidationLabel = styled.label`
	${uiLabel}
	display: block;
	font-size: var(--font-size-body-sm);
`;

export const StyledValidationField = styled.div`
	position: relative;
	margin-top: var(--6);
`;

export const StyledValidationInput = styled.input<{ $invalid: boolean }>`
	${uiLabel}
	width: 100%;
	height: 40px;
	padding: 0 var(--32) 0 var(--12);
	border-radius: var(--radius-md);
	border: 2px solid
		${({ $invalid }) => ($invalid ? 'var(--danger)' : 'var(--glass-border-bold-start)')};
	background-color: var(--glass-bg-bold);
	font-size: var(--font-size-body-sm);
	outline: none;
	transition:
		border-color var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state);

	&::placeholder {
		color: var(--text);
		opacity: var(--opacity-text-muted);
	}

	/* The border alone cannot carry focus here: when the field is already
	   invalid it is danger-coloured at rest, so focusing it changed nothing. */
	&:focus {
		border-color: ${({ $invalid }) => ($invalid ? 'var(--danger)' : 'var(--accent)')};
	}

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}

	@media (forced-colors: active) {
		&:focus-visible {
			outline: 2px solid Highlight;
			outline-offset: 2px;
		}
	}

	&:disabled {
		opacity: 0.5;
	}
`;

export const StyledValidationIcons = styled.span`
	position: absolute;
	right: var(--12);
	top: 50%;
	display: grid;
	place-items: center;
	width: var(--icon-xs);
	height: var(--icon-xs);
	transform: translateY(-50%);
	pointer-events: none;

	> svg {
		grid-area: 1 / 1;
	}
`;

/**
 * Hint and error share one reserved row. The height never changes, so an error
 * appearing cannot push the rest of the form down the page.
 */
export const StyledMessageSlot = styled.div<{ $lines: number }>`
	position: relative;
	display: grid;
	margin-top: var(--6);
	height: ${({ $lines }) => $lines * MESSAGE_LINE}px;
`;

export const StyledMessage = styled.p<{ $tone: 'hint' | 'error'; $lines: number }>`
	text-wrap: pretty;
	${uiLabel}
	grid-area: 1 / 1;
	font-size: var(--font-size-caption);
	line-height: ${MESSAGE_LINE}px;
	color: ${({ $tone }) => ($tone === 'error' ? 'var(--danger)' : 'var(--text)')};
	opacity: ${({ $tone }) => ($tone === 'error' ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: ${({ $lines }) => $lines};
	overflow: hidden;
`;
