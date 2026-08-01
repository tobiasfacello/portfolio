import styled, { css } from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, insetFocusRing, pressable, uiLabel } from '../shared/styled';

export const StyledMarqueeRoot = styled.section`
	position: relative;
	isolation: isolate;
	width: 100%;
	min-width: 0;
	max-width: 100%;
	overflow: hidden;
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-lg);
	${glassGradientBorder({ radius: 'var(--radius-lg)' })}
`;

export const StyledMarqueeViewport = styled.div`
	overflow-y: hidden;
	padding: var(--8) 0;
	outline: none;

	${insetFocusRing}
`;

export const StyledMarqueeTrack = styled.div<{ $gap: number }>`
	display: flex;
	align-items: center;
	width: max-content;
	gap: ${({ $gap }) => $gap}px;
	will-change: transform;
`;

export const StyledMarqueeGroup = styled.ul<{ $gap: number }>`
	display: flex;
	align-items: center;
	width: max-content;
	gap: ${({ $gap }) => $gap}px;
	list-style: none;
`;

export const StyledMarqueeItem = styled.li`
	flex-shrink: 0;
`;

const faceStyles = css`
	${uiLabel}
	display: inline-flex;
	align-items: center;
	gap: var(--8);
	height: var(--36);
	flex-shrink: 0;
	padding: 0 var(--12);
	border-radius: var(--radius-sm);
	white-space: nowrap;
	font-size: var(--font-size-body-sm);
	opacity: var(--opacity-text-muted);
	text-decoration: none;
	transition: opacity var(--transition-fast) var(--ease-state);
`;

export const StyledMarqueeFace = styled.span`
	${faceStyles}
`;

export const StyledMarqueeLink = styled.a`
	${pressable}
	${faceStyles}
	outline: none;

	&:hover {
		opacity: var(--opacity-full);
	}

	${insetFocusRing}

	&:focus-visible {
		opacity: var(--opacity-full);
	}
`;

export const StyledMarqueeButton = styled.button`
	${bareButton}
	${pressable}
	${faceStyles}

	&:hover {
		opacity: var(--opacity-full);
	}

	${insetFocusRing}

	&:focus-visible {
		opacity: var(--opacity-full);
	}
`;

/** Dissolves the strip at both ends rather than cutting it off. */
export const StyledMarqueeFade = styled.div<{ $side: 'left' | 'right' }>`
	position: absolute;
	top: 0;
	bottom: 0;
	${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
	width: var(--36);
	pointer-events: none;
	background: linear-gradient(
		${({ $side }) => ($side === 'left' ? 'to right' : 'to left')},
		var(--background),
		transparent
	);
`;
