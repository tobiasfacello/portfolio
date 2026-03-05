import styled, { css } from 'styled-components';
import { glassCard } from '../../styles/mixins';
import type { BlogCardLayout } from '../../types';

const layoutDirection = (layout: BlogCardLayout) => {
	if (layout === 'vertical') return 'column';
	if (layout === 'horizontal-reverse') return 'row-reverse';
	return 'row';
};

export const StyledBlogCard = styled.article<{ $layout: BlogCardLayout }>`
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: ${(props) => layoutDirection(props.$layout)};
	gap: var(--12);
	padding: var(--12);
	${glassCard(true)}
	overflow: hidden;

	&:hover {
		transform: translateY(-2px);
	}
`;

export const StyledBlogCardContent = styled.div<{ $layout: BlogCardLayout }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: var(--8);
	${(props) =>
		props.$layout !== 'vertical' &&
		css`
			flex: 1;
			min-width: 0;
		`}
`;

export const StyledBlogCardExcerpt = styled.p`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-body-sm);
	line-height: 1.5;
	color: var(--text);
	opacity: var(--opacity-medium);
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

export const StyledBlogCardImage = styled.div<{ $layout: BlogCardLayout }>`
	flex-shrink: 0;
	overflow: hidden;
	border-radius: var(--radius-md);

	${(props) =>
		props.$layout === 'vertical'
			? css`
					width: 100%;
					aspect-ratio: 4/3;
				`
			: css`
					width: 40%;
					aspect-ratio: 3/4;
				`}

	& > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 300ms ease-in-out;
	}

	${StyledBlogCard}:hover & > img {
		transform: scale(1.03);
	}
`;
