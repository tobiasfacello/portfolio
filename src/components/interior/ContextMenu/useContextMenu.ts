import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

/** Row metrics, used to predict the menu's height before it is rendered. */
const ITEM_H = 32;
const SEP_H = 9;
const PAD = 5;
const BORDER = 1;

export type ContextMenuItem =
	| { id: string; type: 'separator' }
	| {
			id: string;
			type?: 'item';
			label: string;
			shortcut?: string;
			icon?: ReactNode;
			disabled?: boolean;
			onSelect?: (id: string) => void;
		};

export type ContextMenuPlacement = {
	left: number;
	top: number;
	width: number;
	maxHeight: number;
	transformOrigin: string;
};

export type UseContextMenuOptions = {
	items: ContextMenuItem[];
	onSelect?: (id: string) => void;
	width?: number;
	margin?: number;
	/** Long-press duration that opens the menu on touch, in ms. */
	holdDuration?: number;
	moveTolerance?: number;
	disabled?: boolean;
};

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), Math.max(min, max));
}

function measure(items: ContextMenuItem[]) {
	let height = PAD * 2 + BORDER * 2;
	for (const item of items) height += item.type === 'separator' ? SEP_H : ITEM_H;
	return height;
}

/**
 * A context menu that opens where you asked, and scales out of that point.
 *
 * The height is computed from the item list rather than measured after paint,
 * so the menu can be placed correctly on the first frame instead of flipping
 * once it has been rendered. Touch gets a long press with a movement tolerance,
 * and the click that ends that press is swallowed so it does not immediately
 * select whatever is underneath.
 */
export function useContextMenu({
	items,
	onSelect,
	width = 224,
	margin = 8,
	holdDuration = 460,
	moveTolerance = 8,
	disabled = false,
}: UseContextMenuOptions) {
	const [placement, setPlacement] = useState<ContextMenuPlacement | null>(null);
	const [active, setActive] = useState(-1);

	const triggerRef = useRef<HTMLDivElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const opened = useRef(false);
	const activeRef = useRef(-1);
	const hold = useRef<ReturnType<typeof setTimeout> | null>(null);
	const holdFrom = useRef<{ x: number; y: number } | null>(null);
	const swallowClick = useRef(false);
	const query = useRef('');
	const queryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	activeRef.current = active;

	const list = useRef(items);
	list.current = items;
	const emit = useRef(onSelect);
	emit.current = onSelect;

	const height = useMemo(() => measure(items), [items]);

	/** Indices that can actually be landed on — separators and disabled skipped. */
	const steps = useMemo(
		() =>
			items.reduce<number[]>((acc, item, index) => {
				if (item.type !== 'separator' && !item.disabled) acc.push(index);
				return acc;
			}, []),
		[items],
	);
	const stepsRef = useRef(steps);
	stepsRef.current = steps;

	const clearHold = useCallback(() => {
		if (hold.current !== null) clearTimeout(hold.current);
		hold.current = null;
		holdFrom.current = null;
	}, []);

	const close = useCallback(
		(restoreFocus = false) => {
			clearHold();
			if (!opened.current) return;
			opened.current = false;
			setPlacement(null);
			setActive(-1);
			if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
		},
		[clearHold],
	);

	const openAt = useCallback(
		(x: number, y: number, source: 'pointer' | 'keyboard' = 'pointer') => {
			if (disabled || list.current.length === 0) return;

			const vw = document.documentElement.clientWidth;
			const vh = document.documentElement.clientHeight;
			const w = Math.min(width, Math.max(160, vw - margin * 2));
			const cap = Math.max(ITEM_H + PAD * 2, vh - margin * 2);
			const h = Math.min(height, cap);

			// Prefer down-right of the cursor; flip only when it will not fit.
			const left = clamp(x + w + margin <= vw ? x : x - w, margin, vw - w - margin);
			const top = clamp(y + h + margin <= vh ? y : y - h, margin, vh - h - margin);

			opened.current = true;
			setPlacement({
				left,
				top,
				width: w,
				maxHeight: cap,
				// Anchored to the click, so the menu grows out of the point you aimed at.
				transformOrigin: `${clamp(x - left, 0, w)}px ${clamp(y - top, 0, h)}px`,
			});
			// Opening by keyboard lands on the first item; by pointer it waits.
			setActive(source === 'keyboard' ? (stepsRef.current[0] ?? -1) : -1);
		},
		[disabled, height, margin, width],
	);

	const choose = useCallback(
		(index: number) => {
			const item = list.current[index];
			if (!item || item.type === 'separator' || item.disabled) return;
			close(true);
			item.onSelect?.(item.id);
			emit.current?.(item.id);
		},
		[close],
	);

	const step = useCallback((dir: 1 | -1) => {
		const order = stepsRef.current;
		if (order.length === 0) return;
		const at = order.indexOf(activeRef.current);
		setActive(
			at === -1
				? dir === 1
					? order[0]
					: order[order.length - 1]
				: order[(at + dir + order.length) % order.length],
		);
	}, []);

	const typeahead = useCallback((char: string) => {
		if (queryTimer.current) clearTimeout(queryTimer.current);
		query.current += char.toLowerCase();
		queryTimer.current = setTimeout(() => {
			query.current = '';
		}, 600);

		const order = stepsRef.current;
		const from = order.indexOf(activeRef.current);
		for (let k = 1; k <= order.length; k++) {
			const index = order[(from + k + order.length) % order.length];
			const item = list.current[index];
			if (item && item.type !== 'separator' && item.label.toLowerCase().startsWith(query.current)) {
				setActive(index);
				return;
			}
		}
	}, []);

	// Any scroll or resize invalidates a position pinned to viewport coordinates.
	useEffect(() => {
		if (!placement) return;

		const bail = () => close(false);
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			event.preventDefault();
			event.stopPropagation();
			close(true);
		};

		window.addEventListener('scroll', bail, true);
		window.addEventListener('resize', bail);
		window.addEventListener('blur', bail);
		document.addEventListener('keydown', onKeyDown, true);

		return () => {
			window.removeEventListener('scroll', bail, true);
			window.removeEventListener('resize', bail);
			window.removeEventListener('blur', bail);
			document.removeEventListener('keydown', onKeyDown, true);
		};
	}, [placement, close]);

	useEffect(() => {
		if (!placement) return;
		menuRef.current?.focus({ preventScroll: true });
	}, [placement]);

	useEffect(
		() => () => {
			if (hold.current !== null) clearTimeout(hold.current);
			if (queryTimer.current) clearTimeout(queryTimer.current);
		},
		[],
	);

	const triggerProps = {
		ref: triggerRef,
		tabIndex: 0,
		onContextMenu: (event: React.MouseEvent) => {
			if (disabled) return;
			event.preventDefault();
			openAt(event.clientX, event.clientY);
		},
		onPointerDown: (event: React.PointerEvent) => {
			if (disabled || event.pointerType !== 'touch') return;
			holdFrom.current = { x: event.clientX, y: event.clientY };
			const { clientX, clientY } = event;
			hold.current = setTimeout(() => {
				hold.current = null;
				swallowClick.current = true;
				openAt(clientX, clientY);
			}, holdDuration);
		},
		onPointerMove: (event: React.PointerEvent) => {
			const from = holdFrom.current;
			if (!from || hold.current === null) return;
			// A drag is a scroll, not a long press.
			if (Math.hypot(event.clientX - from.x, event.clientY - from.y) > moveTolerance) clearHold();
		},
		onPointerUp: clearHold,
		onPointerCancel: clearHold,
		onClick: (event: React.MouseEvent) => {
			if (!swallowClick.current) return;
			swallowClick.current = false;
			event.preventDefault();
			event.stopPropagation();
		},
		onKeyDown: (event: React.KeyboardEvent) => {
			// The keyboard menu key, or Shift+F10 — both mean "context menu here".
			if (event.key !== 'ContextMenu' && !(event.key === 'F10' && event.shiftKey)) return;
			event.preventDefault();
			const rect = triggerRef.current?.getBoundingClientRect();
			if (!rect) return;
			openAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 'keyboard');
		},
	};

	const menuProps = {
		ref: menuRef,
		role: 'menu' as const,
		tabIndex: -1,
		onKeyDown: (event: React.KeyboardEvent) => {
			if (event.key === 'ArrowDown') {
				event.preventDefault();
				step(1);
			} else if (event.key === 'ArrowUp') {
				event.preventDefault();
				step(-1);
			} else if (event.key === 'Home') {
				event.preventDefault();
				setActive(stepsRef.current[0] ?? -1);
			} else if (event.key === 'End') {
				event.preventDefault();
				setActive(stepsRef.current[stepsRef.current.length - 1] ?? -1);
			} else if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				choose(activeRef.current);
			} else if (event.key === 'Tab') {
				event.preventDefault();
				close(true);
			} else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
				event.preventDefault();
				typeahead(event.key);
			}
		},
	};

	const getItemProps = useCallback(
		(index: number) => ({
			ref: (node: HTMLButtonElement | null) => {
				itemRefs.current[index] = node;
			},
			role: 'menuitem' as const,
			type: 'button' as const,
			tabIndex: -1,
			onPointerMove: () => setActive(index),
			onClick: () => choose(index),
		}),
		[choose],
	);

	return { placement, active, open: placement !== null, openAt, close, triggerProps, menuProps, getItemProps };
}
