import styled from 'styled-components';

//? Types
import type { FlashDirection } from './useValueFlash';

//* Shared
import { uiLabel } from '../shared/styled';

export const StyledFlashRoot = styled.span<{
	$direction: FlashDirection | null;
	$flashing: boolean;
}>`
	${uiLabel}
	position: relative;
	display: inline-grid;
	grid-auto-flow: column;
	align-items: center;
	gap: var(--6);
	padding: var(--2) var(--6);
	border-radius: var(--radius-sm);
	font-variant-numeric: tabular-nums;
	color: ${({ $flashing, $direction }) =>
		$flashing && $direction ? `var(--${$direction === 'up' ? 'success' : 'danger'})` : 'var(--text)'};
	transition: color var(--transition-base) var(--ease-state);
	will-change: transform;
`;

export const StyledFlashTint = styled.span<{ $direction: FlashDirection }>`
	position: absolute;
	inset: 0;
	border-radius: var(--radius-sm);
	pointer-events: none;
	opacity: 0;
	background-color: ${({ $direction }) =>
		$direction === 'up' ? 'var(--success-tint)' : 'var(--danger-tint)'};
`;

/**
 * The digits roll inside a clipped box: the outgoing value leaves in the
 * direction the number moved, the incoming one arrives from the opposite side,
 * so the motion itself carries the sign.
 */
export const StyledFlashDigits = styled.span`
	position: relative;
	display: inline-grid;
	grid-template-areas: 'digits';
	overflow: hidden;

	> span {
		grid-area: digits;
		white-space: nowrap;
	}
`;

export const StyledFlashGlyph = styled.span`
	position: relative;
	display: grid;
	place-items: center;
	width: 1em;
	height: 1em;

	svg {
		width: 0.68em;
		height: 0.68em;
		display: block;
	}
`;
