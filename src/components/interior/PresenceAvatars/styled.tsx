import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, uiLabel } from '../shared/styled';

export const StyledPresenceRoot = styled.div`
	display: inline-flex;
	align-items: center;
`;

export const StyledPresenceRail = styled.div<{ $size: number }>`
	position: relative;
	flex-shrink: 0;
	height: ${({ $size }) => $size}px;
	will-change: width;
`;

/**
 * The outer pad is the ring that separates overlapping avatars — a border would
 * be clipped by the neighbour stacked on top of it.
 */
export const StyledPresenceTile = styled.span<{ $size: number }>`
	position: absolute;
	left: 0;
	top: 0;
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	padding: 3px;
	border-radius: var(--radius-md);
	background-color: var(--background);
	user-select: none;
	will-change: transform, opacity;
`;

export const StyledPresenceWell = styled.span`
	${uiLabel}
	position: relative;
	display: grid;
	place-items: center;
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: var(--radius-sm);
	background-color: var(--secondary);
	color: var(--text);
	line-height: 1;
	font-size: inherit;
`;

/** Sits on top of the initials, so a slow image never leaves an empty circle. */
export const StyledPresenceImage = styled.img`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	opacity: 0;
`;

export const StyledOverflowChip = styled.span<{ $width: number; $size: number }>`
	${uiLabel}
	position: absolute;
	left: 0;
	top: 0;
	display: grid;
	place-items: center;
	width: ${({ $width }) => $width}px;
	height: ${({ $size }) => $size}px;
	border: 1px solid var(--glass-border-bold-start);
	border-radius: var(--radius-md);
	background-color: var(--overlay-solid);
	box-shadow: 0 0 0 2px var(--background);
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	line-height: 1;
	opacity: var(--opacity-text-muted);
	will-change: transform, opacity;
`;

export const StyledOverflowButton = styled(StyledOverflowChip).attrs({ as: 'button' })`
	${bareButton}
	${focusRing}

	&:hover {
		opacity: var(--opacity-full);
	}
`;

export const StyledPresenceList = styled.ul`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
`;
