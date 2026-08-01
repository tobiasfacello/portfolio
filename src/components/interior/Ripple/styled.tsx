import styled from 'styled-components';

//* Shared
import { bareButton, focusRing } from '../shared/styled';
import { control, type ControlSize, type ControlTone } from '../shared/variants';

export const StyledRippleButton = styled.button<{ $size: ControlSize; $tone: ControlTone }>`
	${bareButton}
	${({ $size, $tone }) => control({ size: $size, tone: $tone })}
	${focusRing}
	isolation: isolate;
`;

export const StyledRippleLayer = styled.span`
	position: absolute;
	inset: 0;
	overflow: hidden;
	border-radius: inherit;
	pointer-events: none;
`;

export const StyledRippleSpot = styled.span`
	position: absolute;
	display: block;
	border-radius: var(--radius-circle);
	background-color: var(--text);
	opacity: 0;
	will-change: transform, opacity;
`;

export const StyledRippleLabel = styled.span`
	position: relative;
`;
