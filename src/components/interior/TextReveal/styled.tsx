import styled from 'styled-components';

export const StyledRevealRoot = styled.span`
	color: var(--text);
`;

/** Keeps a word intact so a character split never breaks mid-word on wrap. */
export const StyledRevealGroup = styled.span`
	display: inline-block;
	white-space: nowrap;
	vertical-align: baseline;
`;

export const StyledRevealUnit = styled.span`
	display: inline-block;
	vertical-align: baseline;
	opacity: 0;
	will-change: transform, opacity, filter;
`;
