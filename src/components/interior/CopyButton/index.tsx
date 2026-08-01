//! React
import { useRef } from 'react';

//? Variants
import type { ControlSize, ControlTone } from '../shared/variants';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useCopyToClipboard, type CopyStatus } from './useCopyToClipboard';

//? Lib
import { SPRINGS, DURATION, EASE_SMOOTH_OUT, motionSafe } from '../../../lib/motion';

//* Styled
import { StyledCopyButton, StyledIconStack, StyledLabelStack } from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type CopyButtonProps = {
	size?: ControlSize;
	tone?: ControlTone;
	value: string;
	label?: string;
	copiedLabel?: string;
	errorLabel?: string;
	timeout?: number;
	onCopy?: (value: string) => void;
	onError?: (reason: unknown) => void;
	disabled?: boolean;
};

const STATUSES: CopyStatus[] = ['idle', 'copied', 'error'];

function CopyButton({
	size = 'md',
	tone = 'default',
	value,
	label = 'Copy',
	copiedLabel = 'Copied',
	errorLabel = 'Failed',
	timeout = 2000,
	onCopy,
	onError,
	disabled = false,
}: CopyButtonProps) {
	const { copy, status } = useCopyToClipboard({ timeout, onCopy, onError });
	const prefersReducedMotion = usePrefersReducedMotion();

	const iconsRef = useRef<Record<CopyStatus, SVGSVGElement | null>>({
		idle: null,
		copied: null,
		error: null,
	});
	const labelsRef = useRef<Record<CopyStatus, HTMLSpanElement | null>>({
		idle: null,
		copied: null,
		error: null,
	});
	const checkRef = useRef<SVGPathElement>(null);

	const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);

	useGSAP(() => {
		STATUSES.forEach((key) => {
			const active = key === status;

			const icon = iconsRef.current[key];
			if (icon) {
				gsap.to(icon, {
					opacity: active ? 1 : 0,
					scale: active ? 1 : 0.92,
					duration: fade.duration,
					ease: fade.ease,
				});
			}

			const text = labelsRef.current[key];
			if (text) {
				gsap.to(text, {
					opacity: active ? 1 : 0,
					y: active ? 0 : 3,
					filter: active ? 'blur(0px)' : 'blur(3px)',
					duration: fade.duration,
					ease: fade.ease,
				});
			}
		});

		// The tick draws itself on rather than fading in — a check that appears
		// fully formed reads as a state that was always there.
		const check = checkRef.current;
		if (check) {
			const length = check.getTotalLength();
			gsap.set(check, { strokeDasharray: length });
			gsap.to(check, {
				strokeDashoffset: status === 'copied' ? 0 : length,
				duration: prefersReducedMotion ? 0 : DURATION.tab,
				ease: EASE_SMOOTH_OUT,
			});
		}
	}, [status, fade, prefersReducedMotion]);

	return (
		<StyledCopyButton $size={size} $tone={tone}
			type="button"
			disabled={disabled}
			aria-label={label}
			onClick={() => {
				void copy(value);
			}}
		>
			<StyledIconStack aria-hidden="true">
				<svg
					ref={(node) => {
						iconsRef.current.idle = node;
					}}
					viewBox="0 0 14 14"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M9.6 5.1V3.7A1.7 1.7 0 0 0 7.9 2H3.7A1.7 1.7 0 0 0 2 3.7v4.2a1.7 1.7 0 0 0 1.7 1.7h1.4" />
					<rect x="5.1" y="5.1" width="6.9" height="6.9" rx="1.7" />
				</svg>

				<svg
					ref={(node) => {
						iconsRef.current.copied = node;
					}}
					viewBox="0 0 14 14"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{ opacity: 0 }}
				>
					<path ref={checkRef} d="M2.9 7.4 5.6 10.1 11.1 4" />
				</svg>

				<svg
					ref={(node) => {
						iconsRef.current.error = node;
					}}
					viewBox="0 0 14 14"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{ opacity: 0 }}
				>
					<path d="M3.6 3.6 10.4 10.4" />
					<path d="M10.4 3.6 3.6 10.4" />
				</svg>
			</StyledIconStack>

			<StyledLabelStack aria-hidden="true">
				<span
					ref={(node) => {
						labelsRef.current.idle = node;
					}}
				>
					{label}
				</span>
				<span
					ref={(node) => {
						labelsRef.current.copied = node;
					}}
					style={{ opacity: 0 }}
				>
					{copiedLabel}
				</span>
				<span
					ref={(node) => {
						labelsRef.current.error = node;
					}}
					style={{ opacity: 0 }}
				>
					{errorLabel}
				</span>
			</StyledLabelStack>

			<StyledVisuallyHidden role="status" aria-live="polite">
				{status === 'copied' ? copiedLabel : status === 'error' ? errorLabel : ''}
			</StyledVisuallyHidden>
		</StyledCopyButton>
	);
}

export default CopyButton;
