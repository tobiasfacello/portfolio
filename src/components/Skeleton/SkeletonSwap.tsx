//! React
import { useEffect, useRef, useState, type ReactNode } from 'react';
import styled from 'styled-components';

//! GSAP
import { gsap, useGSAP } from '../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { usePresence } from '../../hooks/usePresence';
import { useSkeletonSwap } from './useSkeletonSwap';

//? Lib
import { SPRINGS, motionSafe } from '../../lib/motion';

//* Components
import Skeleton from '.';

/**
 * Swaps a loading placeholder for real content without the layout jumping.
 *
 * Builds on the existing `Skeleton` primitive rather than introducing a second
 * one: this adds the *swap* — the reserved box, the delay before showing, the
 * minimum visible time and the crossfade.
 */

/** Line widths that read as prose rather than a uniform block. */
const WIDTHS = [100, 93, 97, 88, 95, 91] as const;

function widthFor(index: number, total: number) {
	// The last line of a paragraph is short, so the placeholder ends like one.
	if (total > 1 && index === total - 1) return 62;
	return WIDTHS[(index * 7 + 3) % WIDTHS.length];
}

/** Both layers occupy one grid cell, so the box height never depends on which is showing. */
const StyledSwapShell = styled.div`
	position: relative;
	display: grid;
	overflow-y: auto;
	overscroll-behavior: contain;
	color: var(--text);

	> * {
		grid-area: 1 / 1;
		min-width: 0;
	}
`;

const StyledSwapBody = styled.div`
	transform-origin: top left;
	will-change: transform, opacity, filter;
`;

const StyledSwapSkeleton = styled.div`
	width: 100%;
	align-self: start;
	pointer-events: none;
`;

const StyledSkeletonLine = styled.div<{ $height: number }>`
	display: flex;
	align-items: center;
	height: ${({ $height }) => $height}px;
`;

export type SkeletonSwapProps = {
	ready: boolean;
	children: ReactNode;
	lines?: number;
	lineHeight?: number;
	barHeight?: number;
	/** Fixed height for the box; defaults to `lines * lineHeight`. */
	reserve?: number;
	delay?: number;
	minVisible?: number;
	label?: string;
	skeleton?: ReactNode;
};

function SkeletonSwap({
	ready,
	children,
	lines = 3,
	lineHeight = 21,
	barHeight = 9,
	reserve,
	delay = 120,
	minVisible = 380,
	label,
	skeleton,
}: SkeletonSwapProps) {
	const { showSkeleton } = useSkeletonSwap({ ready, delay, minVisible });
	const prefersReducedMotion = usePrefersReducedMotion();

	const shellRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const [scrollable, setScrollable] = useState(false);

	const box = reserve ?? lines * lineHeight;
	const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);

	// A scrollable region needs to be reachable by keyboard; a non-scrollable one
	// must not add a pointless tab stop.
	useEffect(() => {
		const el = shellRef.current;
		const inner = bodyRef.current;
		if (!el) return;

		const check = () => setScrollable(el.scrollHeight - el.clientHeight > 1);
		check();

		const observer = new ResizeObserver(check);
		observer.observe(el);
		if (inner) observer.observe(inner);
		return () => observer.disconnect();
	}, []);

	useGSAP(() => {
		const node = bodyRef.current;
		if (!node) return;

		gsap.to(node, {
			opacity: showSkeleton ? 0 : 1,
			scale: prefersReducedMotion ? 1 : showSkeleton ? 0.99 : 1,
			filter: prefersReducedMotion ? 'none' : showSkeleton ? 'blur(4px)' : 'blur(0px)',
			duration: fade.duration,
			ease: fade.ease,
		});
	}, [showSkeleton, fade, prefersReducedMotion]);

	const { isMounted, ref: skeletonRef } = usePresence<HTMLDivElement>(showSkeleton, {
		enter: (element, { reducedMotion }) =>
			gsap.fromTo(
				element,
				{ opacity: reducedMotion ? 1 : 0 },
				{ opacity: 1, duration: fade.duration, ease: fade.ease },
			),
		exit: (element, { reducedMotion }) =>
			gsap.to(element, {
				opacity: 0,
				filter: reducedMotion ? 'none' : 'blur(3px)',
				duration: fade.duration,
				ease: fade.ease,
			}),
	});

	return (
		<StyledSwapShell
			ref={shellRef}
			aria-busy={!ready}
			aria-label={label}
			tabIndex={scrollable ? 0 : undefined}
			style={{ height: box }}
		>
			<StyledSwapBody
				ref={bodyRef}
				style={{ pointerEvents: showSkeleton ? 'none' : undefined }}
			>
				{children}
			</StyledSwapBody>

			{isMounted ? (
				<StyledSwapSkeleton ref={skeletonRef} aria-hidden="true">
					{skeleton ?? (
						<div>
							{Array.from({ length: lines }, (_, i) => (
								<StyledSkeletonLine key={i} $height={lineHeight}>
									<Skeleton
										variant="text"
										h={`${barHeight}px`}
										w={`${widthFor(i, lines)}%`}
									/>
								</StyledSkeletonLine>
							))}
						</div>
					)}
				</StyledSwapSkeleton>
			) : null}

			{label ? (
				<span role="status" className="sr-only">
					{ready ? `${label} loaded` : ''}
				</span>
			) : null}
		</StyledSwapShell>
	);
}

export default SkeletonSwap;
