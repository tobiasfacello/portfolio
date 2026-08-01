import styled from 'styled-components';

//* Shared
import { StyledStateStack, uiLabel } from '../shared/styled';

export const StyledFieldRoot = styled.div`
	width: 100%;
`;

/** Top padding reserves the space the label rises into. */
export const StyledFieldShell = styled.div`
	position: relative;
	padding-top: var(--20);
`;

export const StyledFieldBox = styled.div<{
	$focused: boolean;
	$invalid: boolean;
	$disabled: boolean;
}>`
	position: relative;
	height: 40px;
	border-radius: var(--radius-md);
	border: 2px solid
		${({ $invalid, $focused }) =>
			$invalid ? 'var(--danger)' : $focused ? 'var(--accent)' : 'var(--glass-border-bold-start)'};
	background-color: var(--glass-bg-bold);
	opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
	transition:
		border-color var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state);
`;

export const StyledFieldInput = styled.input`
	${uiLabel}
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	padding: 0 var(--12);
	border: none;
	border-radius: var(--radius-sm);
	background: transparent;
	font-size: var(--font-size-body-sm);
	line-height: 20px;
	outline: none;

	&:disabled {
		cursor: not-allowed;
	}
`;

export const StyledFieldLabel = styled.label<{ $raised: boolean; $invalid: boolean }>`
	${uiLabel}
	position: absolute;
	left: var(--12);
	top: 32px;
	display: block;
	font-size: var(--font-size-body-sm);
	line-height: 16px;
	cursor: text;
	user-select: none;
	/* Scaling from the top-left keeps the label's left edge pinned as it shrinks. */
	transform-origin: 0 0;
	will-change: transform;
	color: ${({ $invalid }) => ($invalid ? 'var(--danger)' : 'var(--text)')};
	opacity: ${({ $raised }) => ($raised ? 'var(--opacity-text-muted)' : 'var(--opacity-text-muted)')};
	transition:
		color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state);
`;

export const StyledFieldFooter = styled.div`
	display: flex;
	align-items: flex-start;
	gap: var(--12);
	height: 16px;
	margin-top: var(--6);
`;

export const StyledFieldHint = styled.p<{ $invalid: boolean }>`
	${uiLabel}
	flex: 1;
	min-width: 0;
	font-size: var(--font-size-caption);
	line-height: 16px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: ${({ $invalid }) => ($invalid ? 'var(--danger)' : 'var(--text)')};
	opacity: var(--opacity-text-muted);
`;

/**
 * The counter reserves the width of its longest possible reading, so counting
 * up from 9 to 10 characters cannot shift the hint beside it.
 */
export const StyledFieldCounter = styled(StyledStateStack)`
	${uiLabel}
	justify-items: end;
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	line-height: 16px;
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);

	> span[data-ghost] {
		visibility: hidden;
	}
`;
