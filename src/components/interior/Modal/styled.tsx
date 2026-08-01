import styled from 'styled-components';

//? Variants
import { SURFACE_GAP, SURFACE_PADDING, type SurfaceDensity } from '../shared/variants';

//* Config
import { mq } from '../../../config/breakpoints';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, focusRing, hitArea, pressable, uiBody, uiLabel } from '../shared/styled';

export const StyledOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: var(--z-overlay);
	display: grid;
	place-items: center;
	padding: var(--16);

	${mq.up('mobile-lg')} {
		padding: var(--24);
	}
`;

export const StyledBackdrop = styled.div`
	position: absolute;
	inset: 0;
	background-color: var(--lightbox-overlay);
	touch-action: none;
`;

export const StyledPanel = styled.div<{ $maxWidth: number; $maxHeight: string }>`
	position: relative;
	z-index: var(--z-overlay-content);
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: ${({ $maxWidth }) => $maxWidth}px;
	max-height: ${({ $maxHeight }) => $maxHeight};
	overflow: hidden;
	background-color: var(--overlay-solid);
	background-clip: padding-box;
	border-radius: var(--radius-lg);
	outline: none;
	${glassGradientBorder({ bold: true, radius: 'var(--radius-lg)' })}
	will-change: transform, opacity;
`;

export const StyledPanelHeader = styled.div<{ $density: SurfaceDensity }>`
	display: flex;
	align-items: flex-start;
	gap: var(--12);
	flex-shrink: 0;
	padding: ${({ $density }) => `${SURFACE_PADDING[$density]} ${SURFACE_PADDING[$density]} ${SURFACE_GAP[$density]}`};
`;

export const StyledPanelHeading = styled.div`
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: var(--4);
`;

export const StyledPanelTitle = styled.h2`
	text-wrap: balance;
	${uiLabel}
	font-size: var(--font-size-subtitle-sm);
	line-height: var(--line-height-subtitle-sm);
`;

export const StyledPanelDescription = styled.p`
	text-wrap: pretty;
	${uiBody}
	opacity: var(--opacity-text-muted);
`;

export const StyledPanelBody = styled.div<{ $density: SurfaceDensity }>`
	text-wrap: pretty;
	${uiBody}
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	overscroll-behavior: contain;
	padding: ${({ $density }) => `0 ${SURFACE_PADDING[$density]} ${SURFACE_PADDING[$density]}`};
`;

export const StyledPanelFooter = styled.div<{ $density: SurfaceDensity }>`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: var(--8);
	flex-shrink: 0;
	padding: ${({ $density }) => `${SURFACE_GAP[$density]} ${SURFACE_PADDING[$density]}`};
	border-top: 1px solid var(--glass-border-start);
`;

export const StyledCloseButton = styled.button`
	${bareButton}
	/* Hit area: alone at the end of the header, so it can take the full desktop target. */
	${hitArea('var(--hit-area-desktop)')}
	${pressable}
	${focusRing}
	display: grid;
	place-items: center;
	flex-shrink: 0;
	width: var(--control-xs);
	height: var(--control-xs);
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
