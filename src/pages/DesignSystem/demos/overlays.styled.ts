import styled from 'styled-components';

//* Shared
import { uiLabel, wellSurface } from '../../../components/interior/shared/styled';

/** A surface with enough area to actually aim a right-click at. */
export const StyledContextSurface = styled.div`
	${wellSurface}
	${uiLabel}
	display: grid;
	place-items: center;
	width: 260px;
	height: 96px;
	text-align: center;
	padding: var(--16);
	opacity: var(--opacity-text-muted);
	font-size: var(--font-size-caption);
`;
