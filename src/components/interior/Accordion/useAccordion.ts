import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

const NONE: readonly string[] = [];

export type AccordionEntry = { id: string };

export type AccordionHeaderProps = {
	id: string;
	ref: (node: HTMLButtonElement | null) => void;
	type: 'button';
	onClick: () => void;
	onKeyDown: (event: React.KeyboardEvent) => void;
	'aria-expanded': boolean;
	'aria-controls': string;
};

export type AccordionPanelProps = {
	id: string;
	role: 'region';
	'aria-labelledby': string;
	'aria-hidden': true | undefined;
};

/**
 * Measures an element's natural height and keeps it current.
 *
 * The panel is never animated to `auto` — that cannot be interpolated — so its
 * real height is tracked separately and used as the target. Content that grows
 * while open (an image loading, text reflowing) updates the target instead of
 * being clipped.
 */
export function useAutoHeight() {
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);
	const [ready, setReady] = useState(false);

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;

		const read = () => {
			const next = el.getBoundingClientRect().height;
			setHeight((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
		};

		read();
		setReady(true);

		const observer = new ResizeObserver(read);
		observer.observe(el);

		return () => observer.disconnect();
	}, []);

	return { ref, height, ready };
}

export type UseAccordionOptions = {
	items: readonly AccordionEntry[];
	type?: 'single' | 'multiple';
	defaultOpen?: readonly string[];
	open?: readonly string[];
	onOpenChange?: (open: string[]) => void;
	/** When false, the last open item in single mode cannot be closed. */
	collapsible?: boolean;
};

export function useAccordion({
	items,
	type = 'single',
	defaultOpen = NONE,
	open: controlled,
	onOpenChange,
	collapsible = true,
}: UseAccordionOptions) {
	const base = useId();

	const [uncontrolled, setUncontrolled] = useState<string[]>(() =>
		type === 'single' ? defaultOpen.slice(0, 1) : defaultOpen.slice(),
	);

	const open = useMemo(
		() => (controlled ? controlled.slice() : uncontrolled),
		[controlled, uncontrolled],
	);

	const headers = useRef(new Map<string, HTMLButtonElement>());
	const binders = useRef(new Map<string, AccordionHeaderProps['ref']>());

	// Ref callbacks are cached per id so React does not detach and reattach every
	// header on each render.
	const headerRef = useCallback((id: string): AccordionHeaderProps['ref'] => {
		const cached = binders.current.get(id);
		if (cached) return cached;
		const bind = (node: HTMLButtonElement | null) => {
			if (node) headers.current.set(id, node);
			else headers.current.delete(id);
		};
		binders.current.set(id, bind);
		return bind;
	}, []);

	const changed = useRef(onOpenChange);
	changed.current = onOpenChange;

	const commit = useCallback((next: string[]) => {
		setUncontrolled(next);
		changed.current?.(next);
	}, []);

	const isOpen = useCallback((id: string) => open.includes(id), [open]);

	const toggle = useCallback(
		(id: string) => {
			const active = open.includes(id);
			if (active && !collapsible && type === 'single') return;
			if (type === 'single') {
				commit(active ? [] : [id]);
				return;
			}
			commit(active ? open.filter((x) => x !== id) : [...open, id]);
		},
		[open, type, collapsible, commit],
	);

	const order = useMemo(() => items.map((item) => item.id), [items]);

	const move = useCallback(
		(id: string, delta: number, edge: 'first' | 'last' | null) => {
			if (order.length === 0) return;
			const at = order.indexOf(id);
			if (at < 0) return;
			const next =
				edge === 'first'
					? 0
					: edge === 'last'
						? order.length - 1
						: (at + delta + order.length) % order.length;
			headers.current.get(order[next])?.focus();
		},
		[order],
	);

	const headerProps = useCallback(
		(id: string): AccordionHeaderProps => ({
			id: `${base}-header-${id}`,
			ref: headerRef(id),
			type: 'button',
			onClick: () => toggle(id),
			onKeyDown: (event: React.KeyboardEvent) => {
				if (event.key === 'ArrowDown') {
					event.preventDefault();
					move(id, 1, null);
				} else if (event.key === 'ArrowUp') {
					event.preventDefault();
					move(id, -1, null);
				} else if (event.key === 'Home') {
					event.preventDefault();
					move(id, 0, 'first');
				} else if (event.key === 'End') {
					event.preventDefault();
					move(id, 0, 'last');
				}
			},
			'aria-expanded': open.includes(id),
			'aria-controls': `${base}-panel-${id}`,
		}),
		[base, open, toggle, move, headerRef],
	);

	const panelProps = useCallback(
		(id: string): AccordionPanelProps => ({
			id: `${base}-panel-${id}`,
			role: 'region',
			'aria-labelledby': `${base}-header-${id}`,
			'aria-hidden': open.includes(id) ? undefined : true,
		}),
		[base, open],
	);

	return { open, isOpen, toggle, headerProps, panelProps };
}
