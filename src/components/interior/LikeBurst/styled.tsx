import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, pressable, StyledStateStack } from '../shared/styled';
import { control, type ControlSize, type ControlTone } from '../shared/variants';

export const StyledLikeRoot = styled.span`
	display: inline-flex;
	align-items: center;
`;

export const StyledLikeButton = styled.button<{ $size: ControlSize; $tone: ControlTone }>`
	${bareButton}
	${pressable}
	${({ $size, $tone }) => control({ size: $size, tone: $tone })}
	${focusRing}
`;

export const StyledHeartSlot = styled.span`
	position: relative;
	display: block;
	width: 18px;
	height: 18px;
	flex-shrink: 0;
`;

export const StyledHeart = styled.svg`
	position: absolute;
	inset: 0;
	width: 18px;
	height: 18px;
`;

/** Zero-size anchor at the heart's centre; sparks are positioned from it. */
export const StyledSparkOrigin = styled.span`
	position: absolute;
	left: 50%;
	top: 50%;
	display: block;
	width: 0;
	height: 0;
	pointer-events: none;
`;

export const StyledSpark = styled.span<{ $size: number }>`
	position: absolute;
	display: block;
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	margin-left: ${({ $size }) => -$size / 2}px;
	margin-top: ${({ $size }) => -$size / 2}px;
	border-radius: 1.5px;
	background-color: var(--accent);
	opacity: 0;
	will-change: transform, opacity;
`;

export const StyledLikeLabels = styled(StyledStateStack)`
	justify-items: start;

	> span {
		white-space: nowrap;
	}
`;

/**
 * Reserves the width of the larger of the two possible counts, so crossing
 * 999 → 1,000 does not widen the button under the cursor.
 */
export const StyledLikeCount = styled(StyledStateStack)`
	overflow: hidden;
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);

	> span[data-ghost] {
		visibility: hidden;
	}

	> span:not([data-ghost]) {
		justify-self: end;
	}
`;
