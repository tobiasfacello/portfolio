//! React
import { useId, useRef, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useAutoHeight } from '../Accordion/useAccordion';
import { useCollapsibleBanner, type BannerState } from './useCollapsibleBanner';

//? Lib
import { SPRINGS, spring, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledBannerClip,
	StyledBanner,
	StyledBannerRow,
	StyledBannerGlyph,
	StyledBannerToggle,
	StyledBannerTitle,
	StyledBannerCaret,
	StyledBannerClose,
	StyledBannerBody,
	StyledBannerContent,
	StyledBannerDescription,
	StyledBannerAction,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const DISCLOSE = spring({ stiffness: 190, damping: 30, mass: 1 });

export type CollapsibleBannerProps = {
	title: ReactNode;
	description?: ReactNode;
	children?: ReactNode;
	action?: ReactNode;
	icon?: ReactNode;
	dismissible?: boolean;
	state?: BannerState;
	defaultState?: BannerState;
	onStateChange?: (state: BannerState) => void;
	onDismiss?: () => void;
	dismissLabel?: string;
	dismissedMessage?: string;
};

function CollapsibleBanner({
	title,
	description,
	children,
	action,
	icon,
	dismissible = true,
	state: controlled,
	defaultState = 'open',
	onStateChange,
	onDismiss,
	dismissLabel = 'Dismiss notice',
	dismissedMessage = 'Notice dismissed.',
}: CollapsibleBannerProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const uid = useId();
	const bodyId = `${uid}-body`;
	const titleId = `${uid}-title`;

	const { state, open, dismissed, toggle, fold, dismiss } = useCollapsibleBanner({
		state: controlled,
		defaultState,
		onStateChange,
		onDismiss,
	});

	const hasBody = Boolean(description || children || action);

	const outerRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const caretRef = useRef<HTMLSpanElement>(null);
	const { ref: contentRef, height, ready } = useAutoHeight();

	useGSAP(() => {
		const node = outerRef.current;
		if (!node) return;

		const disclose = motionSafe(DISCLOSE, prefersReducedMotion);
		gsap.to(node, {
			height: dismissed ? 0 : 'auto',
			opacity: dismissed ? 0 : 1,
			duration: disclose.duration,
			ease: disclose.ease,
		});
	}, [dismissed, prefersReducedMotion]);

	useGSAP(() => {
		const node = bodyRef.current;
		if (!node || !ready) return;

		const disclose = motionSafe(DISCLOSE, prefersReducedMotion);
		gsap.to(node, {
			height: open ? height : 0,
			duration: disclose.duration,
			ease: disclose.ease,
		});

		// Content fades slightly behind the height so it does not appear before
		// there is room for it, and leaves ahead of it on the way out.
		if (contentRef.current) {
			gsap.to(contentRef.current, {
				opacity: open ? 1 : 0,
				y: open ? 0 : -6,
				duration: prefersReducedMotion ? 0 : 0.14,
				delay: prefersReducedMotion || !open ? 0 : 0.05,
				ease: EASE_SMOOTH_OUT,
			});
		}
	}, [open, height, ready, prefersReducedMotion, contentRef]);

	useGSAP(() => {
		const node = caretRef.current;
		if (!node) return;

		const nudge = motionSafe(SPRINGS.snap, prefersReducedMotion);
		gsap.to(node, { rotate: open ? 180 : 0, duration: nudge.duration, ease: nudge.ease });
	}, [open, prefersReducedMotion]);

	return (
		<>
			<StyledBannerClip ref={outerRef}>
				<StyledBanner role="region" aria-labelledby={titleId}>
					<StyledBannerRow>
						<StyledBannerGlyph aria-hidden="true">
							{icon ?? (
								<svg width="16" height="16" viewBox="0 0 256 256" fill="none">
									<circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" />
									<polyline
										points="120 120 128 120 128 176 136 176"
										stroke="currentColor"
										strokeWidth="16"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<circle cx="124" cy="84" r="12" fill="currentColor" />
								</svg>
							)}
						</StyledBannerGlyph>

						{hasBody ? (
							<StyledBannerToggle
								type="button"
								onClick={toggle}
								// Escape folds rather than dismissing: the cheaper, more
								// reversible of the two intentions.
								onKeyDown={(e) => {
									if (e.key !== 'Escape' || !open) return;
									e.stopPropagation();
									fold();
								}}
								aria-expanded={open}
								aria-controls={bodyId}
							>
								<StyledBannerTitle id={titleId}>{title}</StyledBannerTitle>
								<StyledBannerCaret ref={caretRef} aria-hidden="true">
									<svg width="14" height="14" viewBox="0 0 256 256" fill="none">
										<polyline
											points="208 96 128 176 48 96"
											stroke="currentColor"
											strokeWidth="16"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</StyledBannerCaret>
							</StyledBannerToggle>
						) : (
							<StyledBannerTitle id={titleId}>{title}</StyledBannerTitle>
						)}

						{dismissible ? (
							<StyledBannerClose type="button" onClick={dismiss} aria-label={dismissLabel}>
								<svg width="13" height="13" viewBox="0 0 256 256" fill="none" aria-hidden="true">
									<line
										x1="200"
										y1="56"
										x2="56"
										y2="200"
										stroke="currentColor"
										strokeWidth="16"
										strokeLinecap="round"
									/>
									<line
										x1="200"
										y1="200"
										x2="56"
										y2="56"
										stroke="currentColor"
										strokeWidth="16"
										strokeLinecap="round"
									/>
								</svg>
							</StyledBannerClose>
						) : null}
					</StyledBannerRow>

					{hasBody ? (
						<StyledBannerBody ref={bodyRef} id={bodyId} inert={!open}>
							<StyledBannerContent ref={contentRef}>
								{description ? (
									<StyledBannerDescription>{description}</StyledBannerDescription>
								) : null}
								{children}
								{action ? <StyledBannerAction>{action}</StyledBannerAction> : null}
							</StyledBannerContent>
						</StyledBannerBody>
					) : null}
				</StyledBanner>
			</StyledBannerClip>

			<StyledVisuallyHidden role="status" aria-live="polite">
				{state === 'dismissed' ? dismissedMessage : ''}
			</StyledVisuallyHidden>
		</>
	);
}

export default CollapsibleBanner;
