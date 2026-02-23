//! React Core
import { useRef, useEffect, useCallback } from "react";

//! GSAP
import { gsap } from "gsap";

//* Components
import AsciiLogo from "../AsciiLogo";

//* Styles
import { StyledSplashOverlay } from "./styled";

//? Context
import { useSplash } from "../../context/SplashContext";

export default function SplashScreen() {
	const { headerLogoRef, setSplashComplete, dismissSplash } = useSplash();
	const splashLogoRef = useRef<HTMLHeadingElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Block scroll while splash is active
	useEffect(() => {
		document.documentElement.style.overflow = "hidden";
		return () => {
			document.documentElement.style.overflow = "";
		};
	}, []);

	const handleAnimationComplete = useCallback(() => {
		if (prefersReducedMotion) {
			setSplashComplete();
			dismissSplash();
			return;
		}

		const splashLogo = splashLogoRef.current;
		const headerTarget = headerLogoRef.current;
		const overlay = overlayRef.current;

		if (!splashLogo || !headerTarget || !overlay) {
			setSplashComplete();
			dismissSplash();
			return;
		}

		const splashRect = splashLogo.getBoundingClientRect();
		const headerRect = headerTarget.getBoundingClientRect();

		// Remove contain so fixed positioning works
		splashLogo.style.contain = "none";

		// Fix the logo at its current position — only top changes, no resize
		splashLogo.style.position = "fixed";
		splashLogo.style.top = `${splashRect.top}px`;
		splashLogo.style.left = "0";
		splashLogo.style.width = "100%";
		splashLogo.style.margin = "0";
		splashLogo.style.zIndex = "1001";

		const tl = gsap.timeline();

		// Slide logo up to header position (overlay stays opaque, no resize)
		tl.to(splashLogo, {
			top: headerRect.top,
			duration: 0.6,
			ease: "power2.inOut",
			onComplete: () => {
				// Header logo renders NOW, hidden behind the opaque overlay
				setSplashComplete();
			},
		});

		// Fade overlay — header logo is already rendered behind it
		tl.to(overlay, {
			opacity: 0,
			duration: 0.4,
			ease: "power2.out",
			onComplete: () => {
				// Overlay fully transparent — unmount splash
				dismissSplash();
			},
		});
	}, [headerLogoRef, setSplashComplete, dismissSplash, prefersReducedMotion]);

	return (
		<StyledSplashOverlay ref={overlayRef}>
			<AsciiLogo
				ref={splashLogoRef}
				skipAnimation={prefersReducedMotion}
				onAnimationComplete={handleAnimationComplete}
			/>
		</StyledSplashOverlay>
	);
}
