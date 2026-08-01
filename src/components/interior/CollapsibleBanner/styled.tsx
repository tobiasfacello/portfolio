import styled from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, focusRing, pressable, uiBody, uiLabel } from '../shared/styled';

/** Outer clip — animating this to zero is what removes the banner's space. */
export const StyledBannerClip = styled.div`
	overflow: hidden;
	border-radius: var(--radius-md);
`;

export const StyledBanner = styled.div`
	position: relative;
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	${glassGradientBorder({ radius: 'var(--radius-md)' })}
`;

export const StyledBannerRow = styled.div`
	display: flex;
	align-items: center;
	gap: var(--8);
	padding: var(--8);
`;

export const StyledBannerGlyph = styled.span`
	display: grid;
	place-items: center;
	width: 26px;
	height: 26px;
	flex-shrink: 0;
	border-radius: var(--radius-sm);
	background-color: var(--glass-bg-bold);
	color: var(--text);
	opacity: var(--opacity-text-muted);
`;

export const StyledBannerToggle = styled.button`
	${bareButton}
	${pressable}
	${focusRing}
	display: flex;
	align-items: center;
	gap: var(--8);
	flex: 1;
	min-width: 0;
	border-radius: var(--radius-sm);
	text-align: left;
`;

export const StyledBannerTitle = styled.span`
	${uiLabel}
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: var(--line-height-body);
`;

export const StyledBannerCaret = styled.span`
	display: flex;
	flex-shrink: 0;
	color: var(--text);
	opacity: var(--opacity-text-muted);
	will-change: transform;
`;

export const StyledBannerClose = styled.button`
	${bareButton}
	${pressable}
	${focusRing}
	display: grid;
	place-items: center;
	width: 26px;
	height: 26px;
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

export const StyledBannerBody = styled.div`
	overflow: hidden;
`;

/** Indented to line up with the title, past the glyph. */
export const StyledBannerContent = styled.div`
	padding: 0 var(--8) var(--8) 46px;
	will-change: transform;
`;

export const StyledBannerDescription = styled.p`
	text-wrap: pretty;
	${uiBody}
	font-size: var(--font-size-caption);
	line-height: var(--line-height-body-sm);
	opacity: var(--opacity-text-muted);
`;

export const StyledBannerAction = styled.div`
	margin-top: var(--8);
`;
