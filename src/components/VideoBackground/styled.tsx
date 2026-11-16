//! Third-party
import styled, { keyframes } from 'styled-components';

const framePacer = keyframes`
	from { background-color: #000; }
	to   { background-color: #fff; }
`;

export const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	z-index: -1;
	overflow: hidden;
	pointer-events: none;

	/* Frame pacer, switched on by VideoBackground while the user interacts. When
	   the 30fps clip is the only thing updating, Chrome drops the page to 30fps,
	   and the main-thread (Lenis) scroll stays there for a while after the user
	   starts scrolling. A repaint every frame keeps it at 60fps: this 1px,
	   2%-opacity pixel is the cheapest repaint there is. The pixel always
	   exists and the attribute only un-pauses it, so waking it at scroll start
	   costs no style/layout work for a new box — just a running animation. */
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 1px;
		height: 1px;
		opacity: 0.02;
		animation: ${framePacer} 1s linear infinite paused;
	}

	&[data-pacing]::after {
		animation-play-state: running;
	}
`;

export const Poster = styled.img`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
`;

export const Video = styled.video<{ $playing: boolean }>`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
	opacity: 0;
	transition: opacity var(--transition-emphasis) var(--ease-smooth-out);

	${({ $playing }) => $playing && 'opacity: 1;'}

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
