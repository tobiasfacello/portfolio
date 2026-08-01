//! React
import { useEffect, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useTaskSteps, type UseTaskStepsOptions } from './useTaskSteps';

//* Styled
import {
	StyledStepList,
	StyledStepRow,
	StyledStepMarker,
	StyledStepBadge,
	StyledStepDot,
	StyledStepSpinner,
	StyledStepLabel,
	StyledStepShimmer,
	StyledStepMeta,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type TaskStepsProps = UseTaskStepsOptions & {
	label?: string;
};

function TaskSteps({ steps, current, failed = false, label = 'Task progress' }: TaskStepsProps) {
	const { rows, complete, sentence } = useTaskSteps({ steps, current, failed });
	const prefersReducedMotion = usePrefersReducedMotion();
	const spinnerRef = useRef<SVGSVGElement>(null);

	useGSAP(() => {
		const node = spinnerRef.current;
		if (!node || prefersReducedMotion) return;

		const tween = gsap.to(node, { rotate: 360, duration: 0.8, ease: 'none', repeat: -1 });
		return () => {
			tween.kill();
		};
	}, [current, failed, prefersReducedMotion]);

	// Steps can advance faster than a screen reader can speak; only the state
	// that holds for half a second is announced.
	const [spoken, setSpoken] = useState('');
	useEffect(() => {
		if (!sentence) return;
		const timer = setTimeout(() => setSpoken(sentence), 500);
		return () => clearTimeout(timer);
	}, [sentence]);

	return (
		<div style={{ width: '100%' }}>
			<StyledStepList aria-label={label}>
				{rows.map((row) => (
					<StyledStepRow
						key={row.id}
						aria-current={row.status === 'active' ? 'step' : undefined}
					>
						<StyledStepMarker>
							{row.status === 'done' ? (
								<StyledStepBadge $tone="success">
									<svg viewBox="0 0 256 256" width="11" height="11" fill="none" aria-hidden="true">
										<polyline
											points="216 72 104 184 48 128"
											stroke="currentColor"
											strokeWidth="26"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</StyledStepBadge>
							) : row.status === 'error' ? (
								<StyledStepBadge $tone="danger">
									<svg viewBox="0 0 256 256" width="10" height="10" fill="none" aria-hidden="true">
										<path
											d="M200 56 56 200 M56 56l144 144"
											stroke="currentColor"
											strokeWidth="26"
											strokeLinecap="round"
										/>
									</svg>
								</StyledStepBadge>
							) : row.status === 'active' ? (
								<StyledStepSpinner ref={spinnerRef} viewBox="0 0 16 16" aria-hidden="true">
									<circle
										cx="8"
										cy="8"
										r="6"
										fill="none"
										stroke="currentColor"
										strokeOpacity="0.25"
										strokeWidth="2"
									/>
									<path
										d="M8 2 a6 6 0 0 1 6 6"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</StyledStepSpinner>
							) : (
								<StyledStepDot />
							)}
						</StyledStepMarker>

						{row.status === 'active' ? (
							<StyledStepShimmer as="span" $status={row.status}>
								{row.label}
							</StyledStepShimmer>
						) : (
							<StyledStepLabel $status={row.status}>{row.label}</StyledStepLabel>
						)}

						{row.meta ? (
							<StyledStepMeta $visible={row.status === 'done'} aria-hidden={row.status !== 'done'}>
								{row.meta}
							</StyledStepMeta>
						) : null}
					</StyledStepRow>
				))}
			</StyledStepList>

			<StyledVisuallyHidden role="status">{spoken}</StyledVisuallyHidden>
			<StyledVisuallyHidden aria-live={complete || failed ? 'polite' : 'off'}>
				{complete ? 'Run complete' : failed ? 'Run failed' : ''}
			</StyledVisuallyHidden>
		</div>
	);
}

export default TaskSteps;
