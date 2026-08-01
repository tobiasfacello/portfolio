//! React
import { useCallback, useRef } from 'react';

//? Variants
import type { ControlSize, ControlTone } from '../shared/variants';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { usePresence } from '../../../hooks/usePresence';
import { useDropdown, type DropdownItem } from './useDropdown';

//? Lib
import { SPRINGS, spring, motionSafe } from '../../../lib/motion';

//* Styled
import {
	ROW_HEIGHT,
	StyledDropdownRoot,
	StyledDropdownTrigger,
	StyledDropdownCaret,
	StyledDropdownPanel,
	StyledDropdownList,
	StyledDropdownHighlight,
	StyledDropdownItem,
	StyledDropdownItemBody,
	StyledDropdownItemLabel,
	StyledDropdownItemHint,
	StyledDropdownCheck,
	StyledDropdownEmpty,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const OPEN = spring({ stiffness: 620, damping: 38, mass: 0.6 });

export type DropdownProps = {
	size?: ControlSize;
	tone?: ControlTone;
	items: DropdownItem[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	emptyLabel?: string;
};

function Dropdown({
	size = 'md',
	tone = 'default',
	items,
	value,
	defaultValue,
	onChange,
	label = 'Options',
	placeholder = 'Select an option',
	disabled = false,
	emptyLabel = 'Nothing to choose',
}: DropdownProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const {
		open,
		activeIndex,
		selectedIndex,
		selectedItem,
		rootRef,
		triggerProps,
		listProps,
		getItemProps,
	} = useDropdown({ items, value, defaultValue, onChange, disabled });

	const caretRef = useRef<SVGSVGElement>(null);
	const highlightRef = useRef<HTMLSpanElement>(null);
	const checksRef = useRef<(HTMLSpanElement | null)[]>([]);

	const { isMounted, ref: panelRef } = usePresence<HTMLDivElement>(open, {
		enter: (element, { reducedMotion }) =>
			gsap.fromTo(
				element,
				{
					opacity: 0,
					scale: reducedMotion ? 1 : 0.94,
					y: reducedMotion ? 0 : -8,
				},
				{
					opacity: 1,
					scale: 1,
					y: 0,
					duration: reducedMotion ? 0 : OPEN.duration,
					ease: OPEN.ease,
				},
			),
		exit: (element, { reducedMotion }) =>
			gsap.to(element, {
				opacity: 0,
				scale: reducedMotion ? 1 : 0.97,
				y: reducedMotion ? 0 : -6,
				duration: reducedMotion ? 0 : 0.12,
				ease: 'power2.in',
			}),
	});

	useGSAP(() => {
		const node = caretRef.current;
		if (!node) return;

		const nudge = motionSafe(SPRINGS.snap, prefersReducedMotion);
		gsap.to(node, { rotate: open ? 180 : 0, duration: nudge.duration, ease: nudge.ease });
	}, [open, prefersReducedMotion]);

	useGSAP(() => {
		const node = highlightRef.current;
		if (!node || !isMounted) return;

		const slide = motionSafe(SPRINGS.snap, prefersReducedMotion);
		gsap.to(node, {
			y: activeIndex < 0 ? 0 : activeIndex * ROW_HEIGHT,
			opacity: activeIndex < 0 ? 0 : 1,
			duration: slide.duration,
			ease: slide.ease,
		});
	}, [activeIndex, isMounted, prefersReducedMotion]);

	useGSAP(() => {
		if (!isMounted) return;

		const cell = motionSafe(SPRINGS.cell, prefersReducedMotion);
		items.forEach((_, i) => {
			const node = checksRef.current[i];
			if (!node) return;
			const picked = i === selectedIndex;
			gsap.to(node, {
				opacity: picked ? 1 : 0,
				scale: picked ? 1 : 0.7,
				duration: cell.duration,
				ease: cell.ease,
			});
		});
	}, [selectedIndex, items, isMounted, prefersReducedMotion]);

	const setPanel = useCallback(
		(node: HTMLDivElement | null) => {
			panelRef.current = node;
		},
		[panelRef],
	);

	return (
		<StyledDropdownRoot ref={rootRef}>
			<StyledDropdownTrigger $size={size} $tone={tone} {...triggerProps} $open={open}>
				<StyledVisuallyHidden>
					{label}: {selectedItem ? selectedItem.label : placeholder}
				</StyledVisuallyHidden>
				<span aria-hidden="true">{label}</span>

				<StyledDropdownCaret ref={caretRef} viewBox="0 0 12 12" aria-hidden="true">
					<path
						d="M3 4.75 6 7.75 9 4.75"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</StyledDropdownCaret>
			</StyledDropdownTrigger>

			{isMounted ? (
				<StyledDropdownPanel ref={setPanel}>
					<StyledDropdownList {...listProps} aria-label={label}>
						<StyledDropdownHighlight ref={highlightRef} aria-hidden="true" />

						{items.map((item, i) => (
							<StyledDropdownItem
								key={item.value}
								{...getItemProps(i)}
								$active={i === activeIndex && !item.disabled}
								$disabled={item.disabled}
							>
								<StyledDropdownItemBody>
									<StyledDropdownItemLabel>{item.label}</StyledDropdownItemLabel>
									{item.hint ? <StyledDropdownItemHint>{item.hint}</StyledDropdownItemHint> : null}
								</StyledDropdownItemBody>

								<StyledDropdownCheck
									ref={(node) => {
										checksRef.current[i] = node;
									}}
									aria-hidden="true"
								>
									<svg viewBox="0 0 14 14" width="14" height="14">
										<path
											d="M3 7.4 5.8 10.2 11 4.4"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</StyledDropdownCheck>
							</StyledDropdownItem>
						))}

						{items.length === 0 ? (
							<StyledDropdownEmpty role="presentation">{emptyLabel}</StyledDropdownEmpty>
						) : null}
					</StyledDropdownList>
				</StyledDropdownPanel>
			) : null}
		</StyledDropdownRoot>
	);
}

export default Dropdown;
