//! React
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';

//? Variants
import type { ControlSize, ControlTone } from '../shared/variants';

//! GSAP
import { gsap } from '../../../lib/gsap';

//? Hooks
import { usePresence } from '../../../hooks/usePresence';
import {
	usePopover,
	SIDE_OFFSET,
	type PopoverAlign,
	type PopoverSide,
} from '../shared/usePopover';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT } from '../../../lib/motion';

//* Styled
import {
	StyledPopoverTrigger,
	StyledFloating,
	StyledPopoverPanel,
	StyledPopoverArrow,
	StyledPopoverContent,
} from './styled';

export type PopoverProps = {
	size?: ControlSize;
	tone?: ControlTone;
	trigger: ReactNode;
	children: ReactNode;
	/** Accessible name for the panel. */
	label: string;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	side?: PopoverSide;
	align?: PopoverAlign;
	offset?: number;
	padding?: number;
	arrowSize?: number;
	boundary?: React.RefObject<HTMLElement | null>;
};

function Popover({
	size = 'md',
	tone = 'default',
	trigger,
	children,
	label,
	open: controlled,
	defaultOpen = false,
	onOpenChange,
	side = 'bottom',
	align = 'center',
	offset = 10,
	padding = 8,
	arrowSize = 9,
	boundary,
}: PopoverProps) {
	const [uncontrolled, setUncontrolled] = useState(defaultOpen);
	const open = controlled ?? uncontrolled;

	const id = useId();

	const notify = useRef(onOpenChange);
	notify.current = onOpenChange;

	const {
		anchorRef,
		floatingRef,
		panelRef,
		contentRef,
		arrowRef,
		side: at,
	} = usePopover<HTMLButtonElement>({ open, side, align, offset, padding, arrowSize, boundary });

	const setOpen = useCallback(
		(next: boolean) => {
			if (controlled === undefined) setUncontrolled(next);
			notify.current?.(next);
		},
		[controlled],
	);

	const { isMounted, ref: presenceRef } = usePresence<HTMLDivElement>(open, {
		enter: (_element, { reducedMotion }) => {
			const panel = panelRef.current;
			if (!panel) return;

			const from = SIDE_OFFSET[at];
			return gsap.fromTo(
				panel,
				{
					opacity: 0,
					scale: reducedMotion ? 1 : 0.95,
					x: reducedMotion ? 0 : from.x,
					y: reducedMotion ? 0 : from.y,
				},
				{
					opacity: 1,
					scale: 1,
					x: 0,
					y: 0,
					duration: reducedMotion ? 0 : SPRINGS.crossfade.duration,
					ease: SPRINGS.crossfade.ease,
				},
			);
		},
		exit: (_element, { reducedMotion }) => {
			const panel = panelRef.current;
			if (!panel) return;

			return gsap.to(panel, {
				opacity: 0,
				scale: reducedMotion ? 1 : 0.97,
				duration: reducedMotion ? 0 : 0.13,
				ease: EASE_SMOOTH_OUT,
			});
		},
	});

	const setFloating = useCallback(
		(node: HTMLDivElement | null) => {
			presenceRef.current = node;
			floatingRef.current = node;
		},
		[presenceRef, floatingRef],
	);

	useEffect(() => {
		if (!open) return;
		panelRef.current?.focus({ preventScroll: true });
	}, [open, panelRef]);

	useEffect(() => {
		if (!open) return;

		const onPointerDown = (event: PointerEvent) => {
			const target = event.target as Node | null;
			if (!target) return;
			if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
			setOpen(false);
		};

		// Escape returns focus to the trigger — closing a panel should never drop
		// the caret back at the top of the document.
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			event.stopPropagation();
			anchorRef.current?.focus({ preventScroll: true });
			setOpen(false);
		};

		document.addEventListener('pointerdown', onPointerDown, true);
		document.addEventListener('keydown', onKeyDown, true);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown, true);
			document.removeEventListener('keydown', onKeyDown, true);
		};
	}, [open, setOpen, anchorRef, panelRef]);

	return (
		<>
			<StyledPopoverTrigger $size={size} $tone={tone}
				ref={anchorRef}
				type="button"
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-controls={open ? id : undefined}
				onClick={() => setOpen(!open)}
			>
				{trigger}
			</StyledPopoverTrigger>

			{isMounted ? (
				<StyledFloating
					ref={setFloating}
					onBlurCapture={(event) => {
						const next = event.relatedTarget as Node | null;
						if (!next) return;
						if (panelRef.current?.contains(next) || anchorRef.current?.contains(next)) return;
						setOpen(false);
					}}
				>
					<StyledPopoverPanel ref={panelRef} id={id} role="dialog" aria-label={label} tabIndex={-1}>
						<StyledPopoverArrow ref={arrowRef} aria-hidden="true" $side={at} $size={arrowSize} />
						<StyledPopoverContent ref={contentRef}>{children}</StyledPopoverContent>
					</StyledPopoverPanel>
				</StyledFloating>
			) : null}
		</>
	);
}

export default Popover;
