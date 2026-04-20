import styled from 'styled-components';
import { glassCard, glassGradientBorder } from '../../styles/mixins';

export const StyledBlogCard = styled.article`
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: var(--8);
	${glassCard(true)}
	overflow: hidden;

	&:hover {
		transform: translateY(-2px);
	}
`;

export const StyledBlogCardContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: var(--4);
	padding-bottom: var(--8);

	& > h3 {
		opacity: 1;
	}
`;

export const StyledBlogCardExcerpt = styled.p`
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-label);
	line-height: 1.4;
	color: var(--text);
	opacity: var(--opacity-medium);
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`;

export const StyledBlogCardImageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 150px;
	flex-shrink: 0;
	overflow: hidden;
	border-radius: var(--radius-md);

	& > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		transition: transform var(--transition-normal) ease-in-out;
	}

	${StyledBlogCard}:hover & > img {
		transform: scale(1.03);
	}
`;

export const StyledBlogCardTags = styled.div`
	position: absolute;
	bottom: var(--8);
	left: var(--8);
	display: flex;
	gap: var(--4);
	z-index: 1;
`;

export const StyledBlogTag = styled.span`
	position: relative;
	display: inline-flex;
	align-items: center;
	height: 20px;
	padding: 0 var(--8);
	font-family: var(--font-geist-pixel-circle);
	font-size: var(--font-size-caption);
	line-height: 1;
	color: var(--text);
	background-color: color-mix(in srgb, var(--overlay-solid) 40%, transparent);
	backdrop-filter: blur(var(--blur-md));
	-webkit-backdrop-filter: blur(var(--blur-md));
	border-radius: var(--radius-pill);
	white-space: nowrap;
	${glassGradientBorder({ radius: 'var(--radius-pill)' })}
`;
