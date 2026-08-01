//! React
import { useRef } from 'react';

//? Variants
import type { ControlSize, ControlTone } from '../shared/variants';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useAsyncAction, type AsyncActionStatus } from './useAsyncAction';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import { StyledLoadingButton, StyledFaceStack, StyledFace, StyledSpinner } from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const STATUSES: AsyncActionStatus[] = ['idle', 'pending', 'success', 'error'];

export type LoadingButtonProps = {
	size?: ControlSize;
	tone?: ControlTone;
	onAction: () => unknown;
	children: string;
	pendingLabel?: string;
	successLabel?: string;
	errorLabel?: string;
	resetAfter?: number;
	disabled?: boolean;
	onError?: (error: unknown) => void;
};

function LoadingButton({
	size = 'md',
	tone = 'default',
	onAction,
	children,
	pendingLabel = children,
	successLabel = 'Done',
	errorLabel = 'Try again',
	resetAfter = 1400,
	disabled = false,
	onError,
}: LoadingButtonProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { status, run, pending } = useAsyncAction({ action: onAction, resetAfter, onError });

	const facesRef = useRef<Record<AsyncActionStatus, HTMLSpanElement | null>>({
		idle: null,
		pending: null,
		success: null,
		error: null,
	});
	const spinnerRef = useRef<SVGSVGElement>(null);

	const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);

	useGSAP(() => {
		STATUSES.forEach((key) => {
			const node = facesRef.current[key];
			if (!node) return;

			const active = key === status;
			gsap.to(node, {
				opacity: active ? 1 : 0,
				y: active ? 0 : 3,
				filter: active ? 'blur(0px)' : 'blur(3px)',
				duration: fade.duration,
				ease: fade.ease,
			});
		});
	}, [status, fade]);

	// The spinner is the one thing here that loops: it depicts an unknown
	// remaining time, so it turns at a constant rate and never eases.
	useGSAP(() => {
		const node = spinnerRef.current;
		if (!node) return;

		gsap.killTweensOf(node);
		if (status !== 'pending' || prefersReducedMotion) {
			gsap.set(node, { rotate: 0 });
			return;
		}

		const tween = gsap.to(node, { rotate: 360, duration: 0.85, ease: 'none', repeat: -1 });
		return () => {
			tween.kill();
		};
	}, [status, prefersReducedMotion]);

	const label =
		status === 'pending'
			? pendingLabel
			: status === 'success'
				? successLabel
				: status === 'error'
					? errorLabel
					: children;

	const faces: Array<{ key: AsyncActionStatus; text: string; icon: React.ReactNode }> = [
		{ key: 'idle', text: children, icon: null },
		{
			key: 'pending',
			text: pendingLabel,
			icon: (
				<StyledSpinner ref={spinnerRef} width="12" height="12" viewBox="0 0 12 12" fill="none">
					<circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22" />
					<path
						d="M10.5 6A4.5 4.5 0 0 0 6 1.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</StyledSpinner>
			),
		},
		{
			key: 'success',
			text: successLabel,
			icon: (
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path
						d="M2.6 6.3 4.9 8.6 9.4 3.6"
						stroke="currentColor"
						strokeWidth="1.7"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			),
		},
		{
			key: 'error',
			text: errorLabel,
			icon: (
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M6 2.9v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
					<path d="M6 9.05h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
				</svg>
			),
		},
	];

	return (
		<>
			<StyledLoadingButton $size={size} $tone={tone}
				type="button"
				disabled={disabled}
				aria-label={label}
				aria-busy={pending || undefined}
				aria-disabled={pending || undefined}
				onClick={(event) => {
					if (pending) {
						event.preventDefault();
						return;
					}
					run();
				}}
			>
				<StyledFaceStack aria-hidden="true">
					{faces.map((face) => (
						<StyledFace
							key={face.key}
							ref={(node) => {
								facesRef.current[face.key] = node;
							}}
							$status={face.key}
							style={{ opacity: face.key === status ? 1 : 0 }}
						>
							{face.icon}
							{face.text}
						</StyledFace>
					))}
				</StyledFaceStack>
			</StyledLoadingButton>

			<StyledVisuallyHidden role="status" aria-live="polite">
				{status === 'success' ? successLabel : status === 'error' ? errorLabel : ''}
			</StyledVisuallyHidden>
		</>
	);
}

export default LoadingButton;
