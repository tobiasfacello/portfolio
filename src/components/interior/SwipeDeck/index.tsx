//! React
import { useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useSwipeDeck, type UseSwipeDeckOptions } from './useSwipeDeck';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledDeckRoot,
	StyledDeckStage,
	StyledDeckCard,
	StyledDeckVerdict,
	StyledDeckEmpty,
	StyledDeckActions,
	StyledDeckButton,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

/** Maximum tilt as a card is dragged aside, in degrees. */
const TILT = 14;
/** Cards drawn behind the top one. */
const DEPTH = 2;

export type SwipeDeckProps<T> = UseSwipeDeckOptions<T> & {
	renderCard: (item: T) => ReactNode;
	label: string;
	height?: number;
	emptyLabel?: string;
	leftLabel?: string;
	rightLabel?: string;
};

function SwipeDeck<T>({
	renderCard,
	label,
	height = 200,
	emptyLabel = 'Nothing left',
	leftLabel = 'Pass',
	rightLabel = 'Keep',
	...options
}: SwipeDeckProps<T>) {
	const { top, remaining, cursor, total, offset, dragging, leaving, bind, commit, getId } =
		useSwipeDeck(options);

	const prefersReducedMotion = usePrefersReducedMotion();
	const cardRef = useRef<HTMLDivElement>(null);
	const passRef = useRef<HTMLSpanElement>(null);
	const keepRef = useRef<HTMLSpanElement>(null);

	useGSAP(() => {
		const node = cardRef.current;
		if (!node) return;

		if (leaving) {
			// Thrown clear of the stage rather than faded — the card went somewhere.
			gsap.to(node, {
				x: leaving === 'right' ? 520 : -520,
				rotate: leaving === 'right' ? TILT * 1.6 : -TILT * 1.6,
				opacity: 0,
				duration: prefersReducedMotion ? 0 : 0.26,
				ease: EASE_SMOOTH_OUT,
			});
			return;
		}

		const settle = motionSafe(SPRINGS.cell, prefersReducedMotion);
		const ratio = Math.max(-1, Math.min(1, offset / 220));

		gsap.to(node, {
			x: offset,
			// Rotation follows the drag, so the card pivots as if held at its base.
			rotate: ratio * TILT,
			opacity: 1,
			// While dragging it must track the finger, not lag behind a spring.
			duration: dragging ? 0 : settle.duration,
			ease: settle.ease,
		});

		if (passRef.current) {
			gsap.to(passRef.current, { opacity: Math.max(0, -ratio), duration: dragging ? 0 : 0.15 });
		}
		if (keepRef.current) {
			gsap.to(keepRef.current, { opacity: Math.max(0, ratio), duration: dragging ? 0 : 0.15 });
		}
	}, [offset, dragging, leaving, prefersReducedMotion]);

	return (
		<StyledDeckRoot>
			<StyledDeckStage $height={height} role="group" aria-roledescription="card deck" aria-label={label}>
				{remaining.length === 0 ? (
					<StyledDeckEmpty>{emptyLabel}</StyledDeckEmpty>
				) : (
					remaining.slice(0, DEPTH + 1).map((item, depth) => {
						const isTop = depth === 0;
						return (
							<StyledDeckCard
								key={getId(item)}
								ref={isTop ? cardRef : undefined}
								$depth={depth}
								tabIndex={isTop ? 0 : -1}
								inert={!isTop}
								style={
									isTop
										? undefined
										: {
												// Peeking cards shrink and drop, suggesting depth.
												transform: `translateY(${depth * 8}px) scale(${1 - depth * 0.04})`,
												opacity: 1 - depth * 0.25,
											}
								}
								{...(isTop ? bind : {})}
							>
								{isTop ? (
									<>
										<StyledDeckVerdict ref={passRef} $side="left" aria-hidden="true">
											{leftLabel}
										</StyledDeckVerdict>
										<StyledDeckVerdict ref={keepRef} $side="right" aria-hidden="true">
											{rightLabel}
										</StyledDeckVerdict>
									</>
								) : null}

								{renderCard(item)}
							</StyledDeckCard>
						);
					})
				)}
			</StyledDeckStage>

			<StyledDeckActions>
				<StyledDeckButton
					type="button"
					onClick={() => top && commit('left')}
					aria-label={leftLabel}
					$tone="danger"
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
						<path d="M3.5 3.5 10.5 10.5M10.5 3.5 3.5 10.5" />
					</svg>
				</StyledDeckButton>

				<StyledDeckButton
					type="button"
					onClick={() => top && commit('right')}
					aria-label={rightLabel}
					$tone="success"
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
						<path d="M3 7.4 5.8 10.2 11 3.8" />
					</svg>
				</StyledDeckButton>
			</StyledDeckActions>

			<StyledVisuallyHidden role="status" aria-live="polite">
				{remaining.length === 0 ? emptyLabel : `${cursor + 1} of ${total}`}
			</StyledVisuallyHidden>
		</StyledDeckRoot>
	);
}

export default SwipeDeck;
