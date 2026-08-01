import styled from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, insetFocusRing, pressableRow, uiLabel } from '../shared/styled';

export const StyledTableShell = styled.div<{ $maxHeight?: number }>`
	position: relative;
	width: 100%;
	overflow: auto;
	${({ $maxHeight }) => ($maxHeight ? `max-height: ${$maxHeight}px;` : '')}
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	${glassGradientBorder({ radius: 'var(--radius-md)' })}
`;

export const StyledTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	table-layout: fixed;
`;

export const StyledTableHead = styled.thead`
	position: sticky;
	top: 0;
	z-index: 1;
	background-color: var(--overlay-solid);
`;

export const StyledHeaderCell = styled.th<{ $align: 'start' | 'end' }>`
	padding: 0;
	text-align: ${({ $align }) => $align};
	border-bottom: 1px solid var(--glass-border-start);
`;

export const StyledSortButton = styled.button<{ $align: 'start' | 'end'; $active: boolean }>`
	${bareButton}
	${pressableRow}
	${uiLabel}
	display: flex;
	align-items: center;
	justify-content: ${({ $align }) => ($align === 'end' ? 'flex-end' : 'flex-start')};
	gap: var(--4);
	width: 100%;
	height: var(--36);
	padding: 0 var(--12);
	font-size: var(--font-size-caption);
	opacity: ${({ $active }) => ($active ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	transition: opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}

	${insetFocusRing}
`;

export const StyledPlainHeader = styled.span<{ $align: 'start' | 'end' }>`
	${uiLabel}
	display: flex;
	align-items: center;
	justify-content: ${({ $align }) => ($align === 'end' ? 'flex-end' : 'flex-start')};
	height: var(--36);
	padding: 0 var(--12);
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
`;

/** Rotates between ascending and descending; fades out when the column is off. */
export const StyledSortCaret = styled.svg`
	flex-shrink: 0;
	opacity: 0;
	will-change: transform;
`;

export const StyledTableRow = styled.tr`
	will-change: transform;

	& + & td {
		border-top: 1px solid var(--glass-border-start);
	}
`;

export const StyledTableCell = styled.td<{ $align: 'start' | 'end'; $numeric?: boolean }>`
	${uiLabel}
	/* On a table cell, height behaves as a minimum and min-height is ignored
	   outright — so this is the one place the shorthand is the right choice. */
	height: var(--36);
	padding: 0 var(--12);
	text-align: ${({ $align }) => $align};
	font-size: var(--font-size-body-sm);
	font-variant-numeric: ${({ $numeric }) => ($numeric ? 'tabular-nums' : 'normal')};
	opacity: var(--opacity-text-muted);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
