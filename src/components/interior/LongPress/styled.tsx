import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, pressable, StyledStateStack, uiLabel } from '../shared/styled';

export const StyledLongPressButton = styled.button<{ $holding: boolean; $fired: boolean }>`
	${bareButton}
	${pressable}
	${uiLabel}
	${focusRing}
	position: relative;
	display: inline-flex;
	align-items: center;
	height: var(--control-md);
	padding: 0 var(--12);
	border-radius: var(--radius-md);
	border: 1px solid ${({ $fired }) => ($fired ? 'var(--accent)' : 'var(--text)')};
	/* Holding presses the button into the surface; firing lights it up. */
	background-color: ${({ $holding, $fired }) =>
		$fired ? 'var(--glass-bg-bold)' : $holding ? 'var(--glass-bg-bold)' : 'transparent'};
	transform: ${({ $holding }) => ($holding ? 'translateY(1px)' : 'none')};
	opacity: ${({ $holding, $fired }) =>
		$holding || $fired ? 'var(--opacity-full)' : 'var(--opacity-text-muted)'};
	touch-action: manipulation;
	-webkit-touch-callout: none;
	transition:
		border-color var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state),
		transform var(--transition-fast) var(--ease-smooth-out),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}

	&[aria-disabled='true'] {
		opacity: var(--opacity-text-disabled);
		cursor: not-allowed;
	}

	@media (prefers-reduced-motion: reduce) {
		transform: none;
	}
`;

export const StyledLongPressLabels = styled(StyledStateStack)`
	> span {
		white-space: nowrap;
	}
`;

/**
 * A second copy of the label in the accent colour, revealed left-to-right by a
 * clip. The fill *is* the progress bar — no separate track needed, and the
 * label never has to move to make room for one.
 */
export const StyledLongPressFill = styled.span`
	color: var(--accent);
	will-change: clip-path;
`;
