import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type ClipboardEvent,
	type FocusEvent,
	type KeyboardEvent,
} from 'react';

export type OtpMode = 'numeric' | 'alphanumeric';

const ALLOW: Record<OtpMode, RegExp> = {
	numeric: /^[0-9]$/,
	alphanumeric: /^[0-9a-zA-Z]$/,
};

export type UseOtpInputOptions = {
	length?: number;
	mode?: OtpMode;
	defaultValue?: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
	onComplete?: (value: string) => void;
};

/**
 * A one-time-code field made of separate inputs that behaves like one.
 *
 * The parts people actually get wrong: pasting a full code fills every box from
 * wherever it landed rather than dropping all six characters into one; SMS
 * autofill works because only the first box advertises `one-time-code`;
 * backspace on an empty box clears the previous one and steps back; and
 * focusing a box past the first gap redirects to that gap, so the code can only
 * be entered in order.
 */
export function useOtpInput({
	length = 6,
	mode = 'numeric',
	defaultValue = '',
	disabled = false,
	onChange,
	onComplete,
}: UseOtpInputOptions = {}) {
	const allow = ALLOW[mode];

	const keep = useCallback(
		(text: string) =>
			text
				.split('')
				.filter((c) => allow.test(c))
				.join(''),
		[allow],
	);

	const [chars, setChars] = useState<string[]>(() => {
		const seed = defaultValue
			.split('')
			.filter((c) => ALLOW[mode].test(c))
			.slice(0, length);
		return Array.from({ length }, (_, i) => seed[i] ?? '');
	});
	const [focusedIndex, setFocusedIndex] = useState(-1);

	const charsRef = useRef(chars);
	charsRef.current = chars;

	const refs = useRef<(HTMLInputElement | null)[]>([]);

	const changed = useRef(onChange);
	changed.current = onChange;
	const completed = useRef(onComplete);
	completed.current = onComplete;

	useEffect(() => {
		setChars((prev) => (prev.length === length ? prev : Array.from({ length }, (_, i) => prev[i] ?? '')));
		refs.current.length = length;
	}, [length]);

	const commit = useCallback((next: string[]) => {
		charsRef.current = next;
		setChars(next);
		const value = next.join('');
		changed.current?.(value);
		if (next.length > 0 && next.every((c) => c !== '')) completed.current?.(value);
	}, []);

	const focusAt = useCallback(
		(index: number) => {
			const el = refs.current[Math.max(0, Math.min(length - 1, index))];
			if (!el) return;
			el.focus();
			el.select();
		},
		[length],
	);

	const fillFrom = useCallback(
		(index: number, text: string) => {
			const incoming = keep(text);
			if (incoming.length === 0) return;
			const next = [...charsRef.current];
			let cursor = index;
			for (const c of incoming) {
				if (cursor >= length) break;
				next[cursor] = c;
				cursor += 1;
			}
			commit(next);
			focusAt(cursor);
		},
		[commit, focusAt, keep, length],
	);

	const clear = useCallback(() => {
		commit(Array.from({ length }, () => ''));
		focusAt(0);
	}, [commit, focusAt, length]);

	const getCellProps = useCallback(
		(index: number) => ({
			ref: (el: HTMLInputElement | null) => {
				refs.current[index] = el;
			},
			value: chars[index] ?? '',
			disabled,
			type: 'text' as const,
			inputMode: (mode === 'numeric' ? 'numeric' : 'text') as 'numeric' | 'text',
			// Only the first cell claims the code, or the browser offers to fill
			// every box with the whole thing.
			autoComplete: index === 0 ? 'one-time-code' : 'off',
			autoCorrect: 'off' as const,
			autoCapitalize: 'off' as const,
			spellCheck: false,
			onChange: (e: ChangeEvent<HTMLInputElement>) => {
				const previous = charsRef.current[index] ?? '';
				const raw = e.currentTarget.value;
				// Typing over a filled box appends rather than replaces; take the new
				// character, not the concatenation.
				const trimmed =
					raw.length > 1 && previous && raw.startsWith(previous) ? raw.slice(previous.length) : raw;
				const incoming = keep(trimmed);

				if (incoming.length === 0) {
					if (raw.length === 0 && previous) {
						const next = [...charsRef.current];
						next[index] = '';
						commit(next);
					}
					e.currentTarget.value = charsRef.current[index] ?? '';
					return;
				}

				if (incoming.length === 1) {
					const next = [...charsRef.current];
					next[index] = incoming;
					e.currentTarget.value = incoming;
					commit(next);
					if (index < length - 1) focusAt(index + 1);
					return;
				}

				fillFrom(index, incoming);
			},
			onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
				if (e.key === 'Backspace') {
					e.preventDefault();
					const current = charsRef.current;
					const next = [...current];
					if (current[index]) {
						next[index] = '';
						commit(next);
						return;
					}
					if (index > 0) {
						next[index - 1] = '';
						commit(next);
						focusAt(index - 1);
					}
					return;
				}
				if (e.key === 'Delete') {
					e.preventDefault();
					const next = [...charsRef.current];
					next[index] = '';
					commit(next);
					return;
				}
				if (e.key === 'ArrowLeft') {
					e.preventDefault();
					focusAt(index - 1);
					return;
				}
				if (e.key === 'ArrowRight') {
					e.preventDefault();
					focusAt(index + 1);
					return;
				}
				if (e.key === 'Home') {
					e.preventDefault();
					focusAt(0);
					return;
				}
				if (e.key === 'End') {
					e.preventDefault();
					focusAt(length - 1);
				}
			},
			onPaste: (e: ClipboardEvent<HTMLInputElement>) => {
				e.preventDefault();
				const text = keep(e.clipboardData.getData('text'));
				// A full-length paste always starts at the beginning, wherever it landed.
				fillFrom(text.length >= length ? 0 : index, text);
			},
			onFocus: (e: FocusEvent<HTMLInputElement>) => {
				e.currentTarget.select();
				const firstEmpty = charsRef.current.findIndex((c) => c === '');
				if (firstEmpty !== -1 && firstEmpty < index) {
					focusAt(firstEmpty);
					return;
				}
				setFocusedIndex(index);
			},
			onBlur: (e: FocusEvent<HTMLInputElement>) => {
				const to = e.relatedTarget as HTMLInputElement | null;
				// Moving between cells is not leaving the field.
				if (to && refs.current.includes(to)) return;
				setFocusedIndex(-1);
			},
		}),
		[chars, commit, disabled, fillFrom, focusAt, keep, length, mode],
	);

	return {
		chars,
		value: chars.join(''),
		length,
		complete: chars.length > 0 && chars.every((c) => c !== ''),
		focusedIndex,
		getCellProps,
		focusAt,
		clear,
	};
}
