//! React
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

//! GSAP
import { gsap, useGSAP } from '../../../lib/gsap';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import { useExpandingSearch, type UseExpandingSearchOptions } from './useExpandingSearch';

//? Lib
import { SPRINGS, spring, motionSafe } from '../../../lib/motion';

//* Styled
import {
	COLLAPSED,
	TEXT_LEFT,
	CLEAR_SLOT,
	COUNT_SLOT,
	StyledSearchRoot,
	StyledSearchShell,
	StyledSearchInput,
	StyledSearchTrailing,
	StyledSearchCount,
	StyledSearchClear,
	StyledSearchTrigger,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

const DISCLOSE = spring({ stiffness: 380, damping: 38, mass: 0.7 });
const ANNOUNCE_DELAY = 500;

export type ExpandingSearchProps = UseExpandingSearchOptions & {
	label?: string;
	placeholder?: string;
	resultCount?: number;
	align?: 'left' | 'right';
};

function ExpandingSearch({
	label = 'Search',
	placeholder = 'Search',
	resultCount,
	align = 'right',
	...options
}: ExpandingSearchProps) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const auto = useId();
	const inputId = `${auto}-field`;

	const { open, focused, query, clear, inputRef, rootProps, triggerProps, inputProps } =
		useExpandingSearch(options);

	const trackRef = useRef<HTMLDivElement>(null);
	const shellRef = useRef<HTMLDivElement>(null);
	const fieldRef = useRef<HTMLInputElement>(null);
	const trailingRef = useRef<HTMLDivElement>(null);
	const clearRef = useRef<HTMLButtonElement>(null);
	const triggerElRef = useRef<HTMLButtonElement>(null);

	// The expanded width is whatever the container gives it, remeasured on resize.
	const [track, setTrack] = useState(0);
	useLayoutEffect(() => {
		const el = trackRef.current;
		if (!el) return;
		const read = (w: number) => setTrack((prev) => (Math.abs(prev - w) < 0.5 ? prev : w));
		read(el.getBoundingClientRect().width);
		const observer = new ResizeObserver((entries) => {
			const box = entries[0];
			if (box) read(box.contentRect.width);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const expanded = Math.max(COLLAPSED, track);
	const rightInset = CLEAR_SLOT + (resultCount === undefined ? 0 : COUNT_SLOT);
	const inner = Math.max(0, expanded - TEXT_LEFT - rightInset);
	const filled = query.length > 0;

	useGSAP(() => {
		const shell = motionSafe(DISCLOSE, prefersReducedMotion);

		if (shellRef.current) {
			gsap.to(shellRef.current, {
				width: open ? expanded : COLLAPSED,
				duration: shell.duration,
				ease: shell.ease,
			});
		}
		// The trigger slides by exactly the growth, so it stays visually anchored.
		if (triggerElRef.current) {
			gsap.to(triggerElRef.current, {
				x: align === 'right' && open ? -(expanded - COLLAPSED) : 0,
				duration: shell.duration,
				ease: shell.ease,
			});
		}
	}, [open, expanded, align, prefersReducedMotion]);

	useGSAP(() => {
		const fade = motionSafe(SPRINGS.crossfade, prefersReducedMotion);

		if (fieldRef.current) {
			// The text waits a beat so it does not appear before there is room.
			gsap.to(fieldRef.current, {
				opacity: open ? 1 : 0,
				duration: fade.duration,
				delay: prefersReducedMotion || !open ? 0 : 0.06,
				ease: fade.ease,
			});
		}
		if (trailingRef.current) {
			gsap.to(trailingRef.current, {
				opacity: open ? 1 : 0,
				duration: fade.duration,
				ease: fade.ease,
			});
		}
		if (clearRef.current) {
			const cell = motionSafe(SPRINGS.cell, prefersReducedMotion);
			gsap.to(clearRef.current, {
				opacity: filled ? 1 : 0,
				scale: filled ? 1 : 0.86,
				duration: cell.duration,
				ease: cell.ease,
			});
		}
	}, [open, filled, prefersReducedMotion]);

	const [announced, setAnnounced] = useState('');
	useEffect(() => {
		const id = setTimeout(() => {
			if (!open || query.length === 0 || resultCount === undefined) {
				setAnnounced('');
				return;
			}
			setAnnounced(`${resultCount} ${resultCount === 1 ? 'result' : 'results'} for ${query}`);
		}, ANNOUNCE_DELAY);
		return () => clearTimeout(id);
	}, [open, query, resultCount]);

	const { ref: inputPropRef, ...restInputProps } = inputProps;
	const { ref: triggerPropRef, ...restTriggerProps } = triggerProps;

	return (
		<StyledSearchRoot ref={trackRef} role="search" {...rootProps}>
			<StyledSearchShell
				ref={shellRef}
				$align={align}
				$focused={focused}
				style={{ width: COLLAPSED }}
				onMouseDown={(event) => {
					// Clicking the shell's padding should reach the field, not steal focus.
					if (event.target !== event.currentTarget) return;
					event.preventDefault();
					if (open) inputRef.current?.focus();
				}}
			>
				<StyledSearchInput
					{...restInputProps}
					ref={(node) => {
						inputPropRef.current = node;
						fieldRef.current = node;
					}}
					id={inputId}
					type="search"
					placeholder={placeholder}
					aria-label={label}
					aria-describedby={`${auto}-live`}
					autoComplete="off"
					spellCheck={false}
					enterKeyHint="search"
					style={{ width: inner, left: TEXT_LEFT, opacity: 0 }}
				/>

				<StyledSearchTrailing ref={trailingRef} style={{ opacity: 0 }}>
					{resultCount === undefined ? null : (
						<StyledSearchCount aria-hidden="true">{filled ? resultCount : ''}</StyledSearchCount>
					)}

					<StyledSearchClear
						ref={clearRef}
						type="button"
						onClick={clear}
						tabIndex={open && filled ? 0 : -1}
						aria-label="Clear search"
						aria-controls={inputId}
						$active={open && filled}
					>
						<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
							<path
								d="M1.7 1.7 L9.3 9.3 M9.3 1.7 L1.7 9.3"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>
					</StyledSearchClear>
				</StyledSearchTrailing>
			</StyledSearchShell>

			<StyledSearchTrigger
				{...restTriggerProps}
				ref={(node) => {
					triggerPropRef.current = node;
					triggerElRef.current = node;
				}}
				aria-label={label}
				aria-controls={inputId}
				$align={align}
				$open={open}
			>
				<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
					<circle cx="6.4" cy="6.4" r="4.5" stroke="currentColor" strokeWidth="1.4" />
					<path d="M9.8 9.8 L13.2 13.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
				</svg>
			</StyledSearchTrigger>

			<StyledVisuallyHidden id={`${auto}-live`} aria-live="polite">
				{announced}
			</StyledVisuallyHidden>
		</StyledSearchRoot>
	);
}

export default ExpandingSearch;
