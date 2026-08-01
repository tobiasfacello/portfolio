import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, insetFocusRing, pressable, StyledStateStack, uiBody } from '../shared/styled';
import { control, type ControlSize, type ControlTone } from '../shared/variants';

export const StyledShowMoreRoot = styled.div`
	${uiBody}
	width: 100%;
`;

export const StyledShowMoreShell = styled.div`
	position: relative;
`;

export const StyledShowMoreRegion = styled.div<{ $scrollable: boolean; $capped: boolean }>`
	overflow-x: hidden;
	overflow-y: ${({ $scrollable }) => ($scrollable ? 'auto' : 'hidden')};
	overscroll-behavior: contain;
	border-radius: var(--radius-sm);
	outline: none;
	${({ $capped }) => $capped && 'scrollbar-gutter: stable;'}

	${insetFocusRing}
`;

/** Signals that text continues past the clip, rather than ending there. */
export const StyledShowMoreVeil = styled.div`
	position: absolute;
	inset-inline: 0;
	bottom: 0;
	height: var(--36);
	pointer-events: none;
	opacity: 0;
	background: linear-gradient(to top, var(--background), transparent);
`;

export const StyledShowMoreActions = styled.div`
	display: flex;
	align-items: center;
	height: var(--32);
	margin-top: var(--8);
`;

export const StyledShowMoreButton = styled.button<{ $hidden: boolean; $size: ControlSize; $tone: ControlTone }>`
	${bareButton}
	${pressable}
	${({ $size, $tone }) => control({ size: $size, tone: $tone })}
	${focusRing}
	/* Kept in the layout when unusable so removing it cannot reflow the block. */
	visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
	pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
`;

export const StyledShowMoreLabels = styled(StyledStateStack)`
	justify-items: start;

	> span {
		white-space: nowrap;
	}
`;

export const StyledShowMoreChevron = styled.svg`
	flex-shrink: 0;
	will-change: transform;
`;
