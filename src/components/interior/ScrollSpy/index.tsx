//! React
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useScrollSpy, type ScrollSpySection } from './useScrollSpy';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledSpyNav,
	StyledSpyRail,
	StyledSpyList,
	StyledSpyItem,
	StyledSpyThumb,
	StyledSpyLink,
	StyledSpyLabel,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type ScrollSpyProps = {
	sections: ScrollSpySection[];
	offset?: number;
	root?: React.RefObject<HTMLElement | null>;
	onChange?: (id: string) => void;
	label?: string;
};

function ScrollSpy({
	sections,
	offset = 96,
	root,
	onChange,
	label = 'On this page',
}: ScrollSpyProps) {
	const { activeId, activeIndex, getLinkProps, announce } = useScrollSpy({
		sections,
		offset,
		root,
		onChange,
	});
	const prefersReducedMotion = usePrefersReducedMotion();

	const listRef = useRef<HTMLOListElement>(null);
	const chipsRef = useRef<(HTMLLIElement | null)[]>([]);
	const thumbRef = useRef<HTMLSpanElement>(null);
	const [box, setBox] = useState({ x: 0, width: 0, ready: false });

	// Measured from the real chip so it survives a font swap or a resize.
	useLayoutEffect(() => {
		const node = chipsRef.current[activeIndex];
		const list = listRef.current;
		if (!node || !list) return;

		const read = () => {
			setBox((prev) =>
				prev.x === node.offsetLeft && prev.width === node.offsetWidth && prev.ready
					? prev
					: { x: node.offsetLeft, width: node.offsetWidth, ready: true },
			);
		};

		read();
		const observer = new ResizeObserver(read);
		observer.observe(list);
		return () => observer.disconnect();
	}, [activeIndex, sections]);

	useGSAP(() => {
		const node = thumbRef.current;
		if (!node || !box.ready) return;

		const move = motionSafe(SPRINGS.cell, prefersReducedMotion);
		gsap.to(node, {
			x: box.x,
			width: box.width,
			opacity: activeIndex < 0 ? 0 : 1,
			duration: move.duration,
			ease: move.ease,
		});
	}, [box, activeIndex, prefersReducedMotion]);

	// Keeps the active chip visible when the rail scrolls horizontally.
	useEffect(() => {
		chipsRef.current[activeIndex]?.scrollIntoView({
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
			block: 'nearest',
			inline: 'nearest',
		});
	}, [activeIndex, prefersReducedMotion]);

	return (
		<StyledSpyNav aria-label={label}>
			<StyledSpyRail>
				<StyledSpyThumb ref={thumbRef} aria-hidden="true" />

				<StyledSpyList ref={listRef}>
					{sections.map((section, i) => {
						const active = section.id === activeId;
						return (
							<StyledSpyItem
								key={section.id}
								ref={(node) => {
									chipsRef.current[i] = node;
								}}
							>
								<StyledSpyLink {...getLinkProps(section.id)} $active={active}>
									<StyledSpyLabel>
										<span data-ghost aria-hidden="true">
											{section.label}
										</span>
										<span
											style={{
												fontWeight: active
													? 'var(--font-weight-semibold)'
													: 'var(--font-weight-medium)',
											}}
										>
											{section.label}
										</span>
									</StyledSpyLabel>
								</StyledSpyLink>
							</StyledSpyItem>
						);
					})}
				</StyledSpyList>
			</StyledSpyRail>

			<StyledVisuallyHidden as="p" aria-live="polite">
				{announce}
			</StyledVisuallyHidden>
		</StyledSpyNav>
	);
}

export default ScrollSpy;
