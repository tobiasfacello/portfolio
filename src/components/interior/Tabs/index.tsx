//! React
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

//? Variants
import type { ControlSize } from '../shared/variants';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useTabs, type TabItem, type TabsActivation } from './useTabs';

//? Lib
import { spring, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledTabsRoot,
	StyledTabList,
	StyledTabIndicator,
	StyledTab,
	StyledTabLabel,
	StyledTabPanel,
} from './styled';

const INDICATOR = spring({ stiffness: 620, damping: 42, mass: 0.35 });
const PANEL = spring({ stiffness: 460, damping: 38, mass: 0.8 });

export type TabsProps = {
	size?: ControlSize;
	items: TabItem[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	activation?: TabsActivation;
	renderPanel?: (value: string) => ReactNode;
	label?: string;
};

function Tabs({
	size = 'md',
	items,
	value,
	defaultValue,
	onValueChange,
	activation = 'automatic',
	renderPanel,
	label = 'Tabs',
}: TabsProps) {
	const tabs = useTabs({ items, value, defaultValue, onValueChange, activation });
	const prefersReducedMotion = usePrefersReducedMotion();

	const rowRef = useRef<HTMLDivElement>(null);
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const indicatorRef = useRef<HTMLSpanElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	const [plateau, setPlateau] = useState({ x: 0, width: 0, ready: false });

	const selectedIndex = items.findIndex((item) => item.value === tabs.value);

	// The indicator is measured from the real tab rather than computed, so it
	// stays correct after a font swap or a container resize.
	useLayoutEffect(() => {
		const node = tabRefs.current[selectedIndex];
		if (!node) return;

		const read = () => {
			setPlateau((prev) =>
				prev.x === node.offsetLeft && prev.width === node.offsetWidth && prev.ready
					? prev
					: { x: node.offsetLeft, width: node.offsetWidth, ready: true },
			);
		};

		read();
		const row = rowRef.current;
		if (!row) return;
		const observer = new ResizeObserver(read);
		observer.observe(row);
		return () => observer.disconnect();
	}, [selectedIndex, items]);

	useGSAP(() => {
		const node = indicatorRef.current;
		if (!node || !plateau.ready) return;

		const move = motionSafe(INDICATOR, prefersReducedMotion);
		gsap.to(node, {
			x: plateau.x,
			width: plateau.width,
			opacity: 1,
			duration: move.duration,
			ease: move.ease,
		});
	}, [plateau, prefersReducedMotion]);

	// The panel enters from the side the selection came from, so the movement
	// tells you which way you went.
	useGSAP(() => {
		const node = panelRef.current;
		if (!node || !renderPanel) return;

		const slide = motionSafe(PANEL, prefersReducedMotion);
		gsap.fromTo(
			node,
			{ opacity: 0, x: prefersReducedMotion ? 0 : tabs.direction * 12 },
			{ opacity: 1, x: 0, duration: slide.duration, ease: slide.ease },
		);
	}, [tabs.value, prefersReducedMotion]);

	return (
		<StyledTabsRoot>
			<StyledTabList {...tabs.tabListProps} ref={rowRef} aria-label={label}>
				<StyledTabIndicator ref={indicatorRef} aria-hidden="true" style={{ opacity: 0 }} />

				{items.map((item, index) => {
					const selected = item.value === tabs.value;
					const { ref: tabRef, ...tabProps } = tabs.getTabProps(item, index);

					return (
						<StyledTab $size={size}
							key={item.value}
							{...tabProps}
							ref={(node) => {
								tabRef(node);
								tabRefs.current[index] = node;
							}}
							$selected={selected}
							$disabled={item.disabled}
						>
							<StyledTabLabel>
								<span data-ghost aria-hidden="true">
									{item.label}
								</span>
								<span
									style={{
										fontWeight: selected
											? 'var(--font-weight-semibold)'
											: 'var(--font-weight-medium)',
									}}
								>
									{item.label}
								</span>
							</StyledTabLabel>
						</StyledTab>
					);
				})}
			</StyledTabList>

			{renderPanel ? (
				<StyledTabPanel ref={panelRef} {...tabs.getPanelProps(tabs.value)}>
					{renderPanel(tabs.value)}
				</StyledTabPanel>
			) : null}
		</StyledTabsRoot>
	);
}

export default Tabs;
