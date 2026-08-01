import styled from 'styled-components';

//* Shared
import { uiLabel } from '../shared/styled';

export const StyledTypingRoot = styled.div<{ $size: number }>`
	display: inline-flex;
	align-items: flex-end;
	gap: var(--12);
	max-width: 100%;
	height: ${({ $size }) => $size}px;
`;

export const StyledBubbleSlot = styled.div<{ $width: number; $size: number }>`
	position: relative;
	flex-shrink: 0;
	width: ${({ $width }) => $width}px;
	height: ${({ $size }) => $size}px;
`;

export const StyledBubble = styled.div<{ $radius: number; $gap: number }>`
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${({ $gap }) => $gap}px;
	border-radius: ${({ $radius }) => $radius}px;
	background-color: var(--glass-bg-bold);
	/* Grows from the corner nearest the sender, like a speech bubble would. */
	transform-origin: 0% 100%;
	will-change: transform, opacity;
`;

export const StyledDot = styled.span<{ $size: number }>`
	display: block;
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	border-radius: var(--radius-circle);
	background-color: var(--primary);
	will-change: transform, opacity;
`;

export const StyledTypingLabelSlot = styled.span<{ $height: number }>`
	display: grid;
	flex: 1;
	min-width: 0;
	height: ${({ $height }) => $height}px;
`;

export const StyledTypingLabel = styled.span`
	${uiLabel}
	grid-area: 1 / 1;
	align-self: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	opacity: var(--opacity-text-muted);
`;
