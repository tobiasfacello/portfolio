//! React
import { useId, useMemo, useRef } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useExitList } from '../shared/useExitList';
import { useTagInput, type UseTagInputOptions } from './useTagInput';

//? Lib
import { SPRINGS, motionSafe } from '../../../lib/motion';

//* Styled
import {
	StyledTagRoot,
	StyledTagLabel,
	StyledTagField,
	StyledTagChip,
	StyledTagChipLabel,
	StyledTagRemove,
	StyledTagDraft,
	StyledTagGhost,
	StyledTagInput,
	StyledTagFooter,
	StyledTagMessages,
	StyledTagMessage,
	StyledTagCount,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type TagInputProps = UseTagInputOptions & {
	label?: string;
	placeholder?: string;
	hint?: string;
};

type ChipProps = {
	tag: string;
	lit: boolean;
	exiting: boolean;
	reducedMotion: boolean;
	onRemove: () => void;
	onExited: () => void;
};

function TagChip({ tag, lit, exiting, reducedMotion, onRemove, onExited }: ChipProps) {
	const ref = useRef<HTMLLIElement>(null);
	const exited = useRef(onExited);
	exited.current = onExited;

	useGSAP(() => {
		const node = ref.current;
		if (!node) return;

		const chip = motionSafe(SPRINGS.snap, reducedMotion);

		if (exiting) {
			gsap.to(node, {
				opacity: 0,
				scale: reducedMotion ? 1 : 0.9,
				duration: reducedMotion ? 0 : 0.18,
				ease: 'power2.in',
				onComplete: () => exited.current(),
			});
			return;
		}

		gsap.fromTo(
			node,
			{ opacity: 0, scale: reducedMotion ? 1 : 0.9 },
			{ opacity: 1, scale: 1, duration: chip.duration, ease: chip.ease },
		);
	}, [exiting, reducedMotion]);

	return (
		<StyledTagChip ref={ref} role="listitem" $lit={lit} style={{ opacity: 0 }}>
			<StyledTagChipLabel>{tag}</StyledTagChipLabel>
			<StyledTagRemove
				type="button"
				tabIndex={-1}
				aria-label={`Remove ${tag}`}
				// Keeps focus in the input, so removing does not close the field.
				onMouseDown={(e) => e.preventDefault()}
				onClick={onRemove}
			>
				<svg
					viewBox="0 0 10 10"
					width="9"
					height="9"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.6}
					strokeLinecap="round"
				>
					<path d="M2.6 2.6 7.4 7.4M7.4 2.6 2.6 7.4" />
				</svg>
			</StyledTagRemove>
		</StyledTagChip>
	);
}

function TagInput({ label, placeholder = 'Add a tag', hint = 'Enter adds · Backspace removes', ...options }: TagInputProps) {
	const { tags, draft, armedIndex, flashed, rejection, announcement, inputProps, removeAt, max } =
		useTagInput(options);

	const prefersReducedMotion = usePrefersReducedMotion();
	const inputRef = useRef<HTMLInputElement>(null);
	const hintRef = useRef<HTMLParagraphElement>(null);
	const refusalRef = useRef<HTMLParagraphElement>(null);
	const uid = useId();
	const inputId = `${uid}-tag-input`;
	const hintId = `${uid}-tag-hint`;

	// Duplicates are allowed when opted in, so keys are disambiguated by
	// occurrence rather than by value alone.
	const rows = useMemo(() => {
		const seen = new Map<string, number>();
		return tags.map((tag) => {
			const n = seen.get(tag) ?? 0;
			seen.set(tag, n + 1);
			return { tag, key: n === 0 ? tag : `${tag}#${n}` };
		});
	}, [tags]);

	const { entries, remove } = useExitList(rows, (row) => row.key);

	const message = !rejection
		? ''
		: rejection.reason === 'duplicate'
			? `${rejection.tag} is already in the list`
			: rejection.reason === 'limit'
				? `That is the limit of ${max} tags`
				: `${rejection.tag} is not allowed here`;

	const showMessage = rejection?.visible === true;

	useGSAP(() => {
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);
		if (hintRef.current) {
			gsap.to(hintRef.current, {
				opacity: showMessage ? 0 : 1,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
		if (refusalRef.current) {
			gsap.to(refusalRef.current, {
				opacity: showMessage ? 1 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
	}, [showMessage, prefersReducedMotion]);

	return (
		<StyledTagRoot>
			{label ? <StyledTagLabel htmlFor={inputId}>{label}</StyledTagLabel> : null}

			<StyledTagField
				onPointerDown={(e) => {
					if (e.target !== e.currentTarget) return;
					e.preventDefault();
					inputRef.current?.focus();
				}}
			>
				{entries.map((entry, index) => (
					<TagChip
						key={entry.key}
						tag={entry.item.tag}
						lit={armedIndex === index || flashed === entry.item.tag}
						exiting={entry.exiting}
						reducedMotion={prefersReducedMotion}
						onRemove={() => {
							removeAt(index);
							inputRef.current?.focus();
						}}
						onExited={() => remove(entry.key)}
					/>
				))}

				<StyledTagDraft>
					<StyledTagGhost aria-hidden="true">{draft || placeholder}</StyledTagGhost>
					<StyledTagInput
						{...inputProps}
						ref={inputRef}
						id={inputId}
						type="text"
						aria-describedby={hintId}
						aria-label={label ? undefined : 'Tags'}
						placeholder={placeholder}
						autoComplete="off"
						autoCapitalize="off"
						autoCorrect="off"
						spellCheck={false}
						enterKeyHint="done"
					/>
				</StyledTagDraft>
			</StyledTagField>

			<StyledTagFooter>
				<StyledTagMessages>
					<StyledTagMessage ref={hintRef} id={hintId} $tone="hint">
						{hint}
					</StyledTagMessage>
					<StyledTagMessage
						ref={refusalRef}
						aria-hidden="true"
						$tone="refusal"
						style={{ opacity: 0 }}
					>
						{message}
					</StyledTagMessage>
				</StyledTagMessages>

				{max === undefined ? null : (
					<StyledTagCount>
						{tags.length} / {max}
					</StyledTagCount>
				)}
			</StyledTagFooter>

			<StyledVisuallyHidden role="status" aria-live="polite" aria-atomic="true">
				{announcement}
			</StyledVisuallyHidden>
		</StyledTagRoot>
	);
}

export default TagInput;
