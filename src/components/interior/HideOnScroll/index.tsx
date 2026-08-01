//! React
import { useEffect, useRef, useState, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useHideOnScroll } from './useHideOnScroll';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledHideRoot,
	StyledHideBar,
	StyledHideBarRule,
	StyledHideScroller,
	StyledBarSpacer,
	StyledEdgeFade,
} from './styled';

export type HideOnScrollProps = {
	bar: ReactNode;
	children: ReactNode;
	barHeight?: number;
	hideAfter?: number;
	revealAfter?: number;
	topGuard?: number;
	pinned?: boolean;
	maxHeight?: number;
	label?: string;
	onHiddenChange?: (hidden: boolean) => void;
};

function HideOnScroll({
	bar,
	children,
	barHeight = 44,
	hideAfter = 14,
	revealAfter = 10,
	topGuard = 24,
	pinned = false,
	maxHeight = 320,
	label = 'Scrollable content',
	onHiddenChange,
}: HideOnScrollProps) {
	// A bar that hides itself while the user is tabbing through it would strand
	// the focus ring off screen, so focus pins it open.
	const [focusWithin, setFocusWithin] = useState(false);

	const { ref, hidden, atTop } = useHideOnScroll<HTMLDivElement>({
		hideAfter,
		revealAfter,
		topGuard,
		pinned: pinned || focusWithin,
	});

	const prefersReducedMotion = usePrefersReducedMotion();
	const barRef = useRef<HTMLDivElement>(null);
	const ruleRef = useRef<HTMLSpanElement>(null);

	useGSAP(() => {
		const slide = motionSafe(SPRINGS.sway, prefersReducedMotion);
		if (barRef.current) {
			gsap.to(barRef.current, {
				y: hidden ? -barHeight : 0,
				duration: slide.duration,
				ease: slide.ease,
			});
		}

		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		if (ruleRef.current) {
			gsap.to(ruleRef.current, {
				opacity: atTop ? 0 : 1,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
	}, [hidden, atTop, barHeight, prefersReducedMotion]);

	const seen = useRef(hidden);
	useEffect(() => {
		if (seen.current === hidden) return;
		seen.current = hidden;
		onHiddenChange?.(hidden);
	}, [hidden, onHiddenChange]);

	return (
		<StyledHideRoot>
			<StyledHideBar
				ref={barRef}
				data-hidden={hidden ? 'true' : 'false'}
				onFocus={() => setFocusWithin(true)}
				onBlur={() => setFocusWithin(false)}
				$height={barHeight}
			>
				{bar}
				<StyledHideBarRule ref={ruleRef} aria-hidden="true" />
			</StyledHideBar>

			<StyledHideScroller
				ref={ref}
				tabIndex={0}
				role="region"
				aria-label={label}
				// Keyboard scrolling must not land content underneath the bar.
				style={{ maxHeight, scrollPaddingTop: barHeight + 8 }}
			>
				<StyledBarSpacer aria-hidden="true" $height={barHeight} />
				<StyledEdgeFade aria-hidden="true" $edge="top" />
				{children}
				<StyledEdgeFade aria-hidden="true" $edge="bottom" />
			</StyledHideScroller>
		</StyledHideRoot>
	);
}

export default HideOnScroll;
