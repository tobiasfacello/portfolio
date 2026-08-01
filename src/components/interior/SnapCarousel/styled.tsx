import styled from 'styled-components';

//* Shared
import { bareButton, outsetFocusRing, pressable, uiLabel } from '../shared/styled';

export const StyledCarouselRoot = styled.div`
	width: 100%;
`;

export const StyledCarouselViewport = styled.div<{ $dragging: boolean }>`
	position: relative;
	width: 100%;
	overflow: hidden;
	border-radius: var(--radius-lg);
	cursor: ${({ $dragging }) => ($dragging ? 'grabbing' : 'grab')};
	user-select: ${({ $dragging }) => ($dragging ? 'none' : 'auto')};
	outline: none;

	${outsetFocusRing}
`;

export const StyledCarouselTrack = styled.div<{ $gap: number }>`
	display: flex;
	gap: ${({ $gap }) => $gap}px;
	will-change: transform;
`;

export const StyledCarouselSlide = styled.div`
	flex: 0 0 100%;
	min-width: 0;
`;

export const StyledCarouselDots = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--4);
	margin-top: var(--12);
`;

/**
 * The pill is drawn by the pseudo-element so the button itself can be a real
 * target. A 6px dot is a sixth of the WCAG floor, and dots sat close enough
 * that a pseudo-element hit area would have overlapped its neighbour — the only
 * way out is for the box to carry the size and the pill to carry the look.
 */
export const StyledCarouselDot = styled.button<{ $active: boolean }>`
	${bareButton}
	${pressable}
	display: grid;
	place-items: center;
	width: var(--20);
	height: var(--24);
	border-radius: var(--radius-sm);

	&::before {
		content: '';
		display: block;
		width: ${({ $active }) => ($active ? 'var(--16)' : 'var(--6)')};
		height: var(--6);
		border-radius: var(--radius-pill);
		background-color: var(--text);
		opacity: ${({ $active }) => ($active ? 'var(--opacity-full)' : 'var(--opacity-subtle)')};
		transition:
			width var(--transition-base) var(--ease-smooth-out),
			opacity var(--transition-base) var(--ease-state);
	}

	&:hover::before {
		opacity: ${({ $active }) => ($active ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	}

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: -2px;
	}
`;

export const StyledCarouselStatus = styled.span`
	${uiLabel}
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);
`;
