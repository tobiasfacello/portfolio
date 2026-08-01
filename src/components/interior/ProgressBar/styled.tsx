import styled from 'styled-components';

//* Shared
import { uiLabel, wellSurface } from '../shared/styled';
import { StyledStateStack } from '../shared/styled';

//? Variants
import type { ProgressSize, ProgressTone } from '../shared/variants';
import { PROGRESS_THICKNESS, PROGRESS_TONES } from '../shared/variants';

export const StyledProgressRoot = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--8);
`;

export const StyledProgressHeader = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: var(--12);
`;

export const StyledProgressLabel = styled.span`
	${uiLabel}
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

/**
 * Both readouts are stacked so the row never reflows when the bar flips
 * between indeterminate and measured.
 */
export const StyledProgressReadout = styled(StyledStateStack)`
	${uiLabel}
	justify-items: end;
	flex-shrink: 0;
	opacity: var(--opacity-text-muted);
	font-variant-numeric: tabular-nums;

	> span {
		white-space: nowrap;
	}
`;

export const StyledProgressTrack = styled.div`
	${wellSurface}
	padding: var(--2);
	border-radius: var(--radius-sm);
`;

export const StyledProgressClip = styled.div<{ $size: ProgressSize }>`
	position: relative;
	height: ${({ $size }) => PROGRESS_THICKNESS[$size]};
	border-radius: var(--radius-sm);
	overflow: hidden;
`;

export const StyledProgressFill = styled.span<{ $tone: ProgressTone }>`
	position: absolute;
	inset: 0;
	display: block;
	transform-origin: left center;
	border-radius: var(--radius-sm);
	background-color: ${({ $tone }) => PROGRESS_TONES[$tone]};
	will-change: transform;
`;

/** The indeterminate sweep — a fixed-width band that crosses the track. */
export const StyledProgressSweep = styled.span<{ $tone: ProgressTone }>`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	display: block;
	width: 40%;
	border-radius: var(--radius-sm);
	background-color: ${({ $tone }) => PROGRESS_TONES[$tone]};
	will-change: transform;
`;
