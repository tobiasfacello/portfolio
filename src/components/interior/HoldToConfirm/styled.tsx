import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, pressable, StyledStateStack, uiLabel } from '../shared/styled';

export const StyledHoldButton = styled.button`
	${bareButton}
	${pressable}
	${uiLabel}
	${focusRing}
	position: relative;
	isolation: isolate;
	display: inline-grid;
	place-items: center;
	height: var(--36);
	padding: 0 var(--12);
	overflow: hidden;
	border: 1px solid var(--text);
	border-radius: var(--radius-md);
	opacity: var(--opacity-text-muted);
	touch-action: manipulation;
	-webkit-touch-callout: none;
	transition: opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}

	&[aria-disabled='true'] {
		opacity: var(--opacity-text-disabled);
		cursor: not-allowed;
	}
`;

/**
 * A filled copy of the whole button, revealed left to right by a clip. The
 * sweep *is* the progress bar, so the label never has to move aside for one.
 */
export const StyledHoldSweep = styled.span`
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	padding: 0 var(--12);
	background-color: var(--accent);
	color: var(--pill-text-hovered);
	will-change: clip-path;
`;

export const StyledHoldFaces = styled(StyledStateStack)`
	grid-area: 1 / 1;
`;

export const StyledHoldFace = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--6);
	white-space: nowrap;
`;
