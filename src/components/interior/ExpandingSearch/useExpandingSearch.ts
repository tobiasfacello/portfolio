import { useCallback, useEffect, useRef, useState } from 'react';

export type UseExpandingSearchOptions = {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	/** Fires after the debounce — the expensive call. */
	onSearch?: (value: string) => void;
	/** Fires on Enter, skipping the debounce. */
	onSubmit?: (value: string) => void;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	debounce?: number;
	collapseOnBlur?: boolean;
	disabled?: boolean;
};

/**
 * A search field that lives inside its own icon until it is needed.
 *
 * Typing is reported immediately but searching is debounced, and Enter flushes
 * the pending search rather than firing a second one — so submitting never
 * duplicates the request already in flight. Blur only collapses an *empty*
 * field: someone who typed a query and clicked away has not abandoned it, and
 * hiding their text would lose work.
 */
export function useExpandingSearch({
	value,
	defaultValue = '',
	onChange,
	onSearch,
	onSubmit,
	open,
	defaultOpen = false,
	onOpenChange,
	debounce = 220,
	collapseOnBlur = true,
	disabled = false,
}: UseExpandingSearchOptions = {}) {
	const [ownValue, setOwnValue] = useState(defaultValue);
	const [ownOpen, setOwnOpen] = useState(defaultOpen);
	const [focused, setFocused] = useState(false);

	const query = value ?? ownValue;
	const isOpen = open ?? ownOpen;

	const inputRef = useRef<HTMLInputElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const openRef = useRef(isOpen);

	const latest = useRef({ query, onChange, onSearch, onSubmit, onOpenChange });
	latest.current = { query, onChange, onSearch, onSubmit, onOpenChange };

	useEffect(() => {
		openRef.current = isOpen;
	}, [isOpen]);

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	const setOpen = useCallback((next: boolean) => {
		if (openRef.current === next) return;
		openRef.current = next;
		setOwnOpen(next);
		latest.current.onOpenChange?.(next);
	}, []);

	const commit = useCallback(
		(next: string) => {
			setOwnValue(next);
			latest.current.onChange?.(next);
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => {
				timer.current = null;
				latest.current.onSearch?.(next);
			}, debounce);
		},
		[debounce],
	);

	const flush = useCallback(() => {
		if (!timer.current) return;
		clearTimeout(timer.current);
		timer.current = null;
		latest.current.onSearch?.(latest.current.query);
	}, []);

	const expand = useCallback(() => {
		if (disabled) return;
		setOpen(true);
		inputRef.current?.focus();
	}, [disabled, setOpen]);

	const collapse = useCallback(
		(returnFocus = false) => {
			setOpen(false);
			if (returnFocus) triggerRef.current?.focus();
		},
		[setOpen],
	);

	const toggle = useCallback(() => {
		if (openRef.current) collapse(true);
		else expand();
	}, [collapse, expand]);

	const clear = useCallback(() => {
		commit('');
		inputRef.current?.focus();
	}, [commit]);

	const onRootFocus = useCallback(() => setFocused(true), []);

	const onRootBlur = useCallback(
		(event: React.FocusEvent<HTMLElement>) => {
			const next = event.relatedTarget as Node | null;
			// Moving between the trigger, the input and the clear button is not
			// leaving the field.
			if (next && event.currentTarget.contains(next)) return;
			setFocused(false);
			if (!collapseOnBlur) return;
			// Switching to another window should not collapse it either.
			if (!document.hasFocus()) return;
			if (latest.current.query.length > 0) return;
			setOpen(false);
		},
		[collapseOnBlur, setOpen],
	);

	const onInputKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			// Escape clears first, and only collapses once there is nothing to lose.
			if (event.key === 'Escape') {
				event.preventDefault();
				event.stopPropagation();
				if (latest.current.query.length > 0) {
					commit('');
					return;
				}
				collapse(true);
				return;
			}
			if (event.key === 'Enter') {
				event.preventDefault();
				flush();
				latest.current.onSubmit?.(latest.current.query);
			}
		},
		[collapse, commit, flush],
	);

	const onInputFocus = useCallback(() => setOpen(true), [setOpen]);

	const onInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => commit(event.currentTarget.value),
		[commit],
	);

	return {
		open: isOpen,
		focused,
		query,
		expand,
		collapse,
		toggle,
		clear,
		inputRef,
		triggerRef,
		rootProps: { onFocus: onRootFocus, onBlur: onRootBlur },
		triggerProps: {
			ref: triggerRef,
			type: 'button' as const,
			disabled,
			// Only one of the trigger and the input is ever in the tab order.
			tabIndex: isOpen ? -1 : 0,
			'aria-expanded': isOpen,
			onClick: expand,
		},
		inputProps: {
			ref: inputRef,
			value: query,
			disabled,
			tabIndex: isOpen ? 0 : -1,
			onChange: onInputChange,
			onKeyDown: onInputKeyDown,
			onFocus: onInputFocus,
		},
	};
}
