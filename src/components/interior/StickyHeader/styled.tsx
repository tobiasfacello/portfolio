import styled from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { insetFocusRing, uiLabel } from '../shared/styled';

export const StyledStickyRoot = styled.div`
	position: relative;
	width: 100%;
	overflow: hidden;
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-lg);
	${glassGradientBorder({ radius: 'var(--radius-lg)' })}
`;

export const StyledStickyScroller = styled.div`
	overflow-y: auto;
	overscroll-behavior-y: contain;
	outline: none;
	scrollbar-gutter: stable;

	${insetFocusRing}
`;

export const StyledStickyHeaderBar = styled.header`
	position: absolute;
	inset-inline: 0;
	top: 0;
	pointer-events: none;
`;

/** Scales down from its top edge, so the header shrinks rather than slides away. */
export const StyledStickyPlate = styled.div`
	position: absolute;
	inset-inline: 0;
	top: 0;
	transform-origin: top center;
	background-color: var(--overlay-solid);
`;

/** Appears only once the header has lifted off the content it covers. */
export const StyledStickyEdge = styled.div`
	position: absolute;
	inset-inline: 0;
	top: 0;
	height: 1px;
	background-color: var(--glass-border-start);
	opacity: 0;
`;

export const StyledStickyRow = styled.div`
	position: absolute;
	inset-inline: 0;
	top: 0;
	display: flex;
	align-items: flex-start;
	gap: var(--8);
	padding: var(--8) var(--12) 0;
`;

export const StyledStickySlot = styled.div`
	display: flex;
	align-items: center;
	gap: var(--6);
	height: var(--24);
	flex-shrink: 0;
	pointer-events: auto;
`;

export const StyledStickyTitles = styled.div`
	position: relative;
	flex: 1;
	min-width: 0;
`;

export const StyledStickyExpanded = styled.div`
	transform-origin: left top;
	will-change: transform, opacity;
`;

export const StyledStickyTitle = styled.h2`
	${uiLabel}
	font-size: var(--font-size-subtitle-sm);
	line-height: 1.2;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledStickySubtitle = styled.p`
	${uiLabel}
	margin-top: var(--2);
	font-size: var(--font-size-caption);
	line-height: 1.35;
	opacity: var(--opacity-text-muted);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

/** The compact title, layered over the expanded one and crossfaded with it. */
export const StyledStickyCompact = styled.span`
	${uiLabel}
	position: absolute;
	inset-inline: 0;
	top: 3px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	opacity: 0;
	will-change: transform, opacity;
`;

export const StyledStickyFade = styled.div`
	position: sticky;
	bottom: 0;
	height: var(--24);
	margin-top: calc(var(--24) * -1);
	pointer-events: none;
	background: linear-gradient(to top, var(--overlay-solid), transparent);
`;
