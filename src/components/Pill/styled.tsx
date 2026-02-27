import styled from "styled-components";
import { spacingArray } from "../../styles/mixins";

export const StyledPillTag = styled.span<{
	$isHovered?: boolean;
	$maxW?: string;
	$m?: string[];
	$p?: string[];
}>`
	width: fit-content;
	max-width: ${(props) => props.$maxW ?? "130px"};
	height: 22px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: var(--4);
	margin: ${(props) => spacingArray(props.$m)};
	padding: ${(props) => spacingArray(props.$p)};
	border: 1px solid var(--text);
	border-radius: var(--radius-pill);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	transition: all var(--transition-normal);
`;
