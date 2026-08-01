import styled, { keyframes } from 'styled-components';

//? Types
import type { TaskStepStatus } from './useTaskSteps';

//* Shared
import { uiLabel } from '../shared/styled';

export const StyledStepList = styled.ol`
	width: 100%;
	list-style: none;
`;

export const StyledStepRow = styled.li`
	display: flex;
	align-items: center;
	gap: var(--8);
	height: var(--32);
	padding: 0 var(--4);
`;

export const StyledStepMarker = styled.span`
	position: relative;
	display: grid;
	place-items: center;
	width: var(--16);
	height: var(--16);
	flex-shrink: 0;

	> * {
		grid-area: 1 / 1;
	}
`;

export const StyledStepBadge = styled.span<{ $tone: 'success' | 'danger' }>`
	display: grid;
	place-items: center;
	width: var(--16);
	height: var(--16);
	border-radius: var(--radius-sm);
	background-color: ${({ $tone }) => `var(--${$tone}-tint)`};
	color: ${({ $tone }) => `var(--${$tone})`};
`;

export const StyledStepDot = styled.span`
	width: 5px;
	height: 5px;
	border-radius: 2px;
	background-color: var(--text);
	opacity: var(--opacity-subtle);
`;

export const StyledStepSpinner = styled.svg`
	width: var(--12);
	height: var(--12);
	color: var(--text);
	opacity: var(--opacity-text-muted);
`;

const sweep = keyframes`
	from { background-position: 120% 0; }
	to   { background-position: -120% 0; }
`;

const toneFor: Record<TaskStepStatus, string> = {
	done: 'var(--opacity-text-muted)',
	active: 'var(--opacity-full)',
	error: 'var(--opacity-full)',
	pending: 'var(--opacity-text-muted)',
};

export const StyledStepLabel = styled.span<{ $status: TaskStepStatus }>`
	${uiLabel}
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	opacity: ${({ $status }) => toneFor[$status]};
	color: ${({ $status }) => ($status === 'error' ? 'var(--danger)' : 'var(--text)')};
	transition:
		opacity var(--transition-base) var(--ease-state),
		color var(--transition-base) var(--ease-state);
`;

/**
 * A highlight travelling through the active label. It marks the one step that
 * is actually working, without adding another spinner to the row.
 */
export const StyledStepShimmer = styled(StyledStepLabel)`
	background-image: linear-gradient(
		90deg,
		var(--primary) 38%,
		var(--text) 50%,
		var(--primary) 62%
	);
	background-size: 220% 100%;
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;
	animation: ${sweep} var(--transition-shimmer) linear infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
		background-image: none;
		color: var(--text);
	}
`;

export const StyledStepMeta = styled.span<{ $visible: boolean }>`
	${uiLabel}
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: ${({ $visible }) => ($visible ? 'var(--opacity-text-muted)' : '0')};
	transition: opacity var(--transition-base) var(--ease-state);
`;
