import styled from 'styled-components';

//* Shared
import { StyledStateStack, uiLabel, wellSurface } from '../shared/styled';

export const StyledReadingRoot = styled.div`
	display: flex;
	align-items: center;
	gap: var(--12);
	width: 100%;
`;

export const StyledReadingTrack = styled.div`
	${wellSurface}
	flex: 1;
	min-width: 0;
	padding: var(--2);
	border-radius: var(--radius-sm);
`;

export const StyledReadingFill = styled.div`
	width: 100%;
	height: 3px;
	transform-origin: left center;
	border-radius: var(--radius-sm);
	background-color: var(--accent);
	will-change: transform;
`;

/**
 * The readout reserves the width of its longest state ("End · 8 min"), so
 * finishing an article cannot make the bar beside it jump.
 */
export const StyledReadingReadout = styled(StyledStateStack)`
	${uiLabel}
	justify-items: end;
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;

	> span[data-ghost] {
		visibility: hidden;
	}
`;

export const StyledReadingRemaining = styled.span`
	white-space: nowrap;
	opacity: var(--opacity-text-muted);
`;

export const StyledReadingDone = styled.span`
	display: flex;
	align-items: center;
	gap: var(--4);
	white-space: nowrap;
`;
