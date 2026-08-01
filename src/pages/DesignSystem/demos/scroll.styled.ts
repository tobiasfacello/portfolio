import styled from 'styled-components';

//* Shared
import { uiBody, uiLabel, wellSurface } from '../../../components/interior/shared/styled';

export const StyledScrollArticle = styled.div`
	${wellSurface}
	max-height: 180px;
	overflow-y: auto;
	overscroll-behavior: contain;
	padding: var(--12) var(--16);
`;

export const StyledScrollParagraph = styled.p`
	${uiBody}
	opacity: var(--opacity-text-muted);
	padding: 0 var(--16);

	& + & {
		margin-top: var(--12);
	}

	${StyledScrollArticle} & {
		padding: 0;
	}
`;

export const StyledBarTitle = styled.span`
	${uiLabel}
	flex: 1;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
