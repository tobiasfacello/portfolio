import { useCallback, useEffect, useRef, useState } from 'react';

const clean = (raw: string) => raw.trim().replace(/\s+/g, ' ');

const splitter = (separators: string[]) =>
	new RegExp(`[${separators.map((s) => s.replace(/[\\\]^-]/g, '\\$&')).join('')}\\n\\r\\t]+`);

export type TagRejection = 'duplicate' | 'limit' | 'invalid';

export type UseTagInputOptions = {
	value?: string[];
	defaultValue?: string[];
	onChange?: (tags: string[]) => void;
	max?: number;
	/** Keys and paste characters that end a tag. */
	separators?: string[];
	allowDuplicates?: boolean;
	validate?: (candidate: string, tags: string[]) => boolean;
};

type Rejection = { reason: TagRejection; tag: string; visible: boolean };

/**
 * Tag entry that explains itself when it refuses.
 *
 * A rejected tag is never silently dropped: the reason is surfaced, and a
 * duplicate briefly flashes the tag that already exists so you can see *why*
 * nothing happened. Backspace on an empty field arms the last tag before
 * removing it, so the second press is a confirmation rather than an accident.
 */
export function useTagInput({
	value,
	defaultValue,
	onChange,
	max,
	separators = [','],
	allowDuplicates = false,
	validate,
}: UseTagInputOptions = {}) {
	const [internal, setInternal] = useState<string[]>(() => defaultValue ?? []);
	const [draft, setDraft] = useState('');
	const [armed, setArmed] = useState(-1);
	const [rejection, setRejection] = useState<Rejection | null>(null);
	const [flashed, setFlashed] = useState<string | null>(null);
	const [announcement, setAnnouncement] = useState('');

	const controlled = value !== undefined;
	const tags = value ?? internal;
	const armedIndex = armed >= tags.length ? -1 : armed;

	const emit = useRef(onChange);
	emit.current = onChange;
	const check = useRef(validate);
	check.current = validate;

	const rejectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (rejectTimer.current) clearTimeout(rejectTimer.current);
			if (flashTimer.current) clearTimeout(flashTimer.current);
		},
		[],
	);

	const dismiss = useCallback(() => {
		if (rejectTimer.current) clearTimeout(rejectTimer.current);
		rejectTimer.current = null;
		setRejection((prev) => (prev && prev.visible ? { ...prev, visible: false } : prev));
	}, []);

	const refuse = useCallback(
		(reason: TagRejection, tag: string) => {
			if (rejectTimer.current) clearTimeout(rejectTimer.current);
			setRejection({ reason, tag, visible: true });
			rejectTimer.current = setTimeout(() => {
				setRejection((prev) => (prev ? { ...prev, visible: false } : prev));
			}, 2400);

			setAnnouncement(
				reason === 'duplicate'
					? `${tag} is already in the list.`
					: reason === 'limit'
						? `That is the limit of ${max} tags.`
						: `${tag} is not allowed here.`,
			);

			if (reason !== 'duplicate') return;
			if (flashTimer.current) clearTimeout(flashTimer.current);
			setFlashed(tag);
			flashTimer.current = setTimeout(() => setFlashed(null), 460);
		},
		[max],
	);

	const apply = useCallback(
		(next: string[]) => {
			if (!controlled) setInternal(next);
			emit.current?.(next);
		},
		[controlled],
	);

	const add = useCallback(
		(raws: string[]) => {
			const next = [...tags];
			let added = 0;
			let failure: { reason: TagRejection; tag: string } | null = null;

			for (const raw of raws) {
				const candidate = clean(raw);
				if (!candidate) continue;

				// The limit stops the whole batch; the others only skip one item, so
				// pasting a list with one bad entry still adds the rest.
				if (max !== undefined && next.length >= max) {
					failure = { reason: 'limit', tag: candidate };
					break;
				}

				if (!allowDuplicates) {
					const twin = next.find((t) => t.toLowerCase() === candidate.toLowerCase());
					if (twin) {
						failure = { reason: 'duplicate', tag: twin };
						continue;
					}
				}

				if (check.current && !check.current(candidate, next)) {
					failure = { reason: 'invalid', tag: candidate };
					continue;
				}

				next.push(candidate);
				added += 1;
			}

			if (added > 0) {
				apply(next);
				setDraft('');
				setArmed(-1);
				dismiss();
				setAnnouncement(
					`${added === 1 ? next[next.length - 1] : `${added} tags`} added, ${next.length} total.`,
				);
			}

			if (failure) refuse(failure.reason, failure.tag);
			return added > 0;
		},
		[tags, max, allowDuplicates, apply, dismiss, refuse],
	);

	const removeAt = useCallback(
		(index: number) => {
			if (index < 0 || index >= tags.length) return;
			const gone = tags[index];
			const next = tags.filter((_, i) => i !== index);
			apply(next);
			setArmed(-1);
			dismiss();
			setAnnouncement(`${gone} removed, ${next.length} left.`);
		},
		[tags, apply, dismiss],
	);

	const arm = useCallback(
		(index: number) => {
			setArmed(index);
			setAnnouncement(`${tags[index]} selected, press Backspace again to remove it.`);
		},
		[tags],
	);

	const inputProps = {
		value: draft,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setDraft(e.target.value);
			setArmed(-1);
			dismiss();
		},
		onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
			// Never commit mid-composition — an IME is still deciding.
			if (e.nativeEvent.isComposing) return;

			if (e.key === 'Enter' || separators.includes(e.key)) {
				e.preventDefault();
				add([draft]);
				return;
			}

			if (e.key === 'Backspace' && draft === '') {
				e.preventDefault();
				// Holding backspace must not chew through the whole list.
				if (e.repeat) return;
				if (armedIndex >= 0) removeAt(armedIndex);
				else if (tags.length > 0) arm(tags.length - 1);
				return;
			}

			if (e.key === 'Delete' && armedIndex >= 0) {
				e.preventDefault();
				if (e.repeat) return;
				removeAt(armedIndex);
				return;
			}

			// Only walk into the tags once the caret is genuinely at the start.
			if (e.key === 'ArrowLeft') {
				const start = e.currentTarget.selectionStart;
				const end = e.currentTarget.selectionEnd;
				if (start !== 0 || end !== 0 || tags.length === 0) return;
				e.preventDefault();
				arm(armedIndex < 0 ? tags.length - 1 : Math.max(0, armedIndex - 1));
				return;
			}

			if (e.key === 'ArrowRight' && armedIndex >= 0) {
				e.preventDefault();
				if (armedIndex >= tags.length - 1) setArmed(-1);
				else arm(armedIndex + 1);
				return;
			}

			if (e.key === 'Escape' && armedIndex >= 0) {
				e.preventDefault();
				setArmed(-1);
			}
		},
		onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => {
			const text = e.clipboardData.getData('text');
			const pattern = splitter(separators);
			// Plain text with no separators is left alone, so pasting one tag works.
			if (!pattern.test(text)) return;
			e.preventDefault();
			add(text.split(pattern));
		},
		onBlur: () => setArmed(-1),
	};

	return {
		tags,
		draft,
		setDraft,
		armedIndex,
		flashed,
		rejection,
		announcement,
		inputProps,
		add,
		removeAt,
		max,
	};
}
