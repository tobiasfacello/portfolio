//! React
import { useEffect, useState } from 'react';

//! GSAP
import { gsap } from '../../../lib/gsap';

//? Hooks
import { usePresence } from '../../../hooks/usePresence';

//? Lib
import { spring, EASE_SMOOTH_OUT } from '../../../lib/motion';

//* Styled
import { StyledPillLayer, StyledNewItemsPill, StyledPillArrow } from './styled';
import { StyledVisuallyHidden } from '../shared/styled';
import type { NewItemsAnchor } from './useNewItems';

const ARRIVE = spring({ stiffness: 540, damping: 34, mass: 0.5 });

const defaultLabel = (n: number) => `${n} new ${n === 1 ? 'item' : 'items'}`;

export type NewItemsPillProps = {
	count: number;
	onJump: () => void;
	anchor?: NewItemsAnchor;
	label?: (count: number) => string;
	/** Counts above this are shown as "N+". */
	max?: number;
};

function NewItemsPill({
	count,
	onJump,
	anchor = 'top',
	label = defaultLabel,
	max = 99,
}: NewItemsPillProps) {
	// A fast-moving feed would otherwise announce every single arrival; only the
	// count that settles is read out.
	const [announced, setAnnounced] = useState(0);
	useEffect(() => {
		if (count === 0) {
			setAnnounced(0);
			return;
		}
		const timer = setTimeout(() => setAnnounced(count), 700);
		return () => clearTimeout(timer);
	}, [count]);

	const off = anchor === 'bottom' ? 10 : -10;

	const { isMounted, ref } = usePresence<HTMLButtonElement>(count > 0, {
		enter: (element, { reducedMotion }) =>
			gsap.fromTo(
				element,
				{ opacity: 0, scale: reducedMotion ? 1 : 0.94, y: reducedMotion ? 0 : off },
				{
					opacity: 1,
					scale: 1,
					y: 0,
					duration: reducedMotion ? 0 : ARRIVE.duration,
					ease: ARRIVE.ease,
				},
			),
		exit: (element, { reducedMotion }) =>
			gsap.to(element, {
				opacity: 0,
				scale: reducedMotion ? 1 : 0.96,
				y: reducedMotion ? 0 : off * 0.5,
				duration: reducedMotion ? 0 : 0.16,
				ease: EASE_SMOOTH_OUT,
			}),
	});

	const phrase = (n: number) => (n > max ? `${max}+ new items` : label(n));
	const text = phrase(count);

	return (
		<StyledPillLayer $anchor={anchor}>
			{isMounted ? (
				<StyledNewItemsPill ref={ref} type="button" onClick={onJump} aria-label={text}>
					<StyledPillArrow
						width="14"
						height="14"
						viewBox="0 0 256 256"
						fill="none"
						aria-hidden="true"
						$anchor={anchor}
					>
						<line
							x1="128"
							y1="216"
							x2="128"
							y2="48"
							stroke="currentColor"
							strokeWidth="16"
							strokeLinecap="round"
						/>
						<polyline
							points="56 120 128 48 200 120"
							stroke="currentColor"
							strokeWidth="16"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</StyledPillArrow>
					<span aria-hidden="true">{text}</span>
				</StyledNewItemsPill>
			) : null}

			<StyledVisuallyHidden role="status" aria-live="polite">
				{announced > 0 ? phrase(announced) : ''}
			</StyledVisuallyHidden>
		</StyledPillLayer>
	);
}

export default NewItemsPill;
