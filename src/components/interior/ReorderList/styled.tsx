import styled from 'styled-components';

//* Shared
import { outsetFocusRing, uiLabel, wellSurface } from '../shared/styled';

export const StyledReorderList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: var(--6);
	width: 100%;
	list-style: none;
`;

export const StyledReorderRow = styled.li<{ $held: boolean }>`
	${wellSurface}
	${uiLabel}
	display: flex;
	align-items: center;
	gap: var(--12);
	padding: var(--12);
	font-size: var(--font-size-body-sm);
	cursor: grab;
	user-select: none;
	/* Vertical panning is ours while dragging a row. */
	touch-action: none;
	outline: none;
	/* Lifted rows sit above their neighbours as they pass. */
	z-index: ${({ $held }) => ($held ? 1 : 0)};
	border-color: ${({ $held }) => ($held ? 'var(--accent)' : 'transparent')};
	will-change: transform;

	&:active {
		cursor: grabbing;
	}

	${outsetFocusRing}
`;

export const StyledReorderGrip = styled.span`
	display: grid;
	place-items: center;
	width: var(--16);
	height: var(--16);
	flex-shrink: 0;
	color: var(--text);
	opacity: var(--opacity-text-muted);
`;

export const StyledReorderLabel = styled.span`
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledReorderPosition = styled.span`
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);
`;
