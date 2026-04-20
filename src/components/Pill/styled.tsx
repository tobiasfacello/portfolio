import styled from "styled-components";
import { spacingArray } from "../../styles/mixins";

export const StyledPillTag = styled.span<{
	$hasIcon?: boolean;
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
	padding: ${(props) =>
		spacingArray(props.$p) ??
		(props.$hasIcon ? 'var(--2) var(--8) var(--2) var(--6)' : 'var(--2) var(--8)')};
	border: 1px solid var(--text);
	border-radius: var(--radius-pill);
	white-space: nowrap;
	transition: all var(--transition-normal);
`;
