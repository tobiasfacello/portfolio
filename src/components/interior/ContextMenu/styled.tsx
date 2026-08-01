import styled from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, pressableRow, uiLabel } from '../shared/styled';

export const StyledContextTarget = styled.div`
	position: relative;
	outline: none;
	/* The browser's own text selection would fight the long press on touch. */
	-webkit-touch-callout: none;

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
`;

export const StyledContextMenu = styled.div`
	position: fixed;
	z-index: var(--z-overlay);
	padding: 5px;
	overflow-y: auto;
	overscroll-behavior: contain;
	background-color: var(--overlay-solid);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	outline: none;
	will-change: transform, opacity;
	${glassGradientBorder({ bold: true, radius: 'var(--radius-md)' })}
`;

export const StyledContextItem = styled.button<{ $active: boolean; $disabled?: boolean }>`
	${bareButton}
	${pressableRow}
	${uiLabel}
	display: flex;
	align-items: center;
	gap: var(--8);
	width: 100%;
	height: var(--32);
	padding: 0 var(--8);
	border-radius: var(--radius-sm);
	font-size: var(--font-size-body-sm);
	text-align: left;
	cursor: default;
	background-color: ${({ $active, $disabled }) =>
		$active && !$disabled ? 'var(--glass-bg-bold)' : 'transparent'};
	opacity: ${({ $active, $disabled }) =>
		$disabled ? 'var(--opacity-text-disabled)' : $active ? 'var(--opacity-full)' : 'var(--opacity-text-muted)'};
	transition:
		background-color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);
`;

export const StyledContextIcon = styled.span`
	display: grid;
	place-items: center;
	width: var(--16);
	height: var(--16);
	flex-shrink: 0;
`;

export const StyledContextLabel = styled.span`
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledContextShortcut = styled.span`
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
`;

export const StyledContextSeparator = styled.div`
	height: 1px;
	margin: var(--4) var(--6);
	background-color: var(--glass-border-start);
`;
