import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, StyledStateStack } from '../shared/styled';
import { control, type ControlSize, type ControlTone } from '../shared/variants';

export const StyledMorphButton = styled.button<{ $showLabel: boolean; $size: ControlSize; $tone: ControlTone }>`
	${bareButton}
	/* Without a label the box squares off at the size's own height, rather than
	   jumping to a fixed 48px that no other control in the system uses. */
	${({ $size, $tone, $showLabel }) => control({ size: $size, tone: $tone, iconOnly: !$showLabel })}
	${focusRing}
	flex-shrink: 0;
`;

export const StyledMorphIcon = styled.span<{ $size: number }>`
	display: grid;
	place-items: center;
	flex-shrink: 0;
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	will-change: transform;

	svg {
		display: block;
	}
`;

export const StyledMorphLabels = styled(StyledStateStack)`
	justify-items: start;

	> span {
		white-space: nowrap;
	}
`;
