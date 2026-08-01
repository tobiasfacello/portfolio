import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, pressable, StyledStateStack, uiBody, uiLabel } from '../shared/styled';

export const StyledStreamRoot = styled.div`
	${uiBody}
	width: 100%;
`;

/**
 * The full text is rendered invisibly underneath to reserve its final size, so
 * a paragraph streaming in never grows the block it lives in — nothing below it
 * moves while it types.
 */
export const StyledStreamBlock = styled.p`
	position: relative;
	white-space: pre-line;
`;

export const StyledStreamGhost = styled.span`
	visibility: hidden;
`;

export const StyledStreamVisible = styled.span`
	position: absolute;
	inset: 0;
	white-space: pre-line;
`;

export const StyledCaretSlot = styled.span`
	position: relative;
	display: inline-block;
	width: 0;
	height: 1.1em;
	vertical-align: -0.22em;
`;

export const StyledCaret = styled.span`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 1px;
	display: block;
	width: 2px;
	background-color: var(--text);
`;

export const StyledStreamActions = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: var(--12);
`;

export const StyledStreamButton = styled.button`
	${bareButton}
	${pressable}
	${uiLabel}
	${focusRing}
	display: inline-grid;
	place-items: center;
	height: var(--24);
	padding: 0 var(--8);
	border: 1px solid var(--glass-border-bold-start);
	border-radius: var(--radius-sm);
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
	transition: opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}
`;

export const StyledStreamButtonLabels = styled(StyledStateStack)`
	place-items: center;
`;
