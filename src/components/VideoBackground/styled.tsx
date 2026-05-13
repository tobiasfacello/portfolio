//! Third-party
import styled from 'styled-components';

export const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	z-index: -1;
	overflow: hidden;
	pointer-events: none;
`;

export const Poster = styled.img`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
`;

export const Video = styled.video`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	opacity: 0;
	transition: opacity 600ms ease;

	&[data-playing='true'] {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		display: none;
		transition: none;
	}
`;

export const Scrim = styled.div`
	position: absolute;
	inset: 0;
	background-color: rgba(10, 11, 4, 0.62);
	background-image: radial-gradient(
		ellipse at center,
		rgba(10, 11, 4, 0) 35%,
		rgba(10, 11, 4, 0.4) 100%
	);
`;
