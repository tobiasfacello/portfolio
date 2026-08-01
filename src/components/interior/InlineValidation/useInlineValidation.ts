import { useCallback, useEffect, useRef, useState } from 'react';

export type ValidationStatus = 'idle' | 'pending' | 'valid' | 'invalid';

/** Returns an error message, or null when the value is acceptable. */
export type Validator = (value: string) => string | null;

export type UseInlineValidationOptions = {
	value: string;
	validate: Validator;
	/** Delay before an error is shown while typing, in ms. */
	debounce?: number;
};

type Settled = {
	status: ValidationStatus;
	error: string | null;
	message: string;
};

const CLEAN: Settled = { status: 'idle', error: null, message: '' };

/**
 * Validates as the user types, without scolding them mid-word.
 *
 * Validation only starts after the first blur — nobody wants "invalid email"
 * after typing one character. Once touched, becoming valid is reported
 * immediately while becoming invalid waits out the debounce, so the field
 * rewards progress instantly and criticises only after a pause. The last error
 * message is kept after it clears so the text can fade out rather than vanish
 * while its space collapses.
 */
export function useInlineValidation({
	value,
	validate,
	debounce = 400,
}: UseInlineValidationOptions) {
	const [touched, setTouched] = useState(false);
	const [settled, setSettled] = useState<Settled>(CLEAN);

	const check = useRef(validate);
	const latest = useRef(value);

	useEffect(() => {
		check.current = validate;
		latest.current = value;
	});

	useEffect(() => {
		if (!touched) return;

		const next = check.current(value);
		const resolved: ValidationStatus = value.length > 0 ? 'valid' : 'idle';

		if (next === null) {
			setSettled((prev) =>
				prev.status === resolved && prev.error === null
					? prev
					: { status: resolved, error: null, message: prev.message },
			);
			return;
		}

		setSettled((prev) =>
			prev.status === 'invalid' ? prev : { status: 'pending', error: null, message: prev.message },
		);

		const timer = setTimeout(() => {
			setSettled((prev) =>
				prev.error === next ? prev : { status: 'invalid', error: next, message: next },
			);
		}, debounce);

		return () => clearTimeout(timer);
	}, [value, touched, debounce]);

	/** Validates now, skipping the debounce — used on blur and on submit. */
	const commit = useCallback(() => {
		setTouched(true);
		const v = latest.current;
		const next = check.current(v);
		setSettled((prev) =>
			next === null
				? { status: v.length > 0 ? 'valid' : 'idle', error: null, message: prev.message }
				: { status: 'invalid', error: next, message: next },
		);
	}, []);

	const reset = useCallback(() => {
		setTouched(false);
		setSettled(CLEAN);
	}, []);

	return {
		status: settled.status,
		error: settled.error,
		message: settled.message,
		touched,
		commit,
		reset,
		fieldProps: { onBlur: commit, 'aria-invalid': settled.status === 'invalid' },
	};
}
