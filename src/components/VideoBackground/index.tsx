//! Third-party
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

//? Hooks
import { useBreakpointValue, isDesktop } from '../../hooks/useBreakpoint';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

//* Styled
import { Backdrop, Poster, Video, Scrim } from './styled';

const POSTER_SRC = '/backgrounds/shader-bg-poster.webp';
// Full-viewport cover image: phones get the 960px variant (~30 KB) instead of
// the 1440px one (~72 KB).
const POSTER_SRCSET = '/backgrounds/shader-bg-poster-960.webp 960w, /backgrounds/shader-bg-poster.webp 1440w';
const WEBM_SRC = '/backgrounds/shader-bg.webm';
const MP4_SRC = '/backgrounds/shader-bg.mp4';

// Input that usually precedes or drives a scroll; any of it wakes the frame pacer.
const INTERACTION_EVENTS = ['pointermove', 'pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'] as const;
const PACER_IDLE_MS = 2500;

function VideoBackground() {
	const desktop = useBreakpointValue(isDesktop);
	const prefersReducedMotion = usePrefersReducedMotion();

	const allowVideo = !prefersReducedMotion && desktop;

	const [showVideo, setShowVideo] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const backdropRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!allowVideo) {
			setShowVideo(false);
			setIsPlaying(false);
			return;
		}
		const requestIdle =
			window.requestIdleCallback?.bind(window) ??
			((cb: () => void) => window.setTimeout(cb, 200));
		const cancelIdle =
			window.cancelIdleCallback?.bind(window) ?? window.clearTimeout;
		const id = requestIdle(() => setShowVideo(true));
		return () => cancelIdle(id);
	}, [allowVideo]);

	// Frame pacer (see Backdrop): only needed while the user may be scrolling, so
	// it runs from the first interaction until PACER_IDLE_MS of quiet, and the
	// page idles at the video's own 30fps the rest of the time. Toggled as a DOM
	// attribute so pointer movement never re-renders React.
	useEffect(() => {
		const backdrop = backdropRef.current;
		if (!showVideo || !backdrop) return;

		let idleTimer: ReturnType<typeof setTimeout> | undefined;
		let lastWake = 0;
		const stop = () => backdrop.removeAttribute('data-pacing');
		const wake = () => {
			const now = performance.now();
			if (now - lastWake < 250) return;
			lastWake = now;
			backdrop.setAttribute('data-pacing', '');
			clearTimeout(idleTimer);
			idleTimer = setTimeout(stop, PACER_IDLE_MS);
		};

		for (const type of INTERACTION_EVENTS) window.addEventListener(type, wake, { passive: true });
		return () => {
			clearTimeout(idleTimer);
			stop();
			for (const type of INTERACTION_EVENTS) window.removeEventListener(type, wake);
		};
	}, [showVideo]);

	useLayoutEffect(() => {
		const root = document.documentElement;
		root.classList.add('has-bg-video');
		return () => root.classList.remove('has-bg-video');
	}, []);

	return createPortal(
		<Backdrop ref={backdropRef} aria-hidden="true">
			<Poster src={POSTER_SRC} srcSet={POSTER_SRCSET} sizes="100vw" alt="" decoding="async" />
			{showVideo && (
				<Video
					$playing={isPlaying}
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					poster={POSTER_SRC}
					tabIndex={-1}
					disablePictureInPicture
					onPlaying={() => setIsPlaying(true)}
				>
					<source src={WEBM_SRC} type="video/webm" />
					<source src={MP4_SRC} type="video/mp4" />
				</Video>
			)}
			<Scrim />
		</Backdrop>,
		document.body,
	);
}

export default VideoBackground;
