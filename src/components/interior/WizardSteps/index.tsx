//! React
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useWizard, type WizardDirection } from './useWizard';

//? Lib
import { SPRINGS, spring, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledWizardRoot,
	StyledWizardTitles,
	StyledWizardRail,
	StyledWizardStep,
	StyledWizardTileButton,
	StyledWizardTile,
	StyledWizardConnector,
	StyledWizardConnectorFill,
	StyledWizardViewport,
	StyledWizardPanel,
	StyledWizardComplete,
	StyledWizardActions,
	StyledWizardBack,
	StyledWizardAdvance,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const RAIL = spring({ stiffness: 520, damping: 40, mass: 0.5 });

export type WizardStep = {
	id: string;
	label: string;
	content: ReactNode;
};

export type WizardStepsProps = {
	steps: WizardStep[];
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number, direction: WizardDirection) => void;
	onComplete?: () => void;
	complete?: boolean;
	height?: number;
	backLabel?: string;
	nextLabel?: string;
	finishLabel?: string;
	completeLabel?: string;
	completeHint?: string;
	label?: string;
};

function WizardSteps({
	steps,
	index,
	defaultIndex = 0,
	onIndexChange,
	onComplete,
	complete = false,
	height = 184,
	backLabel = 'Back',
	nextLabel = 'Next',
	finishLabel = 'Finish',
	completeLabel = 'All set',
	completeHint = 'Step back to change anything',
	label = 'Steps',
}: WizardStepsProps) {
	const wizard = useWizard({ total: steps.length, index, defaultIndex, onIndexChange, onComplete });
	const prefersReducedMotion = usePrefersReducedMotion();

	const listRef = useRef<HTMLOListElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const titlesRef = useRef<(HTMLSpanElement | null)[]>([]);
	const tilesRef = useRef<(HTMLSpanElement | null)[]>([]);
	const fillsRef = useRef<(HTMLSpanElement | null)[]>([]);
	const nextRef = useRef<HTMLSpanElement>(null);
	const finishRef = useRef<HTMLSpanElement>(null);
	/** Where focus should land after the index changes. */
	const intent = useRef<'list' | 'panel' | null>(null);

	const { index: at, direction, furthest, total, isFirst, isLast, next, back, goTo } = wizard;

	// Focus follows the control that caused the move: the rail keeps focus on the
	// rail, the buttons hand it to the panel that just arrived.
	useEffect(() => {
		const move = intent.current;
		intent.current = null;
		if (move === 'list') {
			listRef.current?.querySelector<HTMLButtonElement>('button[data-current="true"]')?.focus();
			return;
		}
		if (move === 'panel') viewportRef.current?.focus({ preventScroll: true });
	}, [at]);

	useGSAP(() => {
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		titlesRef.current.forEach((node, i) => {
			if (!node) return;
			gsap.to(node, { opacity: i === at ? 1 : 0, duration: fade.duration, ease: fade.ease });
		});
	}, [at, prefersReducedMotion]);

	useGSAP(() => {
		const rail = motionSafe(RAIL, prefersReducedMotion);

		tilesRef.current.forEach((node, i) => {
			if (!node) return;
			gsap.to(node, {
				scale: !complete && i === at ? 1 : 0.92,
				duration: rail.duration,
				ease: rail.ease,
			});
		});

		fillsRef.current.forEach((node, i) => {
			if (!node) return;
			gsap.to(node, {
				scaleX: complete || i < at ? 1 : 0,
				duration: rail.duration,
				ease: rail.ease,
			});
		});
	}, [at, complete, prefersReducedMotion]);

	// The panel enters from the side the move came from, so the direction of
	// travel is legible without reading the step numbers.
	useGSAP(() => {
		const node = panelRef.current;
		if (!node) return;

		const slide = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		gsap.fromTo(
			node,
			{ opacity: 0, x: prefersReducedMotion ? 0 : direction * 22 },
			{ opacity: 1, x: 0, duration: slide.duration, ease: slide.ease },
		);
	}, [at, complete, prefersReducedMotion]);

	useGSAP(() => {
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		if (nextRef.current) {
			gsap.to(nextRef.current, { opacity: isLast ? 0 : 1, duration: fade.duration, ease: fade.ease });
		}
		if (finishRef.current) {
			gsap.to(finishRef.current, {
				opacity: isLast ? 1 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
	}, [isLast, prefersReducedMotion]);

	const onStepKeyDown = (e: KeyboardEvent<HTMLElement>) => {
		let target = at;
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = at + 1;
		else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = at - 1;
		else if (e.key === 'Home') target = 0;
		else if (e.key === 'End') target = furthest;
		else return;
		e.preventDefault();
		// Never past the furthest step actually reached.
		target = Math.min(Math.max(0, Math.min(total - 1, target)), furthest);
		if (target === at) return;
		intent.current = 'list';
		goTo(target);
	};

	const step = steps[at];
	if (!step) return null;

	const position = `Step ${at + 1} of ${total}: ${step.label}`;
	const widestAdvance = finishLabel.length > nextLabel.length ? finishLabel : nextLabel;

	return (
		<StyledWizardRoot>
			<StyledVisuallyHidden as="p" aria-live="polite">
				{position}
			</StyledVisuallyHidden>

			<StyledWizardTitles aria-hidden="true">
				{steps.map((s, i) => (
					<span
						key={s.id}
						ref={(node) => {
							titlesRef.current[i] = node;
						}}
						style={{ opacity: i === at ? 1 : 0 }}
					>
						{s.label}
					</span>
				))}
			</StyledWizardTitles>

			<StyledWizardRail ref={listRef} aria-label={label}>
				{steps.map((s, i) => {
					const done = complete || i < at;
					const here = !complete && i === at;

					const tile = (
						<StyledWizardTile
							ref={(node) => {
								tilesRef.current[i] = node;
							}}
							aria-hidden="true"
							$done={done}
							$here={here}
						>
							{done ? (
								<svg width="12" height="12" viewBox="0 0 256 256" fill="none" aria-hidden="true">
									<polyline
										points="216 72 104 184 48 128"
										stroke="currentColor"
										strokeWidth="24"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							) : (
								i + 1
							)}
						</StyledWizardTile>
					);

					return (
						<StyledWizardStep key={s.id}>
							{i <= furthest ? (
								<StyledWizardTileButton
									type="button"
									data-current={here ? 'true' : undefined}
									tabIndex={here ? 0 : -1}
									aria-current={here ? 'step' : undefined}
									aria-label={`Step ${i + 1} of ${total}: ${s.label}`}
									onKeyDown={onStepKeyDown}
									onClick={() => {
										if (here) return;
										intent.current = 'list';
										goTo(i);
									}}
								>
									{tile}
								</StyledWizardTileButton>
							) : (
								<span>
									<StyledVisuallyHidden>{`Step ${i + 1} of ${total}: ${s.label}`}</StyledVisuallyHidden>
									{tile}
								</span>
							)}

							{i < total - 1 ? (
								<StyledWizardConnector aria-hidden="true">
									<StyledWizardConnectorFill
										ref={(node) => {
											fillsRef.current[i] = node;
										}}
										style={{ transform: 'scaleX(0)' }}
									/>
								</StyledWizardConnector>
							) : null}
						</StyledWizardStep>
					);
				})}
			</StyledWizardRail>

			<StyledWizardViewport ref={viewportRef} tabIndex={-1} role="group" aria-label={position} $height={height}>
				<StyledWizardPanel ref={panelRef}>
					{complete ? (
						<StyledWizardComplete>
							<span>{completeLabel}</span>
							<StyledVisuallyHidden as="span">{completeHint}</StyledVisuallyHidden>
							<span style={{ opacity: 'var(--opacity-text-muted)' }}>{completeHint}</span>
						</StyledWizardComplete>
					) : (
						step.content
					)}
				</StyledWizardPanel>
			</StyledWizardViewport>

			<StyledWizardActions>
				{isFirst ? null : (
					<StyledWizardBack
						type="button"
						onClick={() => {
							intent.current = 'panel';
							back();
						}}
					>
						{backLabel}
					</StyledWizardBack>
				)}

				{complete ? null : (
					<StyledWizardAdvance
						type="button"
						aria-label={isLast ? finishLabel : nextLabel}
						onClick={() => {
							if (!isLast) intent.current = 'panel';
							next();
						}}
					>
						<span data-ghost aria-hidden="true">
							{widestAdvance}
						</span>
						<span ref={nextRef} aria-hidden="true">
							{nextLabel}
						</span>
						<span ref={finishRef} aria-hidden="true" style={{ opacity: 0 }}>
							{finishLabel}
						</span>
					</StyledWizardAdvance>
				)}
			</StyledWizardActions>
		</StyledWizardRoot>
	);
}

export default WizardSteps;
