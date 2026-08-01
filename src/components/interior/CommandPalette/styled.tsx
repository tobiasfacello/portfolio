import styled from 'styled-components';

//* Config
import { mq } from '../../../config/breakpoints';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, hitArea, pressable, uiLabel } from '../shared/styled';

export const StyledPaletteOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: var(--z-overlay);
	display: flex;
	justify-content: center;
	/* Sits high rather than centred: the list grows downward into empty space
	   instead of pushing the input around as results change. */
	padding: 12vh var(--16) var(--16);

	${mq.up('mobile-lg')} {
		padding-top: 14vh;
	}
`;

export const StyledPaletteBackdrop = styled.div`
	position: absolute;
	inset: 0;
	background-color: var(--lightbox-overlay);
`;

export const StyledPalettePanel = styled.div`
	position: relative;
	z-index: var(--z-overlay-content);
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 520px;
	max-height: min(60vh, 460px);
	overflow: hidden;
	background-color: var(--overlay-solid);
	background-clip: padding-box;
	border-radius: var(--radius-lg);
	outline: none;
	will-change: transform, opacity;
	${glassGradientBorder({ bold: true, radius: 'var(--radius-lg)' })}
`;

export const StyledPaletteHeader = styled.div`
	display: flex;
	align-items: center;
	gap: var(--8);
	flex-shrink: 0;
	padding: var(--8) var(--12);
	border-bottom: 1px solid var(--glass-border-start);
`;

export const StyledPaletteInput = styled.input`
	${uiLabel}
	flex: 1;
	min-width: 0;
	border: none;
	background: transparent;
	outline: none;
	font-size: var(--font-size-body);

	&::placeholder {
		color: var(--text);
		opacity: var(--opacity-text-muted);
	}
`;

export const StyledPaletteList = styled.ul`
	flex: 1;
	min-height: 0;
	padding: 5px;
	overflow-y: auto;
	overscroll-behavior: contain;
	list-style: none;
	scrollbar-gutter: stable;
`;

export const StyledPaletteRow = styled.li<{ $active: boolean }>`
	${uiLabel}
	display: flex;
	align-items: center;
	gap: var(--12);
	height: var(--36);
	padding: 0 var(--12);
	border-radius: var(--radius-sm);
	cursor: default;
	font-size: var(--font-size-body-sm);
	background-color: ${({ $active }) => ($active ? 'var(--glass-bg-bold)' : 'transparent')};
	opacity: ${({ $active }) => ($active ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	transition:
		background-color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state);
`;

export const StyledPaletteLabel = styled.span`
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledPaletteHint = styled.span`
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
`;

export const StyledPaletteKeys = styled.span`
	display: flex;
	gap: var(--4);
	flex-shrink: 0;
`;

export const StyledPaletteKey = styled.kbd`
	${uiLabel}
	display: grid;
	place-items: center;
	min-width: var(--16);
	height: var(--16);
	padding: 0 var(--4);
	border: 1px solid var(--glass-border-bold-start);
	border-radius: 4px;
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
`;

export const StyledPaletteEmpty = styled.div`
	${uiLabel}
	display: grid;
	place-items: center;
	padding: var(--24) var(--12);
	opacity: var(--opacity-text-muted);
`;

export const StyledPaletteClose = styled.button`
	${bareButton}
	/* Hit area: alone at the end of the header, so it can take the full desktop target. */
	${hitArea('var(--hit-area-desktop)')}
	${pressable}
	display: grid;
	place-items: center;
	width: var(--24);
	height: var(--24);
	flex-shrink: 0;
	border-radius: var(--radius-sm);
	color: var(--text);
	opacity: var(--opacity-text-muted);

	&:hover {
		opacity: var(--opacity-full);
	}

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}
`;
