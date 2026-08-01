import styled from 'styled-components';
import { insetFocusRing } from '../shared/styled';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

export const StyledHideRoot = styled.div`
	position: relative;
	width: 100%;
	min-width: 0;
	overflow: hidden;
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-lg);
	${glassGradientBorder({ radius: 'var(--radius-lg)' })}
`;

export const StyledHideBar = styled.div<{ $height: number }>`
	position: absolute;
	inset-inline: 0;
	top: 0;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: var(--8);
	height: ${({ $height }) => $height}px;
	padding: 0 var(--12);
	background-color: var(--overlay-solid);
	will-change: transform;
`;

/** Only drawn once the content has moved, so a resting panel has no seam. */
export const StyledHideBarRule = styled.span`
	position: absolute;
	inset-inline: 0;
	bottom: 0;
	height: 1px;
	background-color: var(--glass-border-start);
	pointer-events: none;
	opacity: 0;
`;

export const StyledHideScroller = styled.div`
	overflow-y: auto;
	overscroll-behavior-y: contain;
	outline: none;
	scrollbar-gutter: stable;

	${insetFocusRing}
`;

/** Reserves the space the bar occupies while it is at rest. */
export const StyledBarSpacer = styled.div<{ $height: number }>`
	height: ${({ $height }) => $height}px;
`;

/**
 * Sticky fades at both ends so clipped content dissolves rather than being cut
 * off with a hard edge.
 */
export const StyledEdgeFade = styled.div<{ $edge: 'top' | 'bottom' }>`
	position: sticky;
	${({ $edge }) => ($edge === 'top' ? 'top: 0;' : 'bottom: 0;')}
	height: var(--20);
	margin-${({ $edge }) => ($edge === 'top' ? 'bottom' : 'top')}: calc(var(--20) * -1);
	pointer-events: none;
	background: linear-gradient(
		${({ $edge }) => ($edge === 'top' ? 'to bottom' : 'to top')},
		var(--overlay-solid),
		transparent
	);
`;
