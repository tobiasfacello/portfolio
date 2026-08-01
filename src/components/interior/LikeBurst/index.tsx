//! React
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

//? Variants
import type { ControlSize, ControlTone } from '../shared/variants';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useOptimisticLike, type LikeCommit } from './useOptimisticLike';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledLikeRoot,
	StyledLikeButton,
	StyledHeartSlot,
	StyledHeart,
	StyledSparkOrigin,
	StyledSpark,
	StyledLikeLabels,
	StyledLikeCount,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const HEART = 'M12 20.3 4.3 12.6a4.8 4.8 0 0 1 6.8-6.8l.9.9.9-.9a4.8 4.8 0 0 1 6.8 6.8Z';

/**
 * Sparks are laid out from a fixed hash rather than randomly, so the burst is
 * identical every time — a celebration that reshuffles reads as a glitch.
 */
const SPARKS = Array.from({ length: 8 }, (_, i) => {
	const h = (((i + 1) * 2654435761) % 997) / 997;
	const angle = (i / 8) * Math.PI * 2 - Math.PI / 2 + (h - 0.5) * 0.4;
	const distance = 13 + h * 9;
	return {
		x: Math.round(Math.cos(angle) * distance * 10) / 10,
		y: Math.round(Math.sin(angle) * distance * 10) / 10,
		size: h > 0.5 ? 4 : 3,
		delay: Math.round(h * 50) / 1000,
	};
});

const DEFAULT_FORMAT = (value: number) => new Intl.NumberFormat('en-US').format(value);

export type LikeBurstHandle = { toggle: () => void };

export type LikeBurstProps = {
	size?: ControlSize;
	tone?: ControlTone;
	initialLiked?: boolean;
	initialCount?: number;
	onCommit?: LikeCommit;
	onError?: (error: unknown) => void;
	onToggle?: (liked: boolean) => void;
	settle?: number;
	label?: string;
	activeLabel?: string;
	format?: (value: number) => string;
	disabled?: boolean;
	ref?: React.Ref<LikeBurstHandle>;
};

function LikeBurst({
	size = 'md',
	tone = 'default',
	initialLiked = false,
	initialCount = 0,
	onCommit,
	onError,
	onToggle,
	settle = 400,
	label = 'Like',
	activeLabel = 'Liked',
	format = DEFAULT_FORMAT,
	disabled = false,
	ref,
}: LikeBurstProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { liked, count, base, pending, burst, settled, toggle } = useOptimisticLike({
		initialLiked,
		initialCount,
		onCommit,
		onError,
		settle,
	});

	useImperativeHandle(ref, () => ({ toggle }), [toggle]);

	const outlineRef = useRef<SVGSVGElement>(null);
	const filledRef = useRef<SVGSVGElement>(null);
	const labelRef = useRef<HTMLSpanElement>(null);
	const activeRef = useRef<HTMLSpanElement>(null);
	const countRef = useRef<HTMLSpanElement>(null);
	const sparksRef = useRef<(HTMLSpanElement | null)[]>([]);

	const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
	const pop = motionSafe(SPRINGS.cell, prefersReducedMotion);

	useGSAP(() => {
		if (outlineRef.current) {
			gsap.to(outlineRef.current, {
				opacity: liked ? 0 : 1,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
		if (filledRef.current) {
			gsap.to(filledRef.current, {
				opacity: liked ? 1 : 0,
				scale: liked ? 1 : 0.55,
				duration: pop.duration,
				ease: pop.ease,
			});
		}
		if (labelRef.current) {
			gsap.to(labelRef.current, {
				opacity: liked ? 0 : 1,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
		if (activeRef.current) {
			gsap.to(activeRef.current, {
				opacity: liked ? 1 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
	}, [liked, fade, pop]);

	// Replays on every like, keyed off the burst counter rather than `liked`, so
	// liking twice in a row bursts twice.
	useGSAP(() => {
		if (burst === 0 || prefersReducedMotion) return;

		const nodes = sparksRef.current.filter(Boolean) as HTMLSpanElement[];
		if (nodes.length === 0) return;

		const timeline = gsap.timeline();
		nodes.forEach((node, i) => {
			const spark = SPARKS[i];
			timeline.fromTo(
				node,
				{ x: 0, y: 0, scale: 0.6, opacity: 0.85 },
				{
					x: spark.x,
					y: spark.y,
					scale: 1,
					opacity: 0,
					duration: 0.44,
					ease: EASE_SMOOTH_OUT,
				},
				spark.delay,
			);
		});

		return () => {
			timeline.kill();
		};
	}, [burst, prefersReducedMotion]);

	const shown = format(count);
	const [displayed, setDisplayed] = useState(shown);

	useGSAP(() => {
		const node = countRef.current;
		if (!node || displayed === shown) return;

		if (prefersReducedMotion) {
			setDisplayed(shown);
			return;
		}

		// The number leaves upward when it grows and downward when it shrinks, so
		// the direction of travel matches the direction of the change.
		const rising = count > Number(displayed.replace(/\D/g, ''));
		gsap.to(node, {
			opacity: 0,
			y: rising ? -7 : 7,
			duration: fade.duration * 0.5,
			ease: 'power2.in',
			onComplete: () => {
				setDisplayed(shown);
				gsap.fromTo(
					node,
					{ opacity: 0, y: rising ? 7 : -7 },
					{ opacity: 1, y: 0, duration: fade.duration, ease: fade.ease },
				);
			},
		});
	}, [shown, prefersReducedMotion]);

	useEffect(() => {
		if (prefersReducedMotion) setDisplayed(shown);
	}, [shown, prefersReducedMotion]);

	const low = format(base);
	const high = format(base + 1);
	const widest = high.length >= low.length ? high : low;

	return (
		<StyledLikeRoot>
			<StyledLikeButton $size={size} $tone={tone}
				type="button"
				disabled={disabled}
				aria-pressed={liked}
				aria-busy={pending}
				aria-label={label}
				onClick={() => {
					toggle();
					onToggle?.(!liked);
				}}
			>
				<StyledHeartSlot aria-hidden="true">
					<StyledHeart
						ref={outlineRef}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.7}
						strokeLinejoin="round"
					>
						<path d={HEART} />
					</StyledHeart>

					<StyledHeart
						ref={filledRef}
						viewBox="0 0 24 24"
						fill="currentColor"
						style={{ opacity: 0 }}
					>
						<path d={HEART} />
					</StyledHeart>

					{!prefersReducedMotion ? (
						<StyledSparkOrigin>
							{SPARKS.map((spark, i) => (
								<StyledSpark
									key={i}
									ref={(node) => {
										sparksRef.current[i] = node;
									}}
									$size={spark.size}
								/>
							))}
						</StyledSparkOrigin>
					) : null}
				</StyledHeartSlot>

				<StyledLikeLabels aria-hidden="true">
					<span ref={labelRef}>{label}</span>
					<span ref={activeRef} style={{ opacity: 0 }}>
						{activeLabel}
					</span>
				</StyledLikeLabels>

				<StyledLikeCount aria-hidden="true">
					<span data-ghost>{widest}</span>
					<span ref={countRef}>{displayed}</span>
				</StyledLikeCount>
			</StyledLikeButton>

			<StyledVisuallyHidden role="status" aria-live="polite">
				{`${format(settled.count)} likes, ${settled.liked ? 'liked' : 'not liked'}`}
			</StyledVisuallyHidden>
		</StyledLikeRoot>
	);
}

export default LikeBurst;
