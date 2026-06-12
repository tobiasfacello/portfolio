import styled from 'styled-components';
import { popInAnimation } from '../shared/digitPop';

export const StyledPinnedCard = styled.a`
	display: flex;
	flex-direction: column;
	gap: var(--12);
	padding: var(--8);
	border-radius: var(--radius-md);
	text-decoration: none;
	color: inherit;
	${popInAnimation}
	transition:
		background-color var(--transition-fast),
		transform var(--transition-fast);

	&:hover {
		background-color: var(--glass-bg-bold);
		transform: translateY(-1px);
	}
`;

export const StyledAuthorRow = styled.div`
	display: flex;
	align-items: center;
	gap: var(--8);
	width: 100%;
	min-width: 0;
`;

export const StyledAvatar = styled.div`
	width: 40px;
	height: 40px;
	border-radius: var(--radius-circle);
	background-color: var(--glass-bg-bold);
	flex-shrink: 0;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

export const StyledAuthorInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--2);
	min-width: 0;
	flex: 1;
`;

export const StyledAuthorName = styled.span`
	display: inline-flex;
	align-items: center;
	gap: var(--4);
	font-family: var(--font-geist-pixel-circle);
	font-size: 0.8125rem;
	line-height: 1.2;
	color: var(--text);
	opacity: var(--opacity-full);
	font-weight: 600;
	min-width: 0;

	span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

export const StyledVerifiedBadge = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 14px;
	height: 14px;
	color: var(--accent, var(--text));
	opacity: var(--opacity-medium);

	svg {
		width: 100%;
		height: 100%;
	}
`;

export const StyledAuthorMeta = styled.span`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-caption);
	line-height: 1.2;
	color: var(--text);
	opacity: var(--opacity-muted);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledTweetBody = styled.p`
	font-family: var(--font-geist-pixel-circle);
	font-size: 0.8125rem;
	line-height: 1.45;
	color: var(--text);
	opacity: var(--opacity-medium);
	margin: 0;
	white-space: pre-line;
	word-wrap: break-word;
	overflow-wrap: anywhere;
	display: -webkit-box;
	-webkit-line-clamp: 5;
	-webkit-box-orient: vertical;
	overflow: hidden;
	transition: opacity var(--transition-fast);

	${StyledPinnedCard}:hover & {
		opacity: var(--opacity-full);
	}
`;

export const StyledMediaGrid = styled.div<{ $count: number }>`
	display: grid;
	grid-template-columns: ${({ $count }) => ($count > 1 ? '1fr 1fr' : '1fr')};
	gap: var(--4);
	width: 100%;
	border-radius: var(--radius-sm);
	overflow: hidden;
`;

export const StyledMediaItem = styled.div<{ $isSingle: boolean }>`
	position: relative;
	width: 100%;
	aspect-ratio: ${({ $isSingle }) => ($isSingle ? '16 / 9' : '1 / 1')};
	background-color: var(--glass-bg-bold);
	overflow: hidden;

	img,
	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
`;

export const StyledStatsRow = styled.div`
	display: flex;
	align-items: center;
	gap: var(--16);
	flex-wrap: wrap;
	row-gap: var(--6);
`;

export const StyledStat = styled.span`
	display: inline-flex;
	align-items: center;
	gap: var(--4);
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-caption);
	line-height: 1;
	color: var(--text);
	opacity: var(--opacity-muted);
	transition: opacity var(--transition-fast);

	svg {
		width: 12px;
		height: 12px;
		flex-shrink: 0;
	}

	${StyledPinnedCard}:hover & {
		opacity: var(--opacity-medium);
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
