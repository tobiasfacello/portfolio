import styled from 'styled-components';

//? Types
import type { AsyncActionStatus } from './useAsyncAction';

//* Shared
import { bareButton, focusRing, StyledStateStack } from '../shared/styled';
import { control, type ControlSize, type ControlTone } from '../shared/variants';

const toneFor: Record<AsyncActionStatus, string> = {
	idle: 'inherit',
	pending: 'inherit',
	success: 'var(--success)',
	error: 'var(--danger)',
};

export const StyledLoadingButton = styled.button<{ $size: ControlSize; $tone: ControlTone }>`
	${bareButton}
	${({ $size, $tone }) => control({ size: $size, tone: $tone })}
	${focusRing}

	&[aria-busy='true'] {
		cursor: progress;
	}
`;

/**
 * All four faces are stacked in one cell, so the button is already as wide as
 * its longest state. "Done" replacing "Save" never resizes the control.
 */
export const StyledFaceStack = styled(StyledStateStack)`
	place-items: center;
`;

export const StyledFace = styled.span<{ $status: AsyncActionStatus }>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--6);
	white-space: nowrap;
	color: ${({ $status }) => toneFor[$status]};

	svg {
		flex-shrink: 0;
	}
`;

export const StyledSpinner = styled.svg`
	flex-shrink: 0;
	transform-origin: center;
`;
