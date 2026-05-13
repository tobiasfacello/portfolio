//! Third-party
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

//? Hooks
import { useTheme } from '../../hooks/useTheme';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

//* Styled
import { Backdrop, Poster, Video, Scrim } from './styled';

const POSTER_SRC = '/backgrounds/shader-bg-poster.jpg';
const WEBM_SRC = '/backgrounds/shader-bg.webm';
const MP4_SRC = '/backgrounds/shader-bg.mp4';

function VideoBackground() {
	const { isDarkMode } = useTheme();
	const breakpoint = useBreakpoint();
	const prefersReducedMotion = usePrefersReducedMotion();

	const allowVideo =
		isDarkMode && !prefersReducedMotion && breakpoint.startsWith('desktop-');

	const [showVideo, setShowVideo] = useState(false);
	// isPlaying drives a one-time fade-in of <video> over the poster; there is
	// intentionally no reset path (no onPause/onWaiting) — once faded in, the
	// video should stay visible even if the browser pauses autoplay (e.g. tab hidden).
	const [isPlaying, setIsPlaying] = useState(false);

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

	// Light theme: render nothing — the video/poster backdrop is dark-theme-only.
	// Dark theme: always render <Backdrop> (poster + scrim); <video> is gated by
	// allowVideo, so on tablet/mobile or prefers-reduced-motion the poster is the
	// intended fallback.
	if (!isDarkMode) return null;

	return createPortal(
		<Backdrop aria-hidden="true">
			<Poster src={POSTER_SRC} alt="" decoding="async" />
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
