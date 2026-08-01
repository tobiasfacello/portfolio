import styled from 'styled-components';

//* Shared
import { bareButton, pressable, StyledStateStack, uiLabel, wellSurface } from '../shared/styled';

export const StyledFilterRoot = styled.div`
	width: 100%;
`;

export const StyledFilterBar = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: var(--6);
	margin-bottom: var(--12);
`;

export const StyledFilterChip = styled.button<{ $active: boolean; $empty: boolean }>`
	${bareButton}
	${pressable}
	${uiLabel}
	display: inline-flex;
	align-items: center;
	gap: var(--6);
	/* Was var(--28), which is not on the spacing scale — the declaration was
	   dropped and the chip collapsed to 17px, under the 24px target floor. */
	min-height: var(--hit-area-min);
	padding: var(--4) var(--12);
	border-radius: var(--radius-pill);
	/* An option with no matches stays selectable — you may want to confirm the
	   emptiness — so it is marked by a dashed edge rather than by dimming the
	   label out of legibility. */
	border: 1px ${({ $empty, $active }) => (!$active && $empty ? 'dashed' : 'solid')}
		${({ $active }) => ($active ? 'var(--accent)' : 'var(--glass-border-bold-start)')};
	background-color: ${({ $active }) => ($active ? 'var(--accent)' : 'transparent')};
	color: ${({ $active }) => ($active ? 'var(--pill-text-hovered)' : 'var(--text)')};
	font-size: var(--font-size-caption);
	opacity: ${({ $active }) => ($active ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	transition:
		background-color var(--transition-fast) var(--ease-state),
		border-color var(--transition-fast) var(--ease-state),
		color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
`;

export const StyledFilterCount = styled.span`
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);
`;

export const StyledFilterViewport = styled.div<{ $height: number }>`
	position: relative;
	height: ${({ $height }) => $height}px;
	overflow-y: auto;
	overscroll-behavior: contain;
	scrollbar-gutter: stable;
`;

export const StyledFilterGrid = styled.div<{ $columns: number; $gap: number }>`
	display: grid;
	grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
	gap: ${({ $gap }) => $gap}px;
`;

export const StyledFilterCell = styled.div<{ $height: number }>`
	${wellSurface}
	display: flex;
	align-items: center;
	justify-content: center;
	height: ${({ $height }) => $height}px;
	padding: var(--8);
	will-change: transform, opacity;
`;

export const StyledFilterEmpty = styled(StyledStateStack)`
	${uiLabel}
	place-items: center;
	position: absolute;
	inset: 0;
	opacity: 0;
	pointer-events: none;
`;
