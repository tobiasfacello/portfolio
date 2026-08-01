import { useLayoutEffect, useRef, useState } from 'react';

export type BlurUpStatus = 'loading' | 'ready' | 'error';

export type UseBlurUpImageOptions = {
	src?: string;
	srcSet?: string;
	onReady?: () => void;
	onError?: () => void;
};

/**
 * Tracks an image from request to painted.
 *
 * Two things make this more than an `onLoad` handler. An image already in cache
 * is reported as `instant`, so it appears without a develop animation — nothing
 * moves unless something happened, and a cached image did not load. And where
 * available, `decode()` is awaited before revealing, so the fade cannot start
 * on a frame where the browser has not finished decoding and would stutter.
 */
export function useBlurUpImage({ src, srcSet, onReady, onError }: UseBlurUpImageOptions) {
	const ref = useRef<HTMLImageElement>(null);
	const [state, setState] = useState<{ status: BlurUpStatus; instant: boolean }>({
		status: 'loading',
		instant: false,
	});

	const ready = useRef(onReady);
	ready.current = onReady;
	const failed = useRef(onError);
	failed.current = onError;

	useLayoutEffect(() => {
		const img = ref.current;

		const set = (status: BlurUpStatus, instant: boolean) =>
			setState((prev) =>
				prev.status === status && prev.instant === instant ? prev : { status, instant },
			);

		if (!img || !src) {
			set('loading', false);
			return;
		}

		let alive = true;

		// `complete` is also true for a failed image, so the natural size is what
		// actually distinguishes a cache hit from an error.
		const cached = img.complete && img.naturalWidth > 0;

		const reveal = () => {
			if (!alive) return;
			set('ready', cached);
			ready.current?.();
		};

		const fail = () => {
			if (!alive) return;
			set('error', cached);
			failed.current?.();
		};

		if (img.complete) {
			if (cached) reveal();
			else fail();
			return () => {
				alive = false;
			};
		}

		set('loading', false);

		const onLoad = () => {
			if (!alive) return;
			if (typeof img.decode === 'function') {
				img.decode().then(reveal, fail);
				return;
			}
			reveal();
		};

		img.addEventListener('load', onLoad);
		img.addEventListener('error', fail);

		return () => {
			alive = false;
			img.removeEventListener('load', onLoad);
			img.removeEventListener('error', fail);
		};
	}, [src, srcSet]);

	return {
		ref,
		status: state.status,
		instant: state.instant,
		loaded: state.status === 'ready',
	};
}
