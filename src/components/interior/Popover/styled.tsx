import styled, { css } from 'styled-components';

//? Types
import type { PopoverSide } from '../shared/usePopover';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, focusRing, pressable, uiBody } from '../shared/styled';
import { control, type ControlSize, type ControlTone } from '../shared/variants';

export const StyledPopoverTrigger = styled.button<{ $size: ControlSize; $tone: ControlTone }>`
	${bareButton}
	${pressable}
	${({ $size, $tone }) => control({ size: $size, tone: $tone })}
	${focusRing}
`;

export const StyledFloating = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	z-index: var(--z-overlay);
`;

export const StyledPopoverPanel = styled.div`
	position: relative;
	padding: var(--12);
	background-color: var(--overlay-solid);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	outline: none;
	will-change: transform, opacity;
	${glassGradientBorder({ bold: true, radius: 'var(--radius-md)' })}
`;

/**
 * A rotated square tucked under the panel edge. Only the two borders facing
 * away from the panel are drawn, so it reads as a continuation of the outline
 * rather than a diamond sitting on top of it.
 */
const arrowEdges: Record<PopoverSide, ReturnType<typeof css>> = {
	bottom: css`
		border-top: 1px solid var(--glass-border-bold-start);
		border-left: 1px solid var(--glass-border-bold-start);
	`,
	top: css`
		border-bottom: 1px solid var(--glass-border-bold-start);
		border-right: 1px solid var(--glass-border-bold-start);
	`,
	right: css`
		border-bottom: 1px solid var(--glass-border-bold-start);
		border-left: 1px solid var(--glass-border-bold-start);
	`,
	left: css`
		border-top: 1px solid var(--glass-border-bold-start);
		border-right: 1px solid var(--glass-border-bold-start);
	`,
};

export const StyledPopoverArrow = styled.span<{ $side: PopoverSide; $size: number }>`
	position: absolute;
	display: block;
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	background-color: var(--overlay-solid);
	transform: rotate(45deg);
	${({ $side }) => arrowEdges[$side]}
`;

export const StyledPopoverContent = styled.div`
	${uiBody}
	position: relative;
	overflow-y: auto;
	overscroll-behavior: contain;
`;
