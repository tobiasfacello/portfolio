//! React
import { useEffect, useMemo, useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import {
	useAccordion,
	useAutoHeight,
	type AccordionHeaderProps,
	type AccordionPanelProps,
} from './useAccordion';

//? Lib
import { SPRINGS, spring, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledAccordion,
	StyledAccordionRow,
	StyledAccordionHeader,
	StyledAccordionTitle,
	StyledAccordionMeta,
	StyledChevron,
	StyledAccordionClip,
	StyledAccordionPanel,
	StyledAccordionContent,
} from './styled';

const DISCLOSE = spring({ stiffness: 480, damping: 40, mass: 0.6 });
const NONE: readonly string[] = [];

export type AccordionItem = {
	id: string;
	title: ReactNode;
	content: ReactNode;
	meta?: ReactNode;
};

export type AccordionProps = {
	items: readonly AccordionItem[];
	type?: 'single' | 'multiple';
	defaultOpen?: readonly string[];
	open?: readonly string[];
	onOpenChange?: (open: string[]) => void;
	collapsible?: boolean;
	/** Beyond this the panel scrolls instead of growing, in px. */
	maxPanelHeight?: number;
	headingLevel?: number;
};

type AccordionRowProps = {
	item: AccordionItem;
	open: boolean;
	reducedMotion: boolean;
	maxPanelHeight: number;
	headingLevel: number;
	header: AccordionHeaderProps;
	panel: AccordionPanelProps;
};

function AccordionRow({
	item,
	open,
	reducedMotion,
	maxPanelHeight,
	headingLevel,
	header,
	panel,
}: AccordionRowProps) {
	const { ref, height, ready } = useAutoHeight();
	const clipRef = useRef<HTMLDivElement>(null);
	const chevronRef = useRef<SVGSVGElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// A collapsed panel still occupies the DOM, so its controls are taken out of
	// the tab order rather than left reachable behind a zero-height clip.
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		el.inert = !open;
		return () => {
			el.inert = false;
		};
	}, [ref, open]);

	useGSAP(() => {
		const clip = clipRef.current;
		if (!clip || !ready) return;

		const disclose = motionSafe(DISCLOSE, reducedMotion);
		gsap.to(clip, {
			height: open ? height : 0,
			duration: disclose.duration,
			ease: disclose.ease,
		});
	}, [open, height, ready, reducedMotion]);

	useGSAP(() => {
		const chevron = chevronRef.current;
		if (!chevron) return;

		const turn = motionSafe(SPRINGS.snap, reducedMotion);
		gsap.to(chevron, { rotate: open ? 180 : 0, duration: turn.duration, ease: turn.ease });
	}, [open, reducedMotion]);

	// Content fades slightly behind the height so text does not appear before
	// there is room for it.
	useGSAP(() => {
		const content = contentRef.current;
		if (!content) return;

		gsap.to(content, {
			opacity: open ? 1 : 0,
			duration: reducedMotion ? 0 : open ? 0.18 : 0.14,
			ease: open ? EASE_SMOOTH_OUT : 'power2.in',
		});
	}, [open, reducedMotion]);

	return (
		<StyledAccordionRow>
			<div role="heading" aria-level={headingLevel}>
				<StyledAccordionHeader {...header} $open={open}>
					<StyledAccordionTitle>{item.title}</StyledAccordionTitle>
					{item.meta ? <StyledAccordionMeta>{item.meta}</StyledAccordionMeta> : null}
					<StyledChevron
						ref={chevronRef}
						width="13"
						height="13"
						viewBox="0 0 256 256"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M208 96l-80 80-80-80"
							stroke="currentColor"
							strokeWidth="16"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</StyledChevron>
				</StyledAccordionHeader>
			</div>

			<StyledAccordionClip ref={clipRef} style={{ height: open ? undefined : 0 }}>
				<StyledAccordionPanel {...panel} ref={ref} $maxHeight={maxPanelHeight}>
					<StyledAccordionContent ref={contentRef} style={{ opacity: open ? 1 : 0 }}>
						{item.content}
					</StyledAccordionContent>
				</StyledAccordionPanel>
			</StyledAccordionClip>
		</StyledAccordionRow>
	);
}

function Accordion({
	items,
	type = 'single',
	defaultOpen = NONE,
	open: controlled,
	onOpenChange,
	collapsible = true,
	maxPanelHeight = 220,
	headingLevel = 3,
}: AccordionProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const entries = useMemo(() => items.map(({ id }) => ({ id })), [items]);

	const { isOpen, headerProps, panelProps } = useAccordion({
		items: entries,
		type,
		defaultOpen,
		open: controlled,
		onOpenChange,
		collapsible,
	});

	return (
		<StyledAccordion>
			{items.map((item) => (
				<AccordionRow
					key={item.id}
					item={item}
					open={isOpen(item.id)}
					reducedMotion={prefersReducedMotion}
					maxPanelHeight={maxPanelHeight}
					headingLevel={headingLevel}
					header={headerProps(item.id)}
					panel={panelProps(item.id)}
				/>
			))}
		</StyledAccordion>
	);
}

export default Accordion;
