import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

export type UseFloatingLabelOptions = {
	value?: string;
	defaultValue?: string;
	disabled?: boolean;
};

type Fill = { length: number; instant: boolean };

/**
 * Tracks whether the label should sit in the field or above it.
 *
 * The first measurement is marked `instant` so a field that arrives already
 * filled — restored form state, an autofilled password — renders with its label
 * raised instead of animating it up on mount, which would suggest the value was
 * just typed.
 */
export function useFloatingLabel({
	value,
	defaultValue,
	disabled = false,
}: UseFloatingLabelOptions = {}) {
	const ref = useRef<HTMLInputElement | null>(null);
	const mounted = useRef(false);

	const [focused, setFocused] = useState(false);
	const [fill, setFill] = useState<Fill>({
		length: (value ?? defaultValue ?? '').length,
		instant: true,
	});

	const settle = useCallback((next: number, instant: boolean) => {
		setFill((prev) =>
			prev.length === next && prev.instant === instant ? prev : { length: next, instant },
		);
	}, []);

	useLayoutEffect(() => {
		const el = ref.current;
		const next = value !== undefined ? value.length : el ? el.value.length : 0;
		settle(next, !mounted.current);
		mounted.current = true;
	}, [value, settle]);

	useEffect(() => {
		setFill((prev) => (prev.instant ? { ...prev, instant: false } : prev));
	}, []);

	// Uncontrolled fields can be changed by the browser without React hearing
	// about it, so listen on the element directly.
	useEffect(() => {
		const el = ref.current;
		if (!el || value !== undefined) return;
		const read = () => settle(el.value.length, false);
		el.addEventListener('input', read);
		el.addEventListener('change', read);
		return () => {
			el.removeEventListener('input', read);
			el.removeEventListener('change', read);
		};
	}, [value, settle]);

	useEffect(() => {
		if (disabled) setFocused(false);
	}, [disabled]);

	const onFocus = useCallback(() => setFocused(true), []);
	const onBlur = useCallback(() => setFocused(false), []);
	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => settle(event.currentTarget.value.length, false),
		[settle],
	);

	return {
		ref,
		raised: focused || fill.length > 0,
		focused,
		filled: fill.length > 0,
		length: fill.length,
		instant: fill.instant && !focused,
		fieldProps: { onFocus, onBlur, onChange },
	};
}
