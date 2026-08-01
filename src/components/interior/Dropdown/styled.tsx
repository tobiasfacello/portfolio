import styled from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, focusRing, pressable, uiLabel } from '../shared/styled';
import { control, type ControlSize, type ControlTone } from '../shared/variants';

/** Row height. The highlight's travel is a multiple of this. */
export const ROW_HEIGHT = 32;

export const StyledDropdownRoot = styled.div`
	position: relative;
	display: inline-block;
	text-align: left;
`;

export const StyledDropdownTrigger = styled.button<{ $open: boolean; $size: ControlSize; $tone: ControlTone }>`
	${bareButton}
	${pressable}
	${({ $size, $tone }) => control({ size: $size, tone: $tone })}
	${focusRing}
	opacity: ${({ $open }) => ($open ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	background-color: ${({ $open }) => ($open ? 'var(--glass-bg-bold)' : 'transparent')};

	/* Opening is not a hover state — keep the trigger from lighting up. */
	&:hover:not(:disabled) {
		background-color: ${({ $open }) => ($open ? 'var(--glass-bg-bold)' : 'var(--accent)')};
		color: ${({ $open }) => ($open ? 'var(--text)' : 'var(--pill-text-hovered)')};
	}
`;

export const StyledDropdownCaret = styled.svg`
	width: var(--12);
	height: var(--12);
	flex-shrink: 0;
	will-change: transform;
`;

export const StyledDropdownPanel = styled.div`
	position: absolute;
	left: 0;
	top: calc(100% + 6px);
	z-index: var(--z-overlay);
	min-width: 224px;
	padding: var(--4);
	white-space: nowrap;
	background-color: var(--overlay-solid);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	/* Grows out of the trigger it is attached to. */
	transform-origin: top left;
	will-change: transform, opacity;
	${glassGradientBorder({ bold: true, radius: 'var(--radius-md)' })}
`;

export const StyledDropdownList = styled.ul`
	position: relative;
	max-height: 216px;
	overflow-y: auto;
	outline: none;
	list-style: none;
	scrollbar-gutter: stable;
`;

/**
 * One highlight that slides between rows, rather than a background on each.
 * Moving a single object is what makes arrow-key navigation read as travel
 * instead of a series of unrelated flashes.
 */
export const StyledDropdownHighlight = styled.span`
	position: absolute;
	inset-inline: 0;
	top: 0;
	height: ${ROW_HEIGHT}px;
	border-radius: var(--radius-sm);
	background-color: var(--glass-bg-bold);
	pointer-events: none;
	opacity: 0;
	will-change: transform;
`;

export const StyledDropdownItem = styled.li<{ $active: boolean; $disabled?: boolean }>`
	${uiLabel}
	position: relative;
	display: flex;
	align-items: center;
	height: ${ROW_HEIGHT}px;
	padding: 0 var(--8);
	border-radius: var(--radius-sm);
	font-size: var(--font-size-body-sm);
	cursor: default;
	user-select: none;
	opacity: ${({ $active, $disabled }) =>
		$disabled ? 'var(--opacity-text-disabled)' : $active ? 'var(--opacity-full)' : 'var(--opacity-text-muted)'};
	transition: opacity var(--transition-fast) var(--ease-state);
`;

export const StyledDropdownItemBody = styled.span`
	position: relative;
	display: flex;
	align-items: center;
	gap: var(--12);
	flex: 1;
	min-width: 0;
`;

export const StyledDropdownItemLabel = styled.span`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledDropdownItemHint = styled.span`
	margin-left: auto;
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	opacity: var(--opacity-text-muted);
`;

export const StyledDropdownCheck = styled.span`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 14px;
	height: 14px;
	margin-left: var(--8);
	flex-shrink: 0;
	opacity: 0;
`;

export const StyledDropdownEmpty = styled.li`
	${uiLabel}
	display: flex;
	align-items: center;
	height: ${ROW_HEIGHT}px;
	padding: 0 var(--8);
	font-size: var(--font-size-body-sm);
	opacity: var(--opacity-text-muted);
`;
