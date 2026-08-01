import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Corner radius of a floating panel — the arrow is kept this far from a corner. */
const PANEL_RADIUS = 11;
const MIN_WIDTH = 160;
const MIN_HEIGHT = 88;

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';

const FLIP: Record<PopoverSide, PopoverSide> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
};

/** Where a panel starts from, so it appears to come out of its anchor. */
export const SIDE_OFFSET: Record<PopoverSide, { x: number; y: number }> = {
	top: { x: 0, y: 6 },
	bottom: { x: 0, y: -6 },
	left: { x: 6, y: 0 },
	right: { x: -6, y: 0 },
};

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), Math.max(min, max));
}

export type UsePopoverOptions = {
	open: boolean;
	side?: PopoverSide;
	align?: PopoverAlign;
	/** Gap between anchor and panel, in px. */
	offset?: number;
	/** Minimum distance kept from the boundary edges, in px. */
	padding?: number;
	arrowSize?: number;
	/** Constrains the panel to an element instead of the viewport. */
	boundary?: React.RefObject<HTMLElement | null>;
};

/**
 * Positions a floating panel against an anchor.
 *
 * The panel flips to the opposite side when the preferred one cannot hold it,
 * is clamped inside the boundary, and gets a max-height so a long list scrolls
 * instead of running off screen. The transform origin is pinned to the arrow,
 * so the panel scales out of the point it is attached to rather than its own
 * centre.
 */
export function usePopover<A extends HTMLElement = HTMLElement>({
	open,
	side = 'bottom',
	align = 'center',
	offset = 10,
	padding = 8,
	arrowSize = 9,
	boundary,
}: UsePopoverOptions) {
	const anchorRef = useRef<A>(null);
	const floatingRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const arrowRef = useRef<HTMLSpanElement>(null);

	const [resolved, setResolved] = useState<PopoverSide>(side);

	const update = useCallback(() => {
		const anchor = anchorRef.current;
		const wrap = floatingRef.current;
		const panel = panelRef.current;
		if (!anchor || !wrap || !panel) return;

		const content = contentRef.current;
		// Measure unconstrained first; last pass's limits would otherwise decide
		// this pass's flip.
		panel.style.maxWidth = '';
		if (content) content.style.maxHeight = '';

		const a = anchor.getBoundingClientRect();
		const b = boundary?.current?.getBoundingClientRect() ?? null;
		const vw = document.documentElement.clientWidth;
		const vh = document.documentElement.clientHeight;

		const left = b ? Math.max(padding, b.left + padding) : padding;
		const top = b ? Math.max(padding, b.top + padding) : padding;
		const right = b ? Math.min(vw - padding, b.right - padding) : vw - padding;
		const bottom = b ? Math.min(vh - padding, b.bottom - padding) : vh - padding;

		panel.style.maxWidth = `${Math.max(MIN_WIDTH, right - left)}px`;

		const room: Record<PopoverSide, number> = {
			top: a.top - top - offset,
			bottom: bottom - a.bottom - offset,
			left: a.left - left - offset,
			right: right - a.right - offset,
		};

		let next = side;
		const wanted = next === 'top' || next === 'bottom' ? panel.offsetHeight : panel.offsetWidth;
		if (room[next] < wanted && room[FLIP[next]] > room[next]) next = FLIP[next];

		const vertical = next === 'top' || next === 'bottom';
		if (!vertical) {
			panel.style.maxWidth = `${Math.max(MIN_WIDTH, Math.min(right - left, room[next]))}px`;
		}
		if (content) {
			const chrome = panel.offsetHeight - content.offsetHeight;
			const allowed = vertical ? room[next] : bottom - top;
			content.style.maxHeight = `${Math.max(MIN_HEIGHT, allowed - chrome)}px`;
		}

		const w = panel.offsetWidth;
		const h = panel.offsetHeight;

		let x: number;
		let y: number;
		if (vertical) {
			y = next === 'top' ? a.top - offset - h : a.bottom + offset;
			x = align === 'start' ? a.left : align === 'end' ? a.right - w : a.left + (a.width - w) / 2;
		} else {
			x = next === 'left' ? a.left - offset - w : a.right + offset;
			y = align === 'start' ? a.top : align === 'end' ? a.bottom - h : a.top + (a.height - h) / 2;
		}
		x = clamp(x, left, right - w);
		y = clamp(y, top, bottom - h);

		// The wrapper may sit inside a positioned ancestor, so convert the viewport
		// coordinates into whatever space it is actually laid out in.
		const base = wrap.getBoundingClientRect();
		const originX = base.left - (Number.parseFloat(wrap.style.left) || 0);
		const originY = base.top - (Number.parseFloat(wrap.style.top) || 0);
		wrap.style.left = `${Math.round(x - originX)}px`;
		wrap.style.top = `${Math.round(y - originY)}px`;

		const half = arrowSize / 2;
		const point = vertical
			? clamp(a.left + a.width / 2 - x, PANEL_RADIUS + half, w - PANEL_RADIUS - half)
			: clamp(a.top + a.height / 2 - y, PANEL_RADIUS + half, h - PANEL_RADIUS - half);

		panel.style.transformOrigin = vertical
			? `${Math.round(point)}px ${next === 'top' ? h : 0}px`
			: `${next === 'left' ? w : 0}px ${Math.round(point)}px`;

		const arrow = arrowRef.current;
		if (arrow) {
			if (vertical) {
				arrow.style.left = `${Math.round(point - half)}px`;
				arrow.style.top = `${Math.round(next === 'top' ? h - half : -half)}px`;
			} else {
				arrow.style.top = `${Math.round(point - half)}px`;
				arrow.style.left = `${Math.round(next === 'left' ? w - half : -half)}px`;
			}
		}

		setResolved((prev) => (prev === next ? prev : next));
	}, [side, align, offset, padding, arrowSize, boundary]);

	useLayoutEffect(() => {
		if (!open) return;
		update();
	}, [open, update]);

	// Anything that can move the anchor reschedules a single measurement per
	// frame — scrolling a long page would otherwise thrash layout.
	useEffect(() => {
		if (!open) return;

		let frame = 0;
		const schedule = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				update();
			});
		};

		const observer = new ResizeObserver(schedule);
		if (anchorRef.current) observer.observe(anchorRef.current);
		if (contentRef.current) observer.observe(contentRef.current);
		window.addEventListener('scroll', schedule, true);
		window.addEventListener('resize', schedule);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('scroll', schedule, true);
			window.removeEventListener('resize', schedule);
		};
	}, [open, update]);

	return { anchorRef, floatingRef, panelRef, contentRef, arrowRef, side: resolved, update };
}
