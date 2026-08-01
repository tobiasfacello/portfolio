//! React
import { useCallback, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

//! GSAP
import { gsap } from '../../../lib/gsap';

//? Hooks
import { usePresence } from '../../../hooks/usePresence';
import { useDialog } from '../shared/useDialog';
import { useCommandPalette, type CommandItem } from './useCommandPalette';

//? Lib
import { SPRINGS, EASE_SMOOTH_OUT } from '../../../lib/motion';

//* Styled
import {
	StyledPaletteOverlay,
	StyledPaletteBackdrop,
	StyledPalettePanel,
	StyledPaletteHeader,
	StyledPaletteInput,
	StyledPaletteList,
	StyledPaletteRow,
	StyledPaletteLabel,
	StyledPaletteHint,
	StyledPaletteKeys,
	StyledPaletteKey,
	StyledPaletteEmpty,
} from './styled';
import { StyledVisuallyHidden } from '../shared/styled';

export type CommandPaletteProps = {
	open: boolean;
	onClose: () => void;
	items: CommandItem[];
	onSelect: (item: CommandItem) => void;
	placeholder?: string;
	label?: string;
	emptyLabel?: string;
};

function CommandPalette({
	open,
	onClose,
	items,
	onSelect,
	placeholder = 'Type a command',
	label = 'Command palette',
	emptyLabel = 'No matching commands',
}: CommandPaletteProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);
	const listId = useId();

	const { query, setQuery, results, activeId, listRef, run, pointerActivate, onKeyDown } =
		useCommandPalette({
			items,
			onSelect: (item) => {
				onSelect(item);
				onClose();
			},
			onDismiss: onClose,
		});

	const { target, overlayRef, panelRef, overlayProps, panelProps } = useDialog({
		open,
		onClose,
		// The palette owns Escape itself, so the input can clear before closing.
		closeOnEscape: false,
		initialFocusRef: inputRef,
	});

	const { isMounted, ref: presenceRef } = usePresence<HTMLDivElement>(open, {
		enter: (_element, { reducedMotion }) => {
			const timeline = gsap.timeline();
			if (backdropRef.current) {
				timeline.fromTo(
					backdropRef.current,
					{ opacity: 0 },
					{ opacity: 1, duration: reducedMotion ? 0 : 0.2, ease: EASE_SMOOTH_OUT },
					0,
				);
			}
			if (panelRef.current) {
				timeline.fromTo(
					panelRef.current,
					{ opacity: 0, scale: reducedMotion ? 1 : 0.97, y: reducedMotion ? 0 : -10 },
					{
						opacity: 1,
						scale: 1,
						y: 0,
						duration: reducedMotion ? 0 : SPRINGS.cell.duration,
						ease: SPRINGS.cell.ease,
					},
					0,
				);
			}
			return timeline;
		},
		exit: (_element, { reducedMotion }) => {
			const timeline = gsap.timeline();
			const duration = reducedMotion ? 0 : 0.13;
			if (panelRef.current) {
				timeline.to(panelRef.current, { opacity: 0, scale: reducedMotion ? 1 : 0.98, duration, ease: 'power2.in' }, 0);
			}
			if (backdropRef.current) {
				timeline.to(backdropRef.current, { opacity: 0, duration, ease: 'power2.in' }, 0);
			}
			return timeline;
		},
	});

	const setOverlay = useCallback(
		(node: HTMLDivElement | null) => {
			presenceRef.current = node;
			overlayRef.current = node;
		},
		[presenceRef, overlayRef],
	);

	// Reopening should always start from a blank query, not the last search.
	useEffect(() => {
		if (open) setQuery('');
	}, [open, setQuery]);

	if (!target || !isMounted) return null;

	return createPortal(
		<StyledPaletteOverlay ref={setOverlay} {...overlayProps}>
			<StyledPaletteBackdrop ref={backdropRef} aria-hidden="true" />

			<StyledPalettePanel ref={panelRef} {...panelProps} aria-label={label}>
				<StyledPaletteHeader>
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" style={{ opacity: 0.5 }}>
						<circle cx="6.4" cy="6.4" r="4.5" stroke="currentColor" strokeWidth="1.4" />
						<path d="M9.8 9.8 L13.2 13.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
					</svg>

					<StyledPaletteInput
						ref={inputRef}
						type="text"
						role="combobox"
						aria-expanded
						aria-controls={listId}
						aria-activedescendant={activeId ? `${listId}-${activeId}` : undefined}
						aria-label={label}
						autoComplete="off"
						spellCheck={false}
						placeholder={placeholder}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={onKeyDown}
					/>
				</StyledPaletteHeader>

				{results.length === 0 ? (
					<StyledPaletteEmpty>{emptyLabel}</StyledPaletteEmpty>
				) : (
					<StyledPaletteList ref={listRef} id={listId} role="listbox" aria-label={label}>
						{results.map((item) => (
							<StyledPaletteRow
								key={item.id}
								id={`${listId}-${item.id}`}
								role="option"
								aria-selected={item.id === activeId}
								onPointerMove={(event) => pointerActivate(item.id, event)}
								onClick={() => run(item)}
								$active={item.id === activeId}
							>
								<StyledPaletteLabel>{item.label}</StyledPaletteLabel>
								{item.hint ? <StyledPaletteHint>{item.hint}</StyledPaletteHint> : null}
								{item.shortcut ? (
									<StyledPaletteKeys aria-hidden="true">
										{item.shortcut.map((key) => (
											<StyledPaletteKey key={key}>{key}</StyledPaletteKey>
										))}
									</StyledPaletteKeys>
								) : null}
							</StyledPaletteRow>
						))}
					</StyledPaletteList>
				)}

				<StyledVisuallyHidden role="status" aria-live="polite">
					{`${results.length} ${results.length === 1 ? 'command' : 'commands'}`}
				</StyledVisuallyHidden>
			</StyledPalettePanel>
		</StyledPaletteOverlay>,
		target,
	);
}

export default CommandPalette;
