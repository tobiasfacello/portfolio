import styled from 'styled-components';

//? Types
import type { LoadMoreStatus } from './useLoadMore';

//* Shared
import { bareButton, focusRing, pressable, StyledStateStack } from '../shared/styled';
import { control, type ControlSize, type ControlTone } from '../shared/variants';

export const StyledLoadMoreRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--8);
	width: 100%;
	padding: var(--12) 0;
`;

/** Zero-height probe that triggers the automatic load. */
export const StyledLoadMoreSentinel = styled.div`
	width: 100%;
	height: 1px;
`;

export const StyledLoadMoreButton = styled.button<{ $status: LoadMoreStatus; $size: ControlSize; $tone: ControlTone }>`
	${bareButton}
	${pressable}
	${({ $size, $tone }) => control({ size: $size, tone: $tone })}
	${focusRing}
	border-color: ${({ $status }) => ($status === 'error' ? 'var(--danger)' : 'var(--text)')};
	color: ${({ $status }) => ($status === 'error' ? 'var(--danger)' : 'var(--text)')};

	&[aria-disabled='true'] {
		opacity: var(--opacity-text-muted);
		cursor: default;
	}
`;

/** Every state occupies one cell, so the row never changes height or width. */
export const StyledLoadMoreFaces = styled(StyledStateStack)`
	place-items: center;
`;

export const StyledLoadMoreFace = styled.span`
	display: flex;
	align-items: center;
	gap: var(--6);
	white-space: nowrap;

	svg {
		flex-shrink: 0;
	}
`;

export const StyledLoadMoreSpinner = styled.svg`
	flex-shrink: 0;
	transform-origin: center;
`;
