import styled from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, outsetFocusRing, pressable, uiLabel } from '../shared/styled';

export const StyledDeckRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--16);
	width: 100%;
`;

export const StyledDeckStage = styled.div<{ $height: number }>`
	position: relative;
	width: 100%;
	max-width: 300px;
	height: ${({ $height }) => $height}px;
`;

export const StyledDeckCard = styled.div<{ $depth: number }>`
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: var(--8);
	padding: var(--16);
	background-color: var(--overlay-solid);
	background-clip: padding-box;
	border-radius: var(--radius-lg);
	/* Deeper cards sit lower in the stack and are slightly inset. */
	z-index: ${({ $depth }) => 10 - $depth};
	cursor: ${({ $depth }) => ($depth === 0 ? 'grab' : 'default')};
	touch-action: pan-y;
	user-select: none;
	outline: none;
	will-change: transform, opacity;
	${glassGradientBorder({ bold: true, radius: 'var(--radius-lg)' })}

	${outsetFocusRing}
`;

/** Fades in as the drag approaches the commit threshold. */
export const StyledDeckVerdict = styled.span<{ $side: 'left' | 'right' }>`
	${uiLabel}
	position: absolute;
	top: var(--16);
	${({ $side }) => ($side === 'left' ? 'left: var(--16);' : 'right: var(--16);')}
	padding: var(--2) var(--8);
	border: 1px solid ${({ $side }) => ($side === 'left' ? 'var(--danger)' : 'var(--success)')};
	border-radius: var(--radius-sm);
	color: ${({ $side }) => ($side === 'left' ? 'var(--danger)' : 'var(--success)')};
	font-size: var(--font-size-caption);
	text-transform: uppercase;
	letter-spacing: 0.08em;
	opacity: 0;
	pointer-events: none;
`;

export const StyledDeckEmpty = styled.div`
	${uiLabel}
	display: grid;
	place-items: center;
	height: 100%;
	opacity: var(--opacity-text-muted);
`;

export const StyledDeckActions = styled.div`
	display: flex;
	align-items: center;
	gap: var(--12);
`;

export const StyledDeckButton = styled.button<{ $tone: 'danger' | 'success' }>`
	${bareButton}
	${pressable}
	${uiLabel}
	display: grid;
	place-items: center;
	width: var(--36);
	height: var(--36);
	border-radius: var(--radius-circle);
	border: 1px solid ${({ $tone }) => `var(--${$tone})`};
	color: ${({ $tone }) => `var(--${$tone})`};
	opacity: var(--opacity-text-muted);
	transition: opacity var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
`;
