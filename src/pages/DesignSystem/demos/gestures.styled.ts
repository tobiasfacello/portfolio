import styled from 'styled-components';

//* Shared
import { bareButton, uiBody, uiLabel, wellSurface } from '../../../components/interior/shared/styled';

export const StyledSlide = styled.div`
	${wellSurface}
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: var(--8);
	height: 140px;
	padding: var(--24);
`;

export const StyledCardTitle = styled.span`
	${uiLabel}
	font-size: var(--font-size-body);
`;

export const StyledCardBody = styled.span`
	text-wrap: pretty;
	${uiBody}
	font-size: var(--font-size-body-sm);
	opacity: var(--opacity-text-muted);
`;

export const StyledThumbRow = styled.div`
	display: flex;
	gap: var(--8);
`;

export const StyledThumb = styled.button`
	${bareButton}
	width: 72px;
	height: 48px;
	overflow: hidden;
	border-radius: var(--radius-sm);
	border: 1px solid var(--glass-border-bold-start);
	opacity: var(--opacity-text-muted);
	transition: opacity var(--transition-fast) var(--ease-state);

	&:hover {
		opacity: var(--opacity-full);
	}

	&:focus-visible {
		outline: 2px solid var(--focus-ring);
		outline-offset: 2px;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
`;
