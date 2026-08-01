import styled from 'styled-components';

//? Types
import type { NewItemsAnchor } from './useNewItems';

//* Shared
import { bareButton, focusRing, pressable, uiLabel } from '../shared/styled';

export const StyledPillLayer = styled.div<{ $anchor: NewItemsAnchor }>`
	position: absolute;
	inset-inline: 0;
	${({ $anchor }) => ($anchor === 'bottom' ? 'bottom: var(--8);' : 'top: var(--8);')}
	z-index: 1;
	display: flex;
	justify-content: center;
	/* The layer must not block the list it floats over. */
	pointer-events: none;
`;

export const StyledNewItemsPill = styled.button`
	${bareButton}
	${pressable}
	${uiLabel}
	${focusRing}
	pointer-events: auto;
	display: inline-flex;
	align-items: center;
	gap: var(--6);
	height: var(--32);
	padding: 0 var(--12) 0 var(--8);
	border: 1px solid var(--glass-border-bold-start);
	border-radius: var(--radius-pill);
	background-color: var(--overlay-solid);
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	white-space: nowrap;
	will-change: transform, opacity;
	transition: border-color var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		border-color: var(--primary);
	}
`;

export const StyledPillArrow = styled.svg<{ $anchor: NewItemsAnchor }>`
	flex-shrink: 0;
	transform: ${({ $anchor }) => ($anchor === 'bottom' ? 'rotate(180deg)' : 'none')};
`;
