import { useCallback, useEffect, useRef, useState } from 'react';

export type LightboxSlide = {
	src: string;
	alt: string;
	width?: number;
	height?: number;
};

export type UseLightboxGalleryOptions = {
	slides: LightboxSlide[];
	index: number;
	onIndexChange: (index: number) => void;
	onClose: () => void;
	/** Wrap around at the ends instead of stopping. */
	loop?: boolean;
};

/**
 * Navigation and preloading for a lightbox.
 *
 * The neighbours of the current slide are fetched as soon as it settles, so
 * stepping through a gallery does not flash an empty frame between images — by
 * the time you press the key, the next one is usually already decoded. Only the
 * immediate neighbours are warmed; preloading the whole set would cost more
 * than it saves for anyone who looks at two images and leaves.
 */
export function useLightboxGallery({
	slides,
	index,
	onIndexChange,
	onClose,
	loop = true,
}: UseLightboxGalleryOptions) {
	const total = slides.length;
	/** Which way the last move went, so the image can enter from that side. */
	const [direction, setDirection] = useState(1);
	const previous = useRef(index);

	const go = useCallback(
		(next: number) => {
			if (total === 0) return;
			const wrapped = loop
				? (next + total) % total
				: Math.max(0, Math.min(total - 1, next));
			if (wrapped === index) return;
			setDirection(wrapped > index || (loop && index === total - 1 && wrapped === 0) ? 1 : -1);
			onIndexChange(wrapped);
		},
		[index, loop, onIndexChange, total],
	);

	const next = useCallback(() => go(index + 1), [go, index]);
	const prev = useCallback(() => go(index - 1), [go, index]);

	useEffect(() => {
		previous.current = index;
	}, [index]);

	// Warm the neighbours once the current slide is showing.
	useEffect(() => {
		if (total === 0) return;
		const targets = [slides[(index + 1) % total], slides[(index - 1 + total) % total]];
		const images = targets.filter(Boolean).map((slide) => {
			const img = new Image();
			img.src = slide.src;
			return img;
		});
		return () => {
			// Dropping the references lets an in-flight fetch be abandoned if the
			// gallery closes before it lands.
			images.forEach((img) => {
				img.src = '';
			});
		};
	}, [index, slides, total]);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowRight') {
				event.preventDefault();
				next();
			} else if (event.key === 'ArrowLeft') {
				event.preventDefault();
				prev();
			} else if (event.key === 'Home') {
				event.preventDefault();
				go(0);
			} else if (event.key === 'End') {
				event.preventDefault();
				go(total - 1);
			}
		};

		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [go, next, prev, total]);

	return {
		current: slides[index],
		direction,
		total,
		next,
		prev,
		go,
		close: onClose,
		canPrev: loop || index > 0,
		canNext: loop || index < total - 1,
	};
}
