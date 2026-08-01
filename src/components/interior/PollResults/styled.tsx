import styled from 'styled-components';

//* Shared
import { bareButton, insetFocusRing, pressableRow, StyledStateStack, uiLabel } from '../shared/styled';

export const StyledPollRoot = styled.div`
	width: 100%;
`;

export const StyledPollTitle = styled.p`
	text-wrap: balance;
	${uiLabel}
	margin-bottom: var(--8);
	font-size: var(--font-size-body-sm);
`;

export const StyledPollRows = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--6);
`;

export const StyledPollRow = styled.button<{ $revealed: boolean }>`
	${bareButton}
	${pressableRow}
	position: relative;
	width: 100%;
	height: var(--36);
	overflow: hidden;
	border: 1px solid var(--glass-border-bold-start);
	border-radius: var(--radius-sm);
	background-color: ${({ $revealed }) => ($revealed ? 'var(--glass-bg-bold)' : 'transparent')};
	text-align: left;
	cursor: ${({ $revealed }) => ($revealed ? 'default' : 'pointer')};
	transition:
		border-color var(--transition-base) var(--ease-state),
		background-color var(--transition-base) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		border-color: ${({ $revealed }) => ($revealed ? 'var(--glass-border-bold-start)' : 'var(--primary)')};
	}

	${insetFocusRing}
`;

/**
 * The bar is inset from the row's border so it reads as filling a well rather
 * than overpainting the outline. Revealed by clip, not width, so the rounded
 * end never squashes as it grows.
 */
export const StyledPollBar = styled.span<{ $mine: boolean }>`
	position: absolute;
	inset: 3px;
	border-radius: 5px;
	background-color: ${({ $mine }) => ($mine ? 'var(--accent)' : 'var(--secondary)')};
	opacity: ${({ $mine }) => ($mine ? 0.32 : 0.55)};
	pointer-events: none;
	will-change: clip-path;
`;

export const StyledPollRowInner = styled.span`
	position: relative;
	display: flex;
	align-items: center;
	gap: var(--8);
	height: 100%;
	padding: 0 var(--12);
`;

export const StyledPollLabel = styled.span<{ $winner: boolean }>`
	${uiLabel}
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: var(--font-size-body-sm);
	opacity: ${({ $winner }) => ($winner ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	transition: opacity var(--transition-base) var(--ease-state);
`;

export const StyledPollTick = styled.span`
	display: grid;
	place-items: center;
	width: var(--16);
	height: var(--16);
	flex-shrink: 0;
	color: var(--text);
	opacity: 0;
`;

/** Reserves the width of "100%", so counting up never shifts the label. */
export const StyledPollReadout = styled(StyledStateStack)`
	${uiLabel}
	flex-shrink: 0;
	justify-items: end;
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);

	> span[data-ghost] {
		visibility: hidden;
	}
`;

export const StyledPollTotal = styled.p`
	${uiLabel}
	height: var(--16);
	margin-top: var(--8);
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);

	> span {
		display: inline-block;
		opacity: 0;
	}
`;
