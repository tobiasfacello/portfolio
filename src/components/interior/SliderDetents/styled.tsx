import styled from 'styled-components';

//* Shared
import { outsetFocusRing, uiLabel, wellSurface } from '../shared/styled';

export const THUMB_SIZE = 18;

export const StyledSliderRoot = styled.div`
	width: 100%;
`;

export const StyledSliderHeader = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: var(--12);
	margin-bottom: var(--8);
`;

export const StyledSliderLabel = styled.span`
	${uiLabel}
	font-size: var(--font-size-body-sm);
`;

export const StyledSliderReadout = styled.span`
	${uiLabel}
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);
`;

export const StyledSliderTrack = styled.div<{ $disabled?: boolean }>`
	${wellSurface}
	position: relative;
	height: ${THUMB_SIZE + 6}px;
	border-radius: var(--radius-pill);
	cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
	opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
	outline: none;

	${outsetFocusRing}
`;

export const StyledSliderFill = styled.span`
	position: absolute;
	top: 50%;
	left: 3px;
	height: 4px;
	border-radius: var(--radius-pill);
	background-color: var(--accent);
	transform: translateY(-50%);
	pointer-events: none;
	will-change: width;
`;

export const StyledSliderRail = styled.span`
	position: absolute;
	top: 50%;
	left: 3px;
	right: 3px;
	height: 4px;
	border-radius: var(--radius-pill);
	background-color: var(--glass-border-bold-start);
	transform: translateY(-50%);
	pointer-events: none;
`;

/** A notch on the rail, so the magnetic points are visible before you feel them. */
export const StyledSliderDetent = styled.span<{ $active: boolean }>`
	position: absolute;
	top: 50%;
	width: 2px;
	height: 8px;
	border-radius: 1px;
	background-color: ${({ $active }) => ($active ? 'var(--accent)' : 'var(--text)')};
	opacity: ${({ $active }) => ($active ? 'var(--opacity-full)' : 'var(--opacity-subtle)')};
	transform: translate(-50%, -50%);
	pointer-events: none;
	transition:
		background-color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state);
`;

export const StyledSliderThumb = styled.span<{ $dragging: boolean }>`
	position: absolute;
	top: 50%;
	left: 3px;
	width: ${THUMB_SIZE}px;
	height: ${THUMB_SIZE}px;
	border-radius: var(--radius-circle);
	border: 1px solid var(--primary);
	background-color: var(--accent);
	transform: translateY(-50%);
	pointer-events: none;
	will-change: transform;
`;

export const StyledDetentLabels = styled.div`
	position: relative;
	height: var(--16);
	margin-top: var(--4);
`;

export const StyledDetentLabel = styled.span`
	${uiLabel}
	position: absolute;
	top: 0;
	transform: translateX(-50%);
	font-size: var(--font-size-caption);
	white-space: nowrap;
	opacity: var(--opacity-text-muted);
`;
