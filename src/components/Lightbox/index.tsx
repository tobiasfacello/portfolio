//! React Core
import { useRef, useEffect, useCallback } from "react";

//! GSAP
import { gsap, useGSAP } from "../../lib/gsap";

//! Lenis
import { useLenis } from "lenis/react";

//? Context
import { useLightbox } from "../../context/LightboxContext";

//? Hooks
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

//* Styled
import {
	StyledLightboxOverlay,
	StyledLightboxImageContainer,
	StyledCloseButton,
	StyledNavButton,
	StyledLightboxCounter,
} from "./styled";

function Lightbox() {
	const { isOpen, images, currentIndex, close, prev, next, direction } = useLightbox();

	const overlayRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const previousFocusRef = useRef<Element | null>(null);
	const closeBtnRef = useRef<HTMLButtonElement>(null);
	const prevBtnRef = useRef<HTMLButtonElement>(null);
	const nextBtnRef = useRef<HTMLButtonElement>(null);

	const lenis = useLenis();

	const prefersReducedMotion = usePrefersReducedMotion();

	// Scroll lock
	useEffect(() => {
		if (isOpen) {
			document.documentElement.style.overflow = "hidden";
			lenis?.stop();
		} else {
			document.documentElement.style.overflow = "";
			lenis?.start();
		}
		return () => {
			document.documentElement.style.overflow = "";
			lenis?.start();
		};
	}, [isOpen, lenis]);

	// GSAP open/close animations
	useGSAP(() => {
		const overlay = overlayRef.current;
		const img = imageRef.current;
		if (!overlay || !img) return;

		if (isOpen) {
			if (prefersReducedMotion) {
				gsap.set(overlay, { opacity: 1, visibility: "visible" });
				gsap.set(img, { scale: 1, opacity: 1 });
			} else {
				const tl = gsap.timeline();
				tl.set(overlay, { visibility: "visible" });
				tl.fromTo(
					overlay,
					{ opacity: 0 },
					{ opacity: 1, duration: 0.5, ease: "power3.out" }
				);
				tl.fromTo(
					img,
					{ scale: 0.88, opacity: 0 },
					{ scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" },
					"-=0.3"
				);
			}
		} else {
			if (prefersReducedMotion) {
				gsap.set(overlay, { opacity: 0, visibility: "hidden" });
				gsap.set(img, { scale: 1, opacity: 0 });
			} else {
				const tl = gsap.timeline();
				tl.to(img, {
					scale: 0.94,
					opacity: 0,
					duration: 0.35,
					ease: "power2.inOut",
				});
				tl.to(overlay, {
					opacity: 0,
					duration: 0.35,
					ease: "power2.inOut",
					onComplete: () => {
						gsap.set(overlay, { visibility: "hidden" });
					},
				}, "-=0.15");
			}
		}
	}, [isOpen, prefersReducedMotion]);

	// Slide + fade on navigation
	useGSAP(() => {
		const img = imageRef.current;
		if (!img || !isOpen) return;

		const offset = 40 * direction;

		if (prefersReducedMotion) {
			gsap.set(img, { opacity: 1, x: 0 });
		} else {
			gsap.fromTo(
				img,
				{ opacity: 0, x: offset },
				{ opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
			);
		}
	}, [currentIndex, prefersReducedMotion]);

	// Focus management
	useEffect(() => {
		if (isOpen) {
			previousFocusRef.current = document.activeElement;
		} else if (previousFocusRef.current instanceof HTMLElement) {
			previousFocusRef.current.focus();
			previousFocusRef.current = null;
		}
	}, [isOpen]);

	// Global keyboard navigation (document-level so it works immediately on open)
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "Escape":
					close();
					break;
				case "ArrowLeft":
					prev();
					break;
				case "ArrowRight":
					next();
					break;
				case "Tab": {
					e.preventDefault();
					const focusable = [
						closeBtnRef.current,
						prevBtnRef.current,
						nextBtnRef.current,
					].filter(Boolean) as HTMLElement[];
					if (focusable.length === 0) return;
					const currentIdx = focusable.indexOf(
						document.activeElement as HTMLElement
					);
					if (e.shiftKey) {
						const prevIdx =
							currentIdx <= 0 ? focusable.length - 1 : currentIdx - 1;
						focusable[prevIdx].focus();
					} else {
						const nextIdx =
							currentIdx >= focusable.length - 1 ? 0 : currentIdx + 1;
						focusable[nextIdx].focus();
					}
					break;
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, close, prev, next]);

	// Click overlay to close
	const handleOverlayClick = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === overlayRef.current) {
				close();
			}
		},
		[close]
	);

	const currentImage = images[currentIndex];
	const showNav = images.length > 1;

	return (
		<StyledLightboxOverlay
			ref={overlayRef}
			role="dialog"
			aria-modal="true"
			aria-label="Image gallery"
			tabIndex={-1}
			onClick={handleOverlayClick}
		>
			<StyledCloseButton
				ref={closeBtnRef}
				className="button"
				onClick={close}
				aria-label="Close gallery"
			>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
					<line x1="4" y1="4" x2="14" y2="14" />
					<line x1="14" y1="4" x2="4" y2="14" />
				</svg>
			</StyledCloseButton>

			{showNav && (
				<StyledNavButton
					ref={prevBtnRef}
					className="button"
					$direction="prev"
					onClick={prev}
					aria-label="Previous image"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="13 4 7 10 13 16" />
					</svg>
				</StyledNavButton>
			)}

			<StyledLightboxImageContainer>
				{currentImage && (
					<img
						ref={imageRef}
						src={currentImage.src}
						alt={currentImage.alt}
						loading="lazy"
						draggable={false}
					/>
				)}
			</StyledLightboxImageContainer>

			{showNav && (
				<StyledNavButton
					ref={nextBtnRef}
					className="button"
					$direction="next"
					onClick={next}
					aria-label="Next image"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="7 4 13 10 7 16" />
					</svg>
				</StyledNavButton>
			)}

			{showNav && (
				<StyledLightboxCounter>
					{currentIndex + 1} / {images.length}
				</StyledLightboxCounter>
			)}
		</StyledLightboxOverlay>
	);
}

export default Lightbox;
