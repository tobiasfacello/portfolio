//! React
import { useEffect, useId, useImperativeHandle, useRef } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useOtpInput, type OtpMode } from './useOtpInput';

//? Lib
import { EASE_SMOOTH_OUT } from '../../../lib/motion';

//* Styled
import {
	StyledOtpRoot,
	StyledOtpGroup,
	StyledOtpCell,
	StyledOtpField,
	StyledOtpGlyphSlot,
	StyledOtpGlyph,
	StyledOtpCaret,
	StyledOtpStatusSlot,
	StyledOtpMessage,
	type OtpStatus,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type OtpInputHandle = {
	clear: () => void;
	focus: () => void;
};

export type OtpInputProps = {
	length?: number;
	mode?: OtpMode;
	defaultValue?: string;
	onChange?: (value: string) => void;
	onComplete?: (value: string) => void;
	status?: OtpStatus;
	errorMessage?: string;
	successMessage?: string;
	hint?: string;
	label?: string;
	/** Insert a visual break every N cells. */
	groupEvery?: number;
	disabled?: boolean;
	autoFocus?: boolean;
	focusOnError?: boolean;
	ref?: React.Ref<OtpInputHandle>;
};

function OtpInput({
	length = 6,
	mode = 'numeric',
	defaultValue = '',
	onChange,
	onComplete,
	status = 'idle',
	errorMessage = '',
	successMessage = '',
	hint = '',
	label = 'Verification code',
	groupEvery = 3,
	disabled = false,
	autoFocus = false,
	focusOnError = true,
	ref,
}: OtpInputProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const statusId = useId();

	const { chars, focusedIndex, getCellProps, focusAt, clear } = useOtpInput({
		length,
		mode,
		defaultValue,
		disabled,
		onChange,
		onComplete,
	});

	const groupRef = useRef<HTMLDivElement>(null);
	const glyphsRef = useRef<(HTMLSpanElement | null)[]>([]);
	const caretRef = useRef<HTMLSpanElement>(null);
	const messageRef = useRef<HTMLSpanElement>(null);
	const wasError = useRef(false);

	const error = status === 'error';
	const success = status === 'success';

	useImperativeHandle(
		ref,
		() => ({
			clear: () => {
				clear();
				focusAt(0);
			},
			focus: () => focusAt(0),
		}),
		[clear, focusAt],
	);

	// A rejected code puts the cursor back at the start, so the correction can
	// begin immediately instead of hunting for the first box.
	useEffect(() => {
		if (error && !wasError.current && focusOnError && !disabled) focusAt(0);
		wasError.current = error;
	}, [error, focusOnError, disabled, focusAt]);

	useEffect(() => {
		if (autoFocus && !disabled) focusAt(0);
	}, [autoFocus, disabled, focusAt]);

	/** A short shake on rejection — the one place this set uses motion as alarm. */
	useGSAP(() => {
		const node = groupRef.current;
		if (!node || !error || prefersReducedMotion) return;

		const tween = gsap.fromTo(
			node,
			{ x: 0 },
			{
				keyframes: { x: [-5, 4, -3, 0] },
				duration: 0.32,
				ease: EASE_SMOOTH_OUT,
			},
		);
		return () => {
			tween.kill();
		};
	}, [error, prefersReducedMotion]);

	// Each character drops into place; the box it lands in never moves.
	useGSAP(() => {
		chars.forEach((char, i) => {
			const node = glyphsRef.current[i];
			if (!node) return;

			if (!char) {
				gsap.set(node, { opacity: 0 });
				return;
			}
			gsap.fromTo(
				node,
				prefersReducedMotion
					? { opacity: 0 }
					: { opacity: 0, scale: 0.97, y: 10, filter: 'blur(6px)' },
				{
					opacity: 1,
					scale: 1,
					y: 0,
					filter: 'blur(0px)',
					duration: prefersReducedMotion ? 0 : 0.22,
					ease: EASE_SMOOTH_OUT,
				},
			);
		});
	}, [chars, prefersReducedMotion]);

	useGSAP(() => {
		const node = caretRef.current;
		if (!node) return;

		gsap.killTweensOf(node);
		if (prefersReducedMotion) {
			gsap.set(node, { opacity: 1 });
			return;
		}

		const timeline = gsap.timeline({ repeat: -1 });
		timeline.set(node, { opacity: 1 });
		timeline.to(node, { opacity: 0, duration: 0.01, ease: 'none' }, 0.53);
		timeline.to(node, { opacity: 1, duration: 0.01, ease: 'none' }, 1.06);

		return () => {
			timeline.kill();
		};
	}, [focusedIndex, prefersReducedMotion]);

	useGSAP(() => {
		const node = messageRef.current;
		if (!node) return;

		gsap.fromTo(
			node,
			{ opacity: 0, y: prefersReducedMotion ? 0 : 3 },
			{ opacity: 1, y: 0, duration: prefersReducedMotion ? 0 : 0.2, ease: EASE_SMOOTH_OUT },
		);
	}, [status, prefersReducedMotion]);

	const hasStatus = hint.length > 0 || errorMessage.length > 0 || successMessage.length > 0;
	const message = error ? errorMessage : success ? successMessage : hint;

	return (
		<StyledOtpRoot>
			<StyledOtpGroup ref={groupRef} role="group" aria-label={label}>
				{Array.from({ length }, (_, i) => {
					const char = chars[i] ?? '';
					const active = focusedIndex === i;
					const gap = groupEvery > 0 && i > 0 && i % groupEvery === 0;

					return (
						<StyledOtpCell key={i} $gap={gap}>
							<StyledOtpField
								{...getCellProps(i)}
								aria-label={`${label}, character ${i + 1} of ${length}`}
								aria-invalid={error || undefined}
								aria-describedby={hasStatus ? statusId : undefined}
								$status={status}
								$active={active}
								$filled={Boolean(char)}
							/>

							<StyledOtpGlyphSlot aria-hidden="true">
								<StyledOtpGlyph
									ref={(node) => {
										glyphsRef.current[i] = node;
									}}
									style={{ opacity: 0 }}
								>
									{char}
								</StyledOtpGlyph>

								{active && !char && !disabled ? <StyledOtpCaret ref={caretRef} /> : null}
							</StyledOtpGlyphSlot>
						</StyledOtpCell>
					);
				})}
			</StyledOtpGroup>

			{hasStatus ? (
				<>
					<StyledOtpStatusSlot aria-hidden="true">
						<StyledOtpMessage ref={messageRef} $status={status}>
							{message}
						</StyledOtpMessage>
					</StyledOtpStatusSlot>
					<StyledVisuallyHidden id={statusId} role="status">
						{message}
					</StyledVisuallyHidden>
				</>
			) : null}
		</StyledOtpRoot>
	);
}

export default OtpInput;
