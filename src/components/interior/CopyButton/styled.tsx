import styled from 'styled-components';

//* Shared
import { bareButton, focusRing, StyledStateStack } from '../shared/styled';
import { control, type ControlSize, type ControlTone } from '../shared/variants';

export const StyledCopyButton = styled.button<{ $size: ControlSize; $tone: ControlTone }>`
	${bareButton}
	${({ $size, $tone }) => control({ size: $size, tone: $tone })}
	${focusRing}
`;

export const StyledIconStack = styled(StyledStateStack)`
	width: var(--icon-xs);
	height: var(--icon-xs);
	flex-shrink: 0;

	svg {
		width: var(--icon-xs);
		height: var(--icon-xs);
	}
`;

/**
 * Every label the button can show is rendered at once and stacked, so the
 * control is already wide enough for "Copied" before the copy succeeds. Nothing
 * resizes underneath the cursor.
 */
export const StyledLabelStack = styled(StyledStateStack)`
	justify-items: start;

	> span {
		white-space: nowrap;
	}
`;
