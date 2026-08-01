//! React
import { useCallback, useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useCondense } from './useCondense';

//* Styled
import {
	StyledStickyRoot,
	StyledStickyScroller,
	StyledStickyHeaderBar,
	StyledStickyPlate,
	StyledStickyEdge,
	StyledStickyRow,
	StyledStickySlot,
	StyledStickyTitles,
	StyledStickyExpanded,
	StyledStickyTitle,
	StyledStickySubtitle,
	StyledStickyCompact,
	StyledStickyFade,
} from './styled';

/** How quickly the smoothed progress chases the raw scroll ratio, in seconds. */
const SMOOTHING = 0.28;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export type StickyHeaderProps = {
	title: string;
	children: ReactNode;
	subtitle?: string;
	leading?: ReactNode;
	actions?: ReactNode;
	expandedHeight?: number;
	compactHeight?: number;
	maxHeight?: number;
};

function StickyHeader({
	title,
	children,
	subtitle,
	leading,
	actions,
	expandedHeight = 68,
	compactHeight = 48,
	maxHeight = 320,
}: StickyHeaderProps) {
	const prefersReducedMotion = usePrefersReducedMotion();

	const tall = Math.max(expandedHeight, compactHeight);
	const short = Math.min(expandedHeight, compactHeight);
	const travel = Math.max(1, tall - short);

	const plateRef = useRef<HTMLDivElement>(null);
	const edgeRef = useRef<HTMLDivElement>(null);
	const expandedRef = useRef<HTMLDivElement>(null);
	const compactRef = useRef<HTMLSpanElement>(null);
	const smoothed = useRef({ value: 0 });

	/**
	 * Applies one progress value to every layer at once. Driving them from a
	 * single number is what keeps the plate, the edge and the two titles in
	 * agreement — animating each independently lets them drift apart mid-scroll.
	 */
	const paint = useCallback(
		(p: number) => {
			const edge = tall - travel * p;

			if (plateRef.current) {
				gsap.set(plateRef.current, { scaleY: (tall - travel * p) / tall });
			}
			if (edgeRef.current) {
				gsap.set(edgeRef.current, { y: edge, opacity: clamp01(p / 0.12) });
			}
			if (expandedRef.current) {
				gsap.set(expandedRef.current, {
					y: -travel * p,
					opacity: clamp01(1 - p / 0.45),
					scale: 1 - 0.05 * p,
				});
			}
			if (compactRef.current) {
				// Handover happens after the expanded title has gone: the two never
				// overlap at readable opacity.
				const opacity = clamp01((p - 0.55) / 0.35);
				gsap.set(compactRef.current, { opacity, y: (1 - opacity) * 6 });
			}
		},
		[tall, travel],
	);

	const onProgress = useCallback(
		(raw: number) => {
			if (prefersReducedMotion) {
				smoothed.current.value = raw;
				paint(raw);
				return;
			}

			gsap.to(smoothed.current, {
				value: raw,
				duration: SMOOTHING,
				ease: 'power2.out',
				overwrite: true,
				onUpdate: () => paint(smoothed.current.value),
			});
		},
		[paint, prefersReducedMotion],
	);

	const { ref, condensed } = useCondense<HTMLDivElement>({
		range: Math.max(64, travel * 3),
		onProgress,
	});

	useGSAP(() => {
		paint(smoothed.current.value);
	}, [paint]);

	return (
		<StyledStickyRoot>
			<StyledStickyScroller
				ref={ref}
				tabIndex={0}
				role="region"
				aria-label={title}
				style={{ maxHeight, scrollPaddingTop: short + 10 }}
			>
				<div aria-hidden="true" style={{ height: tall }} />
				{children}
				<StyledStickyFade aria-hidden="true" />
			</StyledStickyScroller>

			<StyledStickyHeaderBar
				data-condensed={condensed ? 'true' : 'false'}
				style={{ height: tall }}
			>
				<StyledStickyPlate ref={plateRef} aria-hidden="true" style={{ height: tall }} />
				<StyledStickyEdge ref={edgeRef} aria-hidden="true" />

				<StyledStickyRow>
					{leading ? <StyledStickySlot>{leading}</StyledStickySlot> : null}

					<StyledStickyTitles>
						<StyledStickyExpanded ref={expandedRef}>
							<StyledStickyTitle>{title}</StyledStickyTitle>
							{subtitle ? <StyledStickySubtitle>{subtitle}</StyledStickySubtitle> : null}
						</StyledStickyExpanded>

						<StyledStickyCompact ref={compactRef} aria-hidden="true">
							{title}
						</StyledStickyCompact>
					</StyledStickyTitles>

					{actions ? <StyledStickySlot>{actions}</StyledStickySlot> : null}
				</StyledStickyRow>
			</StyledStickyHeaderBar>
		</StyledStickyRoot>
	);
}

export default StickyHeader;
