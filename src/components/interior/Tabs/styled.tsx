import styled from 'styled-components';

//? Variants
import { CONTROL_SIZES, type ControlSize } from '../shared/variants';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, insetFocusRing, pressable, StyledStateStack, uiBody, uiLabel } from '../shared/styled';

export const StyledTabsRoot = styled.div`
	position: relative;
	width: 100%;
	overflow: hidden;
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	${glassGradientBorder({ radius: 'var(--radius-md)' })}
`;

export const StyledTabList = styled.div`
	position: relative;
	display: flex;
	gap: var(--4);
	width: 100%;
	padding: var(--4) var(--4) 0;
	border-bottom: 1px solid var(--glass-border-start);
	background-color: var(--glass-bg-bold);
	overflow-x: auto;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;

/**
 * The raised plateau behind the selected tab. It sits one pixel below the list
 * border so the tab reads as continuous with the panel underneath it.
 */
export const StyledTabIndicator = styled.span`
	position: absolute;
	top: var(--4);
	bottom: -1px;
	left: 0;
	background-color: var(--glass-bg);
	border-radius: var(--radius-sm) var(--radius-sm) 0 0;
	border: 1px solid var(--glass-border-start);
	border-bottom: none;
	pointer-events: none;
	will-change: transform, width;
`;

export const StyledTab = styled.button<{ $selected: boolean; $disabled?: boolean; $size: ControlSize }>`
	${bareButton}
	${pressable}
	${uiLabel}
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	min-height: ${({ $size }) => CONTROL_SIZES[$size].minHeight};
	padding: ${({ $size }) => CONTROL_SIZES[$size].padding};
	font-size: ${({ $size }) => CONTROL_SIZES[$size].fontSize};
	/* Square at the bottom: the tab meets its panel there. */
	border-radius: var(--radius-sm) var(--radius-sm) 0 0;
	cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
	opacity: ${({ $selected, $disabled }) =>
		$disabled ? 'var(--opacity-text-disabled)' : $selected ? 'var(--opacity-full)' : 'var(--opacity-text-muted)'};
	transition: opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: ${({ $disabled }) => ($disabled ? 'var(--opacity-text-disabled)' : 'var(--opacity-full)')};
	}

	${insetFocusRing}
`;

/**
 * The label is rendered twice: once invisible at its selected weight to reserve
 * the width, once visible at its current weight. Selecting a tab therefore
 * never nudges its neighbours sideways.
 */
export const StyledTabLabel = styled(StyledStateStack)`
	place-items: center;

	> span {
		white-space: nowrap;
	}

	> span[data-ghost] {
		visibility: hidden;
		font-weight: var(--font-weight-semibold);
	}
`;

export const StyledTabPanel = styled.div`
	${uiBody}
	padding: var(--12);
	outline: none;
	will-change: transform, opacity;

	${insetFocusRing}
`;
