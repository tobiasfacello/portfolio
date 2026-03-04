import styled, { css } from 'styled-components';
import { mq } from '../../config/breakpoints';

export const StyledLightboxOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: var(--z-overlay);
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--lightbox-overlay);
	opacity: 0;
	visibility: hidden;
`;

export const StyledLightboxImageContainer = styled.div`
	position: relative;
	max-width: 90vw;
	max-height: 85vh;
	display: flex;
	align-items: center;
	justify-content: center;

	& > img {
		max-width: 90vw;
		max-height: 85vh;
		object-fit: contain;
		border-radius: var(--radius-sm);
	}
`;

const lightboxButton = css`
	z-index: var(--z-overlay-content);
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	border: 1px solid var(--lightbox-btn-border);
	background: var(--lightbox-btn-bg);
	color: var(--lightbox-btn-color);
	transition: background var(--transition-base);
	backdrop-filter: blur(8px);

	&:hover {
		background: var(--lightbox-btn-hover-bg);
	}

	&:focus-visible {
		outline: 2px solid var(--lightbox-btn-focus);
		outline-offset: 2px;
	}
`;

export const StyledCloseButton = styled.button`
	position: fixed;
	top: 20px;
	right: 20px;
	${lightboxButton}
`;

export const StyledNavButton = styled.button<{ $direction: 'prev' | 'next' }>`
	position: fixed;
	top: 50%;
	transform: translateY(-50%);
	${({ $direction }) => ($direction === 'prev' ? 'left: 16px;' : 'right: 16px;')}
	${lightboxButton}

	${mq.up('mobile-lg')} {
		width: 48px;
		height: 48px;
		${({ $direction }) => ($direction === 'prev' ? 'left: 24px;' : 'right: 24px;')}
	}
`;

export const StyledLightboxCounter = styled.span`
	position: fixed;
	bottom: 24px;
	left: 50%;
	transform: translateX(-50%);
	z-index: var(--z-overlay-content);
	font-family: var(--font-geist-pixel-circle);
	font-size: 13px;
	color: var(--lightbox-counter-color);
`;
