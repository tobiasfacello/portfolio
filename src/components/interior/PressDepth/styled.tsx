import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, uiLabel } from '../shared/styled';

export const StyledPressRoot = styled.button<{ $depth: number }>`
	${bareButton}
	${focusRing}
	position: relative;
	display: inline-flex;
	vertical-align: middle;
	border-radius: var(--radius-md);
	padding-bottom: ${({ $depth }) => $depth}px;
	touch-action: manipulation;

	&:disabled {
		opacity: var(--opacity-text-disabled);
		cursor: default;
	}
`;

/**
 * The bottom lip. It sits `depth` pixels below the cap and never moves, so the
 * cap has somewhere real to travel to — the press reads as depth rather than as
 * a shrink.
 */
export const StyledPressBase = styled.span<{ $depth: number }>`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: ${({ $depth }) => $depth}px;
	border-radius: var(--radius-md);
	background-color: var(--secondary);
	pointer-events: none;
`;

export const StyledPressCap = styled.span`
	${uiLabel}
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--8);
	height: var(--control-md);
	padding: 0 var(--12);
	border: 1px solid var(--text);
	border-radius: var(--radius-md);
	background-color: var(--overlay-solid);
	white-space: nowrap;
	will-change: transform;
`;
