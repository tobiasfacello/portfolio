//! React
import { useId, useRef, type ReactNode } from 'react';

//? Variants
import type { ControlSize, ControlTone } from '../shared/variants';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useShowMore, type UseShowMoreOptions } from './useShowMore';

//? Lib
import { SPRINGS, spring, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledShowMoreRoot,
	StyledShowMoreShell,
	StyledShowMoreRegion,
	StyledShowMoreVeil,
	StyledShowMoreActions,
	StyledShowMoreButton,
	StyledShowMoreLabels,
	StyledShowMoreChevron,
} from './styled';

const DISCLOSE = spring({ stiffness: 190, damping: 30, mass: 1 });

export type ShowMoreProps = UseShowMoreOptions & {
	size?: ControlSize;
	tone?: ControlTone;
	children: ReactNode;
	moreLabel?: string;
	lessLabel?: string;
	label?: string;
};

function ShowMore({
	size = 'md',
	tone = 'default',
	children,
	moreLabel = 'Show more',
	lessLabel = 'Show less',
	label = 'Details',
	lines = 3,
	maxHeight = 320,
	defaultExpanded,
	expanded,
	onExpandedChange,
}: ShowMoreProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const regionId = useId();
	const regionRef = useRef<HTMLDivElement>(null);

	const { contentRef, open, toggle, height, expandable, capped, scrollable } = useShowMore({
		lines,
		maxHeight,
		defaultExpanded,
		expanded,
		onExpandedChange,
	});

	const veilRef = useRef<HTMLDivElement>(null);
	const moreRef = useRef<HTMLSpanElement>(null);
	const lessRef = useRef<HTMLSpanElement>(null);
	const chevronRef = useRef<SVGSVGElement>(null);

	useGSAP(() => {
		const node = regionRef.current;
		if (!node || height === null) return;

		const disclose = motionSafe(DISCLOSE, prefersReducedMotion);
		gsap.to(node, { height, duration: disclose.duration, ease: disclose.ease });
	}, [height, prefersReducedMotion]);

	// The veil stays while a scrollable expanded region still has more below.
	const veiled = expandable && (!open || scrollable);

	useGSAP(() => {
		const small = motionSafe(SPRINGS.snap, prefersReducedMotion);

		if (veilRef.current) {
			gsap.to(veilRef.current, {
				opacity: veiled ? 1 : 0,
				duration: small.duration,
				ease: small.ease,
			});
		}
		if (moreRef.current) {
			gsap.to(moreRef.current, {
				opacity: open ? 0 : 1,
				duration: small.duration,
				ease: small.ease,
			});
		}
		if (lessRef.current) {
			gsap.to(lessRef.current, {
				opacity: open ? 1 : 0,
				duration: small.duration,
				ease: small.ease,
			});
		}
		if (chevronRef.current) {
			gsap.to(chevronRef.current, {
				rotate: open ? 180 : 0,
				duration: small.duration,
				ease: small.ease,
			});
		}
	}, [veiled, open, prefersReducedMotion]);

	// Collapsing a scrolled region would otherwise leave it showing its middle.
	const press = () => {
		if (open) regionRef.current?.scrollTo({ top: 0 });
		toggle();
	};

	return (
		<StyledShowMoreRoot>
			<StyledShowMoreShell>
				<StyledShowMoreRegion
					ref={regionRef}
					id={regionId}
					role={scrollable ? 'region' : undefined}
					aria-label={scrollable ? label : undefined}
					tabIndex={scrollable ? 0 : undefined}
					$scrollable={scrollable}
					$capped={capped}
					style={{ maxHeight: height === null ? `${lines}lh` : undefined }}
				>
					<div ref={contentRef}>{children}</div>
				</StyledShowMoreRegion>

				<StyledShowMoreVeil ref={veilRef} aria-hidden="true" />
			</StyledShowMoreShell>

			<StyledShowMoreActions>
				<StyledShowMoreButton $size={size} $tone={tone}
					type="button"
					onClick={press}
					aria-expanded={open}
					aria-controls={regionId}
					$hidden={!expandable}
				>
					<StyledShowMoreLabels>
						<span ref={moreRef} aria-hidden={open}>
							{moreLabel}
						</span>
						<span ref={lessRef} aria-hidden={!open} style={{ opacity: 0 }}>
							{lessLabel}
						</span>
					</StyledShowMoreLabels>

					<StyledShowMoreChevron
						ref={chevronRef}
						aria-hidden="true"
						width="12"
						height="12"
						viewBox="0 0 256 256"
						fill="none"
					>
						<polyline
							points="208 96 128 176 48 96"
							stroke="currentColor"
							strokeWidth="16"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</StyledShowMoreChevron>
				</StyledShowMoreButton>
			</StyledShowMoreActions>
		</StyledShowMoreRoot>
	);
}

export default ShowMore;
