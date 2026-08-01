//! React
import { useId, useRef } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useInlineValidation, type Validator } from './useInlineValidation';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledValidationRoot,
	StyledValidationLabel,
	StyledValidationField,
	StyledValidationInput,
	StyledValidationIcons,
	StyledMessageSlot,
	StyledMessage,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type InlineValidationProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	validate: Validator;
	hint?: string;
	id?: string;
	name?: string;
	type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
	placeholder?: string;
	autoComplete?: string;
	inputMode?: React.ComponentProps<'input'>['inputMode'];
	debounce?: number;
	/** Rows reserved for the message, so an error cannot reflow the form. */
	reserveLines?: number;
	disabled?: boolean;
	required?: boolean;
};

function InlineValidation({
	label,
	value,
	onChange,
	validate,
	hint,
	id,
	name,
	type = 'text',
	placeholder,
	autoComplete,
	inputMode,
	debounce = 400,
	reserveLines = 1,
	disabled = false,
	required = false,
}: InlineValidationProps) {
	const prefersReducedMotion = usePrefersReducedMotion();

	const auto = useId();
	const fieldId = id ?? `${auto}-field`;
	const hintId = `${auto}-hint`;
	const errorId = `${auto}-error`;

	const { status, error, message, fieldProps } = useInlineValidation({
		value,
		validate,
		debounce,
	});

	const invalid = status === 'invalid';
	const valid = status === 'valid';

	const checkRef = useRef<SVGSVGElement>(null);
	const alertRef = useRef<SVGSVGElement>(null);
	const hintRef = useRef<HTMLParagraphElement>(null);
	const errorRef = useRef<HTMLParagraphElement>(null);

	const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);

	useGSAP(() => {
		if (checkRef.current) {
			gsap.to(checkRef.current, {
				opacity: valid ? 1 : 0,
				scale: valid ? 1 : 0.7,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
		if (alertRef.current) {
			gsap.to(alertRef.current, {
				opacity: invalid ? 1 : 0,
				scale: invalid ? 1 : 0.7,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
		if (hintRef.current) {
			gsap.to(hintRef.current, {
				opacity: invalid ? 0 : 1,
				y: invalid ? 3 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
		if (errorRef.current) {
			gsap.to(errorRef.current, {
				opacity: invalid ? 1 : 0,
				y: invalid ? 0 : -3,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
	}, [valid, invalid, fade]);

	const described = [hint ? hintId : null, invalid ? errorId : null].filter(Boolean).join(' ');

	return (
		<StyledValidationRoot>
			<StyledValidationLabel htmlFor={fieldId}>{label}</StyledValidationLabel>

			<StyledValidationField>
				<StyledValidationInput
					id={fieldId}
					name={name}
					type={type}
					value={value}
					placeholder={placeholder}
					autoComplete={autoComplete}
					inputMode={inputMode}
					disabled={disabled}
					required={required}
					aria-required={required || undefined}
					aria-describedby={described || undefined}
					onChange={(e) => onChange(e.target.value)}
					{...fieldProps}
					$invalid={invalid}
				/>

				<StyledValidationIcons aria-hidden="true">
					<svg
						ref={checkRef}
						viewBox="0 0 12 12"
						width="14"
						height="14"
						fill="none"
						style={{ opacity: 0, color: 'var(--success)' }}
					>
						<path
							d="M2 6.3 4.7 9 10 3.2"
							stroke="currentColor"
							strokeWidth="1.6"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<svg
						ref={alertRef}
						viewBox="0 0 12 12"
						width="14"
						height="14"
						fill="none"
						style={{ opacity: 0, color: 'var(--danger)' }}
					>
						<path d="M6 2v4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
						<rect x="5.15" y="8.4" width="1.7" height="1.7" rx="0.5" fill="currentColor" />
					</svg>
				</StyledValidationIcons>
			</StyledValidationField>

			<StyledMessageSlot $lines={reserveLines}>
				{hint ? (
					<StyledMessage ref={hintRef} aria-hidden="true" $tone="hint" $lines={reserveLines}>
						{hint}
					</StyledMessage>
				) : null}

				<StyledMessage
					ref={errorRef}
					aria-hidden="true"
					$tone="error"
					$lines={reserveLines}
					style={{ opacity: 0 }}
				>
					{error ?? message}
				</StyledMessage>

				{hint ? <StyledVisuallyHidden id={hintId}>{hint}</StyledVisuallyHidden> : null}

				<StyledVisuallyHidden id={errorId} role="status" aria-live="polite" aria-atomic="true">
					{error ?? ''}
				</StyledVisuallyHidden>
			</StyledMessageSlot>
		</StyledValidationRoot>
	);
}

export default InlineValidation;
