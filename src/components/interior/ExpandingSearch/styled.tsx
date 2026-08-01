import styled from 'styled-components';

//* Shared
import { bareButton, hitArea, pressable, uiLabel } from '../shared/styled';

/** Width of the collapsed field — a square icon button. */
export const COLLAPSED = 40;
/** Where the text starts, clear of the icon. */
export const TEXT_LEFT = 34;
export const CLEAR_SLOT = 35;
export const COUNT_SLOT = 38;

export const StyledSearchRoot = styled.div`
	position: relative;
	width: 100%;
	height: 40px;
`;

export const StyledSearchShell = styled.div<{ $align: 'left' | 'right'; $focused: boolean }>`
	position: absolute;
	top: 0;
	bottom: 0;
	${({ $align }) => ($align === 'right' ? 'right: 0;' : 'left: 0;')}
	overflow: hidden;
	border-radius: var(--radius-md);
	border: 2px solid ${({ $focused }) => ($focused ? 'var(--accent)' : 'var(--glass-border-bold-start)')};
	background-color: var(--glass-bg-bold);
	transition:
		border-color var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state);
	will-change: width;
`;

export const StyledSearchInput = styled.input`
	${uiLabel}
	position: absolute;
	top: 0;
	bottom: 0;
	background: transparent;
	border: none;
	outline: none;
	font-size: var(--font-size-body-sm);
	line-height: 36px;

	&::placeholder {
		color: var(--text);
		opacity: var(--opacity-text-muted);
	}

	/* The native clear affordance duplicates our own button. */
	&::-webkit-search-cancel-button,
	&::-webkit-search-decoration {
		appearance: none;
	}
`;

export const StyledSearchTrailing = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	right: 7px;
	display: flex;
	align-items: center;
	gap: var(--6);
	pointer-events: none;
`;

export const StyledSearchCount = styled.span`
	${uiLabel}
	width: var(--32);
	text-align: right;
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const StyledSearchClear = styled.button<{ $active: boolean }>`
	${bareButton}
	/* Hit area: kept off the input's text area so it never steals a click meant to place the caret. */
	${hitArea('32px')}
	${pressable}
	display: grid;
	place-items: center;
	width: 22px;
	height: 22px;
	border-radius: var(--radius-sm);
	color: var(--text);
	opacity: 0;
	pointer-events: ${({ $active }) => ($active ? 'auto' : 'none')};

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: -2px;
	}
`;

/**
 * Sits above the shell and slides with it, so the icon appears to stay put
 * while the field grows out from underneath it.
 */
export const StyledSearchTrigger = styled.button<{ $align: 'left' | 'right'; $open: boolean }>`
	${bareButton}
	${pressable}
	position: absolute;
	top: 0;
	bottom: 0;
	${({ $align }) => ($align === 'right' ? 'right: 0;' : 'left: 0;')}
	z-index: 1;
	display: grid;
	place-items: center;
	width: 40px;
	border-radius: var(--radius-sm);
	color: var(--text);
	opacity: var(--opacity-text-muted);
	pointer-events: ${({ $open }) => ($open ? 'none' : 'auto')};
	will-change: transform;

	&:hover {
		opacity: var(--opacity-full);
	}

	&:disabled {
		opacity: 0.5;
	}

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: -2px;
	}
`;
