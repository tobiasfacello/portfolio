//! React
import { useCallback, useRef, type ReactNode } from 'react';

//? Variants
import type { SurfaceDensity } from '../shared/variants';
import { createPortal } from 'react-dom';

//! GSAP
import { gsap } from '../../../lib/gsap';

//? Hooks
import { usePresence } from '../../../hooks/usePresence';
import { useDialog } from '../shared/useDialog';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT } from '../../../lib/motion';

//* Styled
import {
	StyledOverlay,
	StyledBackdrop,
	StyledPanel,
	StyledPanelHeader,
	StyledPanelHeading,
	StyledPanelTitle,
	StyledPanelDescription,
	StyledPanelBody,
	StyledPanelFooter,
	StyledCloseButton,
} from './styled';

export type ModalProps = {
	density?: SurfaceDensity;
	open: boolean;
	onClose: () => void;
	title: ReactNode;
	description?: ReactNode;
	children?: ReactNode;
	footer?: ReactNode;
	closeLabel?: string;
	showClose?: boolean;
	closeOnEscape?: boolean;
	closeOnBackdrop?: boolean;
	lockScroll?: boolean;
	initialFocusRef?: React.RefObject<HTMLElement | null>;
	container?: HTMLElement | null;
	maxWidth?: number;
	maxHeight?: string;
};

function Modal({
	density = 'base',
	open,
	onClose,
	title,
	description,
	children,
	footer,
	closeLabel = 'Close dialog',
	showClose = true,
	closeOnEscape = true,
	closeOnBackdrop = true,
	lockScroll = true,
	initialFocusRef,
	container,
	maxWidth = 440,
	maxHeight = 'min(78vh, 620px)',
}: ModalProps) {
	const { target, titleId, descriptionId, overlayRef, panelRef, overlayProps, panelProps } =
		useDialog({
			open,
			onClose,
			closeOnEscape,
			closeOnBackdrop,
			lockScroll,
			initialFocusRef,
			container,
		});

	const backdropRef = useRef<HTMLDivElement>(null);

	const { isMounted, ref: presenceRef } = usePresence<HTMLDivElement>(open, {
		enter: (_element, { reducedMotion }) => {
			const timeline = gsap.timeline();

			if (backdropRef.current) {
				timeline.fromTo(
					backdropRef.current,
					{ opacity: 0 },
					{ opacity: 1, duration: reducedMotion ? 0 : 0.2, ease: EASE_SMOOTH_OUT },
					0,
				);
			}

			if (panelRef.current) {
				timeline.fromTo(
					panelRef.current,
					{ opacity: 0, scale: reducedMotion ? 1 : 0.96, y: reducedMotion ? 0 : 12 },
					{
						opacity: 1,
						scale: 1,
						y: 0,
						duration: reducedMotion ? 0 : SPRINGS.settle.duration,
						ease: SPRINGS.settle.ease,
					},
					0,
				);
			}

			return timeline;
		},
		// Leaving is faster than arriving and does not overshoot: the dialog is
		// getting out of the way, not presenting itself.
		exit: (_element, { reducedMotion }) => {
			const timeline = gsap.timeline();
			const duration = reducedMotion ? 0 : 0.15;

			if (panelRef.current) {
				timeline.to(
					panelRef.current,
					{ opacity: 0, scale: reducedMotion ? 1 : 0.98, y: reducedMotion ? 0 : 6, duration, ease: 'power2.in' },
					0,
				);
			}
			if (backdropRef.current) {
				timeline.to(backdropRef.current, { opacity: 0, duration, ease: 'power2.in' }, 0);
			}

			return timeline;
		},
	});

	const setOverlay = useCallback(
		(node: HTMLDivElement | null) => {
			presenceRef.current = node;
			overlayRef.current = node;
		},
		[presenceRef, overlayRef],
	);

	if (!target || !isMounted) return null;

	return createPortal(
		<StyledOverlay ref={setOverlay} {...overlayProps}>
			<StyledBackdrop ref={backdropRef} aria-hidden="true" />

			<StyledPanel
				ref={panelRef}
				{...panelProps}
				aria-describedby={description ? descriptionId : undefined}
				$maxWidth={maxWidth}
				$maxHeight={maxHeight}
			>
				<StyledPanelHeader $density={density}>
					<StyledPanelHeading>
						<StyledPanelTitle id={titleId}>{title}</StyledPanelTitle>
						{description ? (
							<StyledPanelDescription id={descriptionId}>{description}</StyledPanelDescription>
						) : null}
					</StyledPanelHeading>

					{showClose ? (
						<StyledCloseButton type="button" onClick={onClose} aria-label={closeLabel}>
							<svg
								width="14"
								height="14"
								viewBox="0 0 256 256"
								fill="none"
								stroke="currentColor"
								strokeWidth="16"
								strokeLinecap="round"
								aria-hidden="true"
							>
								<line x1="200" y1="56" x2="56" y2="200" />
								<line x1="200" y1="200" x2="56" y2="56" />
							</svg>
						</StyledCloseButton>
					) : null}
				</StyledPanelHeader>

				{children ? <StyledPanelBody $density={density}>{children}</StyledPanelBody> : null}
				{footer ? <StyledPanelFooter $density={density}>{footer}</StyledPanelFooter> : null}
			</StyledPanel>
		</StyledOverlay>,
		target,
	);
}

export default Modal;
