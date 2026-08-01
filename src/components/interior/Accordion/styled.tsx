import styled from 'styled-components';

//* Mixins
import { glassGradientBorder } from '../../../styles/mixins';

//* Shared
import { bareButton, insetFocusRing, pressableRow, uiBody, uiLabel } from '../shared/styled';

export const StyledAccordion = styled.div`
	position: relative;
	width: 100%;
	overflow: hidden;
	background-color: var(--glass-bg);
	background-clip: padding-box;
	border-radius: var(--radius-md);
	${glassGradientBorder({ radius: 'var(--radius-md)' })}
`;

export const StyledAccordionRow = styled.div`
	& + & {
		border-top: 1px solid var(--glass-border-start);
	}
`;

export const StyledAccordionHeader = styled.button<{ $open: boolean }>`
	${bareButton}
	${pressableRow}
	${uiLabel}
	display: flex;
	align-items: center;
	gap: var(--12);
	width: 100%;
	padding: var(--8) var(--12);
	text-align: left;
	opacity: ${({ $open }) => ($open ? 'var(--opacity-full)' : 'var(--opacity-text-muted)')};
	transition:
		opacity var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
		background-color: var(--glass-bg-bold);
	}

	${insetFocusRing}
`;

export const StyledAccordionTitle = styled.span`
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledAccordionMeta = styled.span`
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	/* The row already dims when closed; dimming again multiplied the two and
	   dropped this to 3:1. The smaller size is what makes it secondary. */
	opacity: var(--opacity-full);
`;

export const StyledChevron = styled.svg`
	flex-shrink: 0;
	color: var(--text);
	opacity: var(--opacity-text-muted);
	will-change: transform;
`;

/** The clipping box whose height is animated. Never animated to `auto`. */
export const StyledAccordionClip = styled.div`
	overflow: hidden;
`;

export const StyledAccordionPanel = styled.div<{ $maxHeight: number }>`
	border-top: 1px solid var(--glass-border-start);
	background-color: var(--glass-bg-bold);
	max-height: ${({ $maxHeight }) => $maxHeight}px;
	overflow-y: auto;
	overscroll-behavior: contain;
	/* Reserve the scrollbar so content does not shift when it appears. */
	scrollbar-gutter: stable;
`;

export const StyledAccordionContent = styled.div`
	${uiBody}
	padding: var(--8) var(--12) var(--12);
	opacity: var(--opacity-text-muted);
`;
