import styled from "styled-components";
import { spacingArray } from "../../styles/mixins";

export const StyledPillTag = styled.span<{
	$m?: string[];
	$p?: string[];
}>`
	width: fit-content;
	height: 22px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: var(--4);
	margin: ${(props) => spacingArray(props.$m)};
	padding: ${(props) => spacingArray(props.$p) ?? 'var(--2) var(--8)'};
	border: 1px solid var(--text);
	border-radius: var(--radius-pill);
	white-space: nowrap;
	/* hoveredPillStyles only touches these four; "all" let anything else ride along. */
	transition:
		color var(--transition-normal) var(--ease-state),
		background-color var(--transition-normal) var(--ease-state),
		border-color var(--transition-normal) var(--ease-state),
		opacity var(--transition-normal) var(--ease-state);
`;
