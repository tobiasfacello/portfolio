//! React
import { useEffect, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { usePagination, type UsePaginationOptions } from './usePagination';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	SLOT_GAP,
	StyledPaginationNav,
	StyledPaginationRow,
	StyledPaginationArrow,
	StyledPaginationTrack,
	StyledPaginationThumb,
	StyledPaginationList,
	StyledPaginationSlot,
	StyledPaginationGap,
	StyledPageButton,
	StyledPageDigits,
	StyledChevron,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

/** Slots widen with the page count so four-digit pages still fit. */
const slotFor = (digits: number) => Math.max(32, 18 + digits * 8);

export type PaginationProps = UsePaginationOptions & {
	label?: string;
};

function Chevron({ flip = false }: { flip?: boolean }) {
	return (
		<StyledChevron viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" $flip={flip}>
			<path
				d="M4.75 2.75 8 6l-3.25 3.25"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</StyledChevron>
	);
}

function Pagination({
	count,
	page,
	defaultPage,
	siblings,
	boundaries,
	onPageChange,
	label = 'Pagination',
}: PaginationProps) {
	const pagination = usePagination({
		count,
		page,
		defaultPage,
		siblings,
		boundaries,
		onPageChange,
	});
	const { items, direction, thumbIndex, canPrev, canNext } = pagination;
	const current = pagination.page;

	const prefersReducedMotion = usePrefersReducedMotion();
	const digits = String(Math.max(1, count)).length;
	const slot = slotFor(digits);

	const thumbRef = useRef<HTMLSpanElement>(null);
	const listRef = useRef<HTMLOListElement>(null);

	useGSAP(() => {
		const node = thumbRef.current;
		if (!node) return;

		const move = motionSafe(SPRINGS.cell, prefersReducedMotion);
		gsap.to(node, {
			x: thumbIndex * (slot + SLOT_GAP),
			opacity: thumbIndex < 0 ? 0 : 1,
			duration: move.duration,
			ease: move.ease,
		});
	}, [thumbIndex, slot, prefersReducedMotion]);

	// Digits slide in from the direction the page moved, so the list reads as
	// having scrolled rather than swapped.
	useGSAP(
		() => {
			if (prefersReducedMotion || !listRef.current) return;

			const digitsNodes = listRef.current.querySelectorAll('[data-page-digits]');
			gsap.fromTo(
				digitsNodes,
				{ opacity: 0, x: 8 * direction },
				{ opacity: 1, x: 0, duration: 0.18, ease: EASE_SMOOTH_OUT },
			);
		},
		{ dependencies: [current, prefersReducedMotion], scope: listRef },
	);

	const [spoken, setSpoken] = useState('');
	useEffect(() => {
		const timer = setTimeout(() => setSpoken(`Page ${current} of ${Math.max(1, count)}`), 500);
		return () => clearTimeout(timer);
	}, [current, count]);

	return (
		<StyledPaginationNav aria-label={label}>
			<StyledPaginationRow>
				<StyledPaginationArrow
					type="button"
					aria-label="Previous page"
					aria-disabled={!canPrev}
					onClick={() => canPrev && pagination.prev()}
					$enabled={canPrev}
				>
					<Chevron flip />
				</StyledPaginationArrow>

				<StyledPaginationTrack>
					<StyledPaginationThumb ref={thumbRef} aria-hidden="true" $width={slot} />

					<StyledPaginationList ref={listRef}>
						{items.map((item) => {
							if (typeof item !== 'number') {
								return (
									<StyledPaginationGap key={item} aria-hidden="true" $width={slot}>
										…
									</StyledPaginationGap>
								);
							}

							const selected = item === current;
							return (
								<StyledPaginationSlot key={`slot-${item}`} $width={slot}>
									<StyledPageButton
										type="button"
										aria-label={`Page ${item}`}
										aria-current={selected ? 'page' : undefined}
										onClick={() => pagination.goTo(item)}
										$selected={selected}
									>
										<StyledPageDigits data-page-digits>{item}</StyledPageDigits>
									</StyledPageButton>
								</StyledPaginationSlot>
							);
						})}
					</StyledPaginationList>
				</StyledPaginationTrack>

				<StyledPaginationArrow
					type="button"
					aria-label="Next page"
					aria-disabled={!canNext}
					onClick={() => canNext && pagination.next()}
					$enabled={canNext}
				>
					<Chevron />
				</StyledPaginationArrow>
			</StyledPaginationRow>

			<StyledVisuallyHidden role="status">{spoken}</StyledVisuallyHidden>
		</StyledPaginationNav>
	);
}

export default Pagination;
