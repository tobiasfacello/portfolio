import styled, { css } from 'styled-components';

//? Variants
import { SURFACE_GAP, SURFACE_PADDING, type SurfaceDensity } from '../shared/variants';

//? Types
import type { DrawerSide } from './useDrawer';

//* Shared
import { bareButton, focusRing, hitArea, pressable, uiBody, uiLabel } from '../shared/styled';

export const StyledDrawerRoot = styled.div<{ $fixed: boolean; $open: boolean }>`
	position: ${({ $fixed }) => ($fixed ? 'fixed' : 'absolute')};
	inset: 0;
	z-index: var(--z-overlay);
	overflow: hidden;
	pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
`;

export const StyledDrawerScrim = styled.div`
	position: absolute;
	inset: 0;
	background-color: var(--lightbox-overlay);
	opacity: 0;
`;

const edgeFor = (side: DrawerSide) =>
	side === 'right'
		? css`
				right: 0;
				border-left: 1px solid var(--glass-border-bold-start);
				border-radius: var(--radius-lg) 0 0 var(--radius-lg);
			`
		: css`
				left: 0;
				border-right: 1px solid var(--glass-border-bold-start);
				border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
			`;

export const StyledDrawerPanel = styled.div<{ $side: DrawerSide; $width: number; $dragging: boolean }>`
	position: absolute;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	width: ${({ $width }) => $width}px;
	max-width: calc(100% - 40px);
	background-color: var(--overlay-solid);
	outline: none;
	/* Vertical scrolling stays with the browser; horizontal is ours. */
	touch-action: pan-y;
	user-select: ${({ $dragging }) => ($dragging ? 'none' : 'auto')};
	will-change: transform;
	${({ $side }) => edgeFor($side)}
`;

export const StyledDrawerHeader = styled.header<{ $dragging: boolean; $density: SurfaceDensity }>`
	display: flex;
	align-items: flex-start;
	gap: var(--12);
	padding: ${({ $density }) => `${SURFACE_GAP[$density]} ${SURFACE_PADDING[$density]}`};
	border-bottom: 1px solid var(--glass-border-start);
	user-select: none;
	cursor: ${({ $dragging }) => ($dragging ? 'grabbing' : 'grab')};
`;

export const StyledDrawerHeading = styled.div`
	flex: 1;
	min-width: 0;
`;

export const StyledDrawerTitle = styled.h2`
	${uiLabel}
	font-size: var(--font-size-body-sm);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledDrawerDescription = styled.p`
	${uiBody}
	margin-top: var(--2);
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledDrawerClose = styled.button`
	${bareButton}
	/* Hit area: alone at the end of the header, so it can take the full desktop target. */
	${hitArea('var(--hit-area-desktop)')}
	${pressable}
	${focusRing}
	display: grid;
	place-items: center;
	width: var(--24);
	height: var(--24);
	flex-shrink: 0;
	border-radius: var(--radius-sm);
	color: var(--text);
	opacity: var(--opacity-text-muted);
	transition:
		opacity var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
		background-color: var(--glass-bg-bold);
	}
`;

export const StyledDrawerBody = styled.div<{ $density: SurfaceDensity }>`
	text-wrap: pretty;
	${uiBody}
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	overscroll-behavior: contain;
	padding: ${({ $density }) => `${SURFACE_GAP[$density]} ${SURFACE_PADDING[$density]}`};
`;

export const StyledDrawerFooter = styled.div<{ $density: SurfaceDensity }>`
	padding: ${({ $density }) => `${SURFACE_GAP[$density]} ${SURFACE_PADDING[$density]}`};
	border-top: 1px solid var(--glass-border-start);
`;
