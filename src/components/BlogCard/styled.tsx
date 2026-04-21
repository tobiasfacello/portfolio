import styled from 'styled-components';
import { glassCard, glassGradientBorder } from '../../styles/mixins';

export const StyledBlogCard = styled.article`
	position: relative;
	width: 100%;
	aspect-ratio: 4 / 3;
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
	flex: 1 1 auto;
	min-height: 150px;
	overflow: hidden;
	border-radius: var(--radius-md);

	& > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		filter: sepia(0.3) saturate(0.6) brightness(0.9) hue-rotate(30deg);
		transition: transform var(--transition-normal) ease-in-out,
			filter var(--transition-normal) ease-in-out;
	}

	${StyledBlogCard}:hover & > img {
		transform: scale(1.03);
		filter: sepia(0.15) saturate(0.7) brightness(0.95) hue-rotate(30deg);
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

export const StyledBlogCardReadButtonWrapper = styled.div`
	position: absolute;
	bottom: var(--8);
	right: var(--8);
	z-index: 1;
	--glass-bg: rgba(0, 0, 0, 0.45);
`;

export const StyledBlogCardStatusWrapper = styled.div`
	position: absolute;
	bottom: var(--8);
	right: var(--8);
	z-index: 1;
	display: inline-flex;
	align-items: center;
	padding: var(--4);
	border-radius: var(--radius-pill);
	background-color: color-mix(in srgb, var(--overlay-solid) 40%, transparent);
	backdrop-filter: blur(var(--blur-md));
	-webkit-backdrop-filter: blur(var(--blur-md));
	transition: padding var(--transition-normal) ease-in-out;
	${glassGradientBorder({ radius: 'var(--radius-pill)' })}

	& > span {
		gap: 0;
	}

	& > span > span {
		max-width: 0;
		margin-left: 0;
		opacity: 0;
		overflow: hidden;
		white-space: nowrap;
		transition: max-width var(--transition-normal) ease-in-out,
			margin-left var(--transition-normal) ease-in-out,
			opacity var(--transition-fast) ease-in-out;
	}

	${StyledBlogCard}:hover & {
		padding: var(--4) var(--8) var(--4) var(--6);
	}

	${StyledBlogCard}:hover & > span > span {
		max-width: 140px;
		margin-left: var(--4);
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;

		& > span > span {
			transition: none;
		}
	}
`;
