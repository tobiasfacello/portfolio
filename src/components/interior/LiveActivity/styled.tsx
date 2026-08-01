import styled from 'styled-components';

//? Types
import type { ActivityPhase } from './useLiveActivity';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, pressable, uiLabel } from '../shared/styled';

const toneFor: Record<ActivityPhase, string> = {
	running: 'var(--text)',
	success: 'var(--success)',
	error: 'var(--danger)',
};

export const StyledActivitySlot = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;

export const StyledActivityPill = styled.div`
	display: flex;
	align-items: center;
	gap: var(--12);
	max-width: 100%;
	padding: var(--6) var(--12);
	background-color: var(--overlay-solid);
	background-clip: padding-box;
	border-radius: var(--radius-pill);
	will-change: transform, opacity;
	${glassGradientBorder({ bold: true, radius: 'var(--radius-pill)' })}
`;

export const StyledActivityGlyph = styled.span<{ $phase: ActivityPhase }>`
	position: relative;
	display: grid;
	place-items: center;
	width: var(--16);
	height: var(--16);
	flex-shrink: 0;
	color: ${({ $phase }) => toneFor[$phase]};

	> * {
		grid-area: 1 / 1;
	}
`;

export const StyledActivitySpinner = styled.svg`
	width: var(--16);
	height: var(--16);
	transform-origin: center;
`;

export const StyledActivityText = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 0;
`;

export const StyledActivityTitle = styled.span`
	${uiLabel}
	font-size: var(--font-size-body-sm);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledActivityDetail = styled.span`
	${uiLabel}
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

/** Sits under the pill's own padding, so progress never adds a row. */
export const StyledActivityTrack = styled.span`
	position: absolute;
	left: var(--16);
	right: var(--16);
	bottom: var(--6);
	height: 2px;
	border-radius: var(--radius-pill);
	background-color: var(--glass-border-bold-start);
	overflow: hidden;
`;

export const StyledActivityFill = styled.span`
	position: absolute;
	inset: 0;
	transform-origin: left center;
	border-radius: var(--radius-pill);
	background-color: var(--accent);
	will-change: transform;
`;

export const StyledActivityAction = styled.button`
	${bareButton}
	${pressable}
	${uiLabel}
	flex-shrink: 0;
	padding: var(--2) var(--8);
	border: 1px solid var(--glass-border-bold-start);
	border-radius: var(--radius-pill);
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
	transition: opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
`;
