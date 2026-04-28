import styled from 'styled-components';
import { popInAnimation } from '../shared/digitPop';

export const StyledTweetList = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--6);
	width: 100%;
	/* ~3 visible items at default sizing — anything beyond scrolls without
	   pushing the widget taller. */
	max-height: 160px;
	min-height: 0;
	overflow-y: auto;
	overscroll-behavior: contain;
	scrollbar-width: thin;
	scrollbar-color: var(--glass-border-start) transparent;

	&::-webkit-scrollbar {
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--glass-border-start);
		border-radius: var(--radius-pill);
	}
`;

export const StyledTweetText = styled.p`
	font-family: var(--font-geist-pixel-circle);
	font-size: 0.75rem;
	line-height: 1.4;
	color: var(--text);
	opacity: var(--opacity-medium);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;
	transition: opacity var(--transition-fast);
`;

export const StyledTweetStat = styled.span`
	display: inline-flex;
	align-items: center;
	gap: var(--4);
	font-family: var(--font-geist-pixel-circle);
	font-size: 0.625rem;
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-muted);
	transition: opacity var(--transition-fast);

	svg {
		width: 10px;
		height: 10px;
		flex-shrink: 0;
	}
`;

export const StyledTweetThumbnail = styled.div`
	width: 32px;
	height: 32px;
	border-radius: var(--radius-sm);
	background-color: var(--glass-bg-bold);
	flex-shrink: 0;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

export const StyledTweetContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--2);
	min-width: 0;
`;

export const StyledTweetItem = styled.a`
	display: flex;
	flex-direction: row;
	gap: var(--8);
	padding: var(--6);
	border-radius: var(--radius-sm);
	text-decoration: none;
	color: inherit;
	will-change: transform, opacity, filter;
	${popInAnimation}
	transition:
		background-color var(--transition-fast),
		transform var(--transition-fast);

	&:hover {
		background-color: var(--glass-bg-bold);
		transform: translateX(2px);

		${StyledTweetText},
		${StyledTweetStat} {
			opacity: 1;
		}
	}
`;

export const StyledFooterLabel = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-soft);
`;

export const StyledFooterMeta = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-muted);
	text-align: right;
`;

export const StyledTweetMeta = styled.div`
	display: flex;
	align-items: center;
	gap: var(--8);
`;

