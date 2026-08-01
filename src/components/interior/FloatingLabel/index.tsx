//! React
import { useCallback, useId, useRef } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useFloatingLabel } from './useFloatingLabel';

//? Lib
import { spring } from '../../../lib/motion';

//* Styled
import {
	StyledFieldRoot,
	StyledFieldShell,
	StyledFieldBox,
	StyledFieldInput,
	StyledFieldLabel,
	StyledFieldFooter,
	StyledFieldHint,
	StyledFieldCounter,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const LIFT = spring({ stiffness: 760, damping: 46, mass: 0.5 });

/** Where the label lands once raised. */
const RAISE = -32;
const SLIDE = -12;
const SHRINK = 0.92;

export type FloatingLabelInputProps = {
	label: string;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
	onFocus?: () => void;
	onBlur?: () => void;
	hint?: string;
	invalid?: boolean;
	id?: string;
	name?: string;
	type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
	autoComplete?: string;
	inputMode?: React.ComponentProps<'input'>['inputMode'];
	maxLength?: number;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	inputRef?: React.Ref<HTMLInputElement>;
};

function FloatingLabelInput({
	label,
	value,
	defaultValue,
	onChange,
	onFocus,
	onBlur,
	hint,
	invalid = false,
	id,
	name,
	type = 'text',
	autoComplete,
	inputMode,
	maxLength,
	required = false,
	disabled = false,
	readOnly = false,
	inputRef,
}: FloatingLabelInputProps) {
	const auto = useId();
	const fieldId = id ?? `${auto}-field`;
	const hintId = `${auto}-hint`;

	const prefersReducedMotion = usePrefersReducedMotion();
	const { ref, raised, focused, length, instant, fieldProps } = useFloatingLabel({
		value,
		defaultValue,
		disabled,
	});

	const labelRef = useRef<HTMLLabelElement>(null);

	useGSAP(() => {
		const node = labelRef.current;
		if (!node) return;

		// `instant` covers the first paint of an already-filled field: the label
		// belongs up there, it did not just travel there.
		const skip = prefersReducedMotion || instant;
		gsap.to(node, {
			y: raised ? RAISE : 0,
			x: raised ? SLIDE : 0,
			scale: raised ? SHRINK : 1,
			duration: skip ? 0 : LIFT.duration,
			ease: LIFT.ease,
		});
	}, [raised, instant, prefersReducedMotion]);

	const attach = useCallback(
		(node: HTMLInputElement | null) => {
			ref.current = node;
			if (typeof inputRef === 'function') inputRef(node);
			else if (inputRef) (inputRef as React.RefObject<HTMLInputElement | null>).current = node;
		},
		[ref, inputRef],
	);

	return (
		<StyledFieldRoot>
			<StyledFieldShell>
				<StyledFieldBox $focused={focused} $invalid={invalid} $disabled={disabled}>
					<StyledFieldInput
						ref={attach}
						id={fieldId}
						name={name}
						type={type}
						value={value}
						defaultValue={defaultValue}
						autoComplete={autoComplete}
						inputMode={inputMode}
						maxLength={maxLength}
						required={required}
						disabled={disabled}
						readOnly={readOnly}
						aria-required={required || undefined}
						aria-invalid={invalid || undefined}
						aria-describedby={hint ? hintId : undefined}
						onFocus={() => {
							fieldProps.onFocus();
							onFocus?.();
						}}
						onBlur={() => {
							fieldProps.onBlur();
							onBlur?.();
						}}
						onChange={(event) => {
							fieldProps.onChange(event);
							onChange?.(event.currentTarget.value, event);
						}}
					/>
				</StyledFieldBox>

				<StyledFieldLabel ref={labelRef} htmlFor={fieldId} $raised={raised} $invalid={invalid}>
					{label}
					{required ? <span aria-hidden="true"> *</span> : null}
				</StyledFieldLabel>
			</StyledFieldShell>

			<StyledFieldFooter>
				<StyledFieldHint aria-hidden="true" $invalid={invalid}>
					{hint}
				</StyledFieldHint>

				{maxLength !== undefined ? (
					<StyledFieldCounter aria-hidden="true">
						<span data-ghost>
							{maxLength} / {maxLength}
						</span>
						<span>
							{length} / {maxLength}
						</span>
					</StyledFieldCounter>
				) : null}

				{hint ? <StyledVisuallyHidden id={hintId}>{hint}</StyledVisuallyHidden> : null}
			</StyledFieldFooter>
		</StyledFieldRoot>
	);
}

export default FloatingLabelInput;
