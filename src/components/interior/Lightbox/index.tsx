//! React
import { useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { usePresence } from '../../../hooks/usePresence';
import { useDialog } from '../shared/useDialog';
import { useLightboxGallery, type LightboxSlide } from './useLightboxGallery';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT } from '../../../lib/motion';

//* Styled
import {
	StyledLightboxOverlay,
	StyledLightboxBackdrop,
	StyledLightboxFrame,
	StyledLightboxImage,
	StyledLightboxButton,
	StyledLightboxCounter,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

/**
 * A standalone, controlled gallery viewer.
 *
 * Complements the app-level `Lightbox`, which is driven by `LightboxContext`
 * and mounted once at the root. Use this one where the gallery is local to a
 * component and its open state already lives there.
 */

export type LightboxProps = {
	open: boolean;
	slides: LightboxSlide[];
	index: number;
	onIndexChange: (index: number) => void;
	onClose: () => void;
	loop?: boolean;
	label?: string;
};

function Lightbox({
	open,
	slides,
	index,
	onIndexChange,
	onClose,
	loop = true,
	label = 'Image gallery',
}: LightboxProps) {
	const prefersReducedMotion = usePrefersReducedMotion();

	const { current, direction, total, next, prev, canPrev, canNext } = useLightboxGallery({
		slides,
		index,
		onIndexChange,
		onClose,
		loop,
	});

	const { target, overlayRef, panelRef, overlayProps, panelProps } = useDialog({
		open,
		onClose,
	});

	const backdropRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	const { isMounted, ref: presenceRef } = usePresence<HTMLDivElement>(open, {
		enter: (_element, { reducedMotion }) => {
			const timeline = gsap.timeline();
			if (backdropRef.current) {
				timeline.fromTo(
					backdropRef.current,
					{ opacity: 0 },
					{ opacity: 1, duration: reducedMotion ? 0 : 0.3, ease: EASE_SMOOTH_OUT },
					0,
				);
			}
			if (panelRef.current) {
				timeline.fromTo(
					panelRef.current,
					{ opacity: 0, scale: reducedMotion ? 1 : 0.9 },
					{
						opacity: 1,
						scale: 1,
						duration: reducedMotion ? 0 : SPRINGS.settle.duration,
						ease: SPRINGS.settle.ease,
					},
					0,
				);
			}
			return timeline;
		},
		exit: (_element, { reducedMotion }) => {
			const timeline = gsap.timeline();
			const duration = reducedMotion ? 0 : 0.2;
			if (panelRef.current) {
				timeline.to(panelRef.current, { opacity: 0, scale: reducedMotion ? 1 : 0.94, duration, ease: 'power2.in' }, 0);
			}
			if (backdropRef.current) {
				timeline.to(backdropRef.current, { opacity: 0, duration, ease: 'power2.in' }, 0);
			}
			return timeline;
		},
	});

	// The image slides in from the side you came from, so paging through a
	// gallery reads as travel rather than a series of unrelated pictures.
	useGSAP(() => {
		const node = imageRef.current;
		if (!node || !isMounted) return;

		gsap.fromTo(
			node,
			{ opacity: 0, x: prefersReducedMotion ? 0 : direction * 40 },
			{ opacity: 1, x: 0, duration: prefersReducedMotion ? 0 : 0.4, ease: EASE_SMOOTH_OUT },
		);
	}, [index, isMounted, prefersReducedMotion]);

	const setOverlay = useCallback(
		(node: HTMLDivElement | null) => {
			presenceRef.current = node;
			overlayRef.current = node;
		},
		[presenceRef, overlayRef],
	);

	if (!target || !isMounted || !current) return null;

	return createPortal(
		<StyledLightboxOverlay ref={setOverlay} {...overlayProps}>
			<StyledLightboxBackdrop ref={backdropRef} aria-hidden="true" />

			<StyledLightboxButton type="button" onClick={onClose} aria-label="Close gallery">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
					<line x1="4" y1="4" x2="14" y2="14" />
					<line x1="14" y1="4" x2="4" y2="14" />
				</svg>
			</StyledLightboxButton>

			{total > 1 ? (
				<StyledLightboxButton
					type="button"
					onClick={prev}
					disabled={!canPrev}
					aria-label="Previous image"
					$side="prev"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						<polyline points="13 4 7 10 13 16" />
					</svg>
				</StyledLightboxButton>
			) : null}

			<StyledLightboxFrame ref={panelRef} {...panelProps} aria-label={label}>
				<StyledLightboxImage
					ref={imageRef}
					src={current.src}
					alt={current.alt}
					width={current.width}
					height={current.height}
					decoding="async"
					draggable={false}
				/>
			</StyledLightboxFrame>

			{total > 1 ? (
				<StyledLightboxButton
					type="button"
					onClick={next}
					disabled={!canNext}
					aria-label="Next image"
					$side="next"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
						<polyline points="7 4 13 10 7 16" />
					</svg>
				</StyledLightboxButton>
			) : null}

			{total > 1 ? (
				<StyledLightboxCounter aria-hidden="true">
					{index + 1} / {total}
				</StyledLightboxCounter>
			) : null}

			<StyledVisuallyHidden role="status" aria-live="polite">
				{`Image ${index + 1} of ${total}: ${current.alt}`}
			</StyledVisuallyHidden>
		</StyledLightboxOverlay>,
		target,
	);
}

export default Lightbox;
