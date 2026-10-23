import styled from 'styled-components';
import { popInAnimation } from '../shared/digitPop';
import { widgetText, iconWrapper } from '../../../styles/mixins';

export const StyledPinnedCard = styled.a`
	display: flex;
	flex-direction: column;
	flex: 1;
	justify-content: space-between;
	gap: var(--12);
	padding: var(--12);
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
	${widgetText('0.9375rem', 'var(--opacity-full)')}
	display: inline-flex;
	align-items: center;
	gap: var(--4);
	line-height: 1.2;
	font-weight: 600;
	min-width: 0;

	span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

export const StyledVerifiedBadge = styled.span`
	${iconWrapper('15px')}
	color: var(--accent, var(--text));

	svg {
		display: block;
	}
`;

export const StyledAuthorMeta = styled.span`
	${widgetText('var(--font-size-label)', 'var(--opacity-muted)')}
	line-height: 1.3;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StyledTweetBody = styled.p`
	${widgetText('0.9375rem', 'var(--opacity-medium)')}
	line-height: 1.5;
	margin: 0;
	white-space: pre-line;
	word-wrap: break-word;
	overflow-wrap: anywhere;
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
	transition: opacity var(--transition-fast);

	${StyledPinnedCard}:hover & {
		opacity: var(--opacity-full);
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
	${widgetText('var(--font-size-label)', 'var(--opacity-muted)')}
	display: inline-flex;
	align-items: center;
	gap: var(--6);
	transition: opacity var(--transition-fast);

	svg {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	${StyledPinnedCard}:hover & {
		opacity: var(--opacity-medium);
	}
`;

export const StyledFooterLabel = styled.span`
	${widgetText('var(--font-size-label)', 'var(--opacity-soft)')}
`;

export const StyledFooterMeta = styled.span`
	${widgetText('var(--font-size-label)', 'var(--opacity-muted)')}
	text-align: right;
`;
