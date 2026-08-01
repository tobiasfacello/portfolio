import styled from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { insetFocusRing, uiLabel } from '../shared/styled';

export const StyledTreeRoot = styled.div`
	position: relative;
	padding: 5px;
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	${glassGradientBorder({ radius: 'var(--radius-md)' })}
`;

export const StyledTreeList = styled.ul`
	list-style: none;
`;

export const StyledTreeItem = styled.div<{ $selected: boolean }>`
	/* WCAG 2.5.8 floor — a row's own line box came up a few pixels short. */
	min-height: var(--hit-area-min);
	${uiLabel}
	display: flex;
	align-items: center;
	gap: var(--4);
	padding: 0 var(--6);
	border-radius: var(--radius-sm);
	cursor: default;
	user-select: none;
	font-size: var(--font-size-caption);
	background-color: ${({ $selected }) => ($selected ? 'var(--glass-bg-bold)' : 'transparent')};
	opacity: ${({ $selected }) => ($selected ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	transition:
		background-color var(--transition-fast) var(--ease-state),
		opacity var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
		background-color: var(--glass-bg-bold);
	}

	${insetFocusRing}
`;

export const StyledTreeCaret = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	width: var(--16);
	height: var(--16);
	flex-shrink: 0;
	opacity: var(--opacity-text-muted);
	will-change: transform;
`;

/** Keeps unbranched rows aligned with their siblings' labels. */
export const StyledTreeSpacer = styled.span`
	width: var(--16);
	height: var(--16);
	flex-shrink: 0;
`;

export const StyledTreeLabel = styled.span<{ $selected: boolean }>`
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: ${({ $selected }) =>
		$selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)'};
`;

export const StyledTreeMeta = styled.span`
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	/* Same as the accordion: the row carries the dimming, this carries the size. */
	opacity: var(--opacity-full);
`;

export const StyledTreeGroupClip = styled.ul`
	overflow: hidden;
	list-style: none;
`;

/** The guide rail that makes nesting depth readable at a glance. */
export const StyledTreeGroupInner = styled.div`
	margin-left: 13px;
	padding-left: 7px;
	border-left: 1px solid var(--glass-border-start);
`;
