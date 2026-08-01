import styled from 'styled-components';

//* Shared
import { bareButton, hitArea, pressable, uiLabel } from '../shared/styled';

export const StyledTagRoot = styled.div`
	width: 100%;
`;

export const StyledTagLabel = styled.label`
	${uiLabel}
	display: block;
	margin-bottom: var(--6);
	font-size: var(--font-size-caption);
`;

export const StyledTagField = styled.ul`
	position: relative;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--6);
	min-height: 40px;
	max-height: 116px;
	padding: var(--4);
	overflow-y: auto;
	overscroll-behavior: contain;
	list-style: none;
	border-radius: var(--radius-md);
	border: 2px solid var(--glass-border-bold-start);
	background-color: var(--glass-bg-bold);
	transition:
		border-color var(--transition-fast) var(--ease-state),
		background-color var(--transition-fast) var(--ease-state);

	&:focus-within {
		border-color: var(--accent);
	}
`;

export const StyledTagChip = styled.li<{ $lit: boolean }>`
	${uiLabel}
	display: flex;
	align-items: center;
	gap: var(--4);
	height: var(--24);
	max-width: 100%;
	flex-shrink: 0;
	padding: 0 var(--6) 0 var(--8);
	border-radius: var(--radius-sm);
	font-size: var(--font-size-caption);
	user-select: none;
	/* Lit covers both "armed for deletion" and "this is the duplicate". */
	border: 1px solid ${({ $lit }) => ($lit ? 'var(--accent)' : 'var(--glass-border-bold-start)')};
	background-color: ${({ $lit }) => ($lit ? 'var(--accent)' : 'var(--overlay-solid)')};
	color: ${({ $lit }) => ($lit ? 'var(--pill-text-hovered)' : 'var(--text)')};
	transition:
		background-color var(--transition-fast) var(--ease-state),
		border-color var(--transition-fast) var(--ease-state),
		color var(--transition-fast) var(--ease-state);
	will-change: transform, opacity;
`;

export const StyledTagChipLabel = styled.span`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledTagRemove = styled.button`
	${bareButton}
	/* Hit area: the chip is 24px tall and its neighbour is one gap away — anything larger collides. */
	${hitArea('var(--hit-area-min)')}
	${pressable}
	display: grid;
	place-items: center;
	width: 14px;
	height: 14px;
	flex-shrink: 0;
	border-radius: 5px;
	color: inherit;
	opacity: var(--opacity-text-muted);
	transition: opacity var(--transition-fast) var(--ease-state),
		scale var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}
`;

export const StyledTagDraft = styled.li`
	position: relative;
	display: flex;
	height: var(--24);
	flex: 1;
`;

/** Sizes the draft slot to its content so the caret sits where you expect. */
export const StyledTagGhost = styled.span`
	${uiLabel}
	visibility: hidden;
	pointer-events: none;
	max-width: 224px;
	overflow: hidden;
	white-space: pre;
	padding: 0 var(--4);
	font-size: var(--font-size-caption);
`;

export const StyledTagInput = styled.input`
	${uiLabel}
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	padding: 0 var(--4);
	border: none;
	background: transparent;
	outline: none;
	font-size: var(--font-size-caption);

	&::placeholder {
		color: var(--text);
		opacity: var(--opacity-text-muted);
	}
`;

export const StyledTagFooter = styled.div`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: var(--12);
	margin-top: var(--6);
`;

/** Hint and rejection share one row, so a refusal never grows the field. */
export const StyledTagMessages = styled.div`
	display: grid;
	flex: 1;
	min-width: 0;
`;

export const StyledTagMessage = styled.p<{ $tone: 'hint' | 'refusal' }>`
	${uiLabel}
	grid-area: 1 / 1;
	font-size: var(--font-size-caption);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	opacity: ${({ $tone }) => ($tone === 'hint' ? 'var(--opacity-text-muted)' : 'var(--opacity-full)')};
`;

export const StyledTagCount = styled.p`
	${uiLabel}
	flex-shrink: 0;
	font-size: var(--font-size-caption);
	font-variant-numeric: tabular-nums;
	opacity: var(--opacity-text-muted);
`;
