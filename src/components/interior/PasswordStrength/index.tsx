//! React
import { useRef } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import {
	usePasswordStrength,
	defaultPasswordRules,
	type PasswordRule,
} from './usePasswordStrength';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledStrengthRoot,
	StyledStrengthMeter,
	StyledStrengthSegment,
	StyledStrengthFill,
	StyledStrengthRow,
	StyledStrengthLabels,
	StyledGuessableFlag,
	StyledRuleList,
	StyledRuleRow,
	StyledRuleBox,
	StyledRuleFill,
	StyledRuleTick,
	StyledRuleLabel,
	type StrengthTone,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const defaultLabels = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'] as const;

function toneFor(score: number, max: number): StrengthTone {
	if (score === 0) return 'none';
	const ratio = score / max;
	if (ratio <= 0.34) return 'danger';
	if (ratio <= 0.67) return 'caution';
	return 'safe';
}

export type PasswordStrengthProps = {
	value: string;
	rules?: readonly PasswordRule[];
	labels?: readonly string[];
	announceDelay?: number;
	showRules?: boolean;
};

function PasswordStrength({
	value,
	rules = defaultPasswordRules,
	labels = defaultLabels,
	announceDelay = 700,
	showRules = true,
}: PasswordStrengthProps) {
	const {
		score,
		max,
		rules: evaluated,
		guessable,
		announcement,
	} = usePasswordStrength(value, { rules, labels, announceDelay });

	const prefersReducedMotion = usePrefersReducedMotion();
	const tone = toneFor(score, max);

	const fillsRef = useRef<(HTMLSpanElement | null)[]>([]);
	const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);
	const flagRef = useRef<HTMLSpanElement>(null);
	const ruleFillsRef = useRef<(HTMLSpanElement | null)[]>([]);
	const ruleTicksRef = useRef<(SVGSVGElement | null)[]>([]);

	useGSAP(() => {
		const cell = motionSafe(SPRINGS.cell, prefersReducedMotion);

		fillsRef.current.forEach((node, i) => {
			if (!node) return;
			const on = i < score;
			gsap.to(node, {
				scaleX: on ? 1 : 0,
				duration: cell.duration,
				// Segments light left to right rather than all at once, so the meter
				// reads as filling instead of switching.
				delay: prefersReducedMotion || !on ? 0 : i * 0.03,
				ease: cell.ease,
			});
		});
	}, [score, prefersReducedMotion]);

	useGSAP(() => {
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		const activeLabel = Math.min(score, labels.length - 1);

		labelsRef.current.forEach((node, i) => {
			if (!node) return;
			gsap.to(node, {
				opacity: i === activeLabel ? 1 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		});

		if (flagRef.current) {
			gsap.to(flagRef.current, {
				opacity: guessable ? 1 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
	}, [score, guessable, labels.length, prefersReducedMotion]);

	useGSAP(() => {
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		const cell = motionSafe(SPRINGS.cell, prefersReducedMotion);

		evaluated.forEach((rule, i) => {
			const fill = ruleFillsRef.current[i];
			if (fill) {
				gsap.to(fill, { opacity: rule.met ? 1 : 0, duration: fade.duration, ease: fade.ease });
			}
			const tick = ruleTicksRef.current[i];
			if (tick) {
				gsap.to(tick, {
					opacity: rule.met ? 1 : 0,
					scale: rule.met ? 1 : 0.6,
					duration: cell.duration,
					ease: cell.ease,
				});
			}
		});
	}, [evaluated, prefersReducedMotion]);

	return (
		<StyledStrengthRoot>
			<StyledStrengthMeter
				role="meter"
				aria-label="Password strength"
				aria-valuemin={0}
				aria-valuemax={max}
				aria-valuenow={score}
				aria-valuetext={labels[Math.min(score, labels.length - 1)] ?? ''}
				$segments={max}
			>
				{Array.from({ length: max }, (_, i) => (
					<StyledStrengthSegment key={i}>
						<StyledStrengthFill
							ref={(node) => {
								fillsRef.current[i] = node;
							}}
							$tone={tone}
							style={{ transform: 'scaleX(0)' }}
						/>
					</StyledStrengthSegment>
				))}
			</StyledStrengthMeter>

			<StyledStrengthRow>
				<StyledStrengthLabels aria-hidden="true" $tone={tone}>
					{labels.map((text, i) => (
						<span
							key={text}
							ref={(node) => {
								labelsRef.current[i] = node;
							}}
							style={{ opacity: i === 0 ? 1 : 0 }}
						>
							{text}
						</span>
					))}
				</StyledStrengthLabels>

				<StyledGuessableFlag ref={flagRef} aria-hidden="true">
					Commonly guessed
				</StyledGuessableFlag>
			</StyledStrengthRow>

			{showRules ? (
				<StyledRuleList>
					{evaluated.map((rule, i) => (
						<StyledRuleRow key={rule.id}>
							<StyledRuleBox>
								<StyledRuleFill
									ref={(node) => {
										ruleFillsRef.current[i] = node;
									}}
								/>
								<StyledRuleTick
									ref={(node) => {
										ruleTicksRef.current[i] = node;
									}}
									viewBox="0 0 12 12"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="M2 6.2 4.7 8.9 10 3.3"
										stroke="currentColor"
										strokeWidth={1.9}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</StyledRuleTick>
							</StyledRuleBox>

							<StyledRuleLabel $met={rule.met}>{rule.label}</StyledRuleLabel>
							<StyledVisuallyHidden>{rule.met ? 'met' : 'not met'}</StyledVisuallyHidden>
						</StyledRuleRow>
					))}
				</StyledRuleList>
			) : null}

			<StyledVisuallyHidden as="p" aria-live="polite">
				{announcement}
			</StyledVisuallyHidden>
		</StyledStrengthRoot>
	);
}

export default PasswordStrength;
