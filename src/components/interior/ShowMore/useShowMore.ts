import { useCallback, useLayoutEffect, useRef, useState } from 'react';

type Metrics = { line: number; full: number };

export type UseShowMoreOptions = {
	/** Lines visible while collapsed. */
	lines?: number;
	/** Beyond this the expanded region scrolls instead of growing, in px. */
	maxHeight?: number;
	defaultExpanded?: boolean;
	expanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
};

/**
 * Measures collapsed and expanded heights so the disclosure can be animated
 * between two known numbers rather than to `auto`.
 *
 * The line height is read from computed styles instead of assumed, so the clamp
 * lands on a line boundary whatever the type is set at — a collapsed block never
 * cuts a line of text in half.
 */
export function useShowMore({
	lines = 3,
	maxHeight = 320,
	defaultExpanded = false,
	expanded: expandedProp,
	onExpandedChange,
}: UseShowMoreOptions = {}) {
	const [uncontrolled, setUncontrolled] = useState(defaultExpanded);
	const [metrics, setMetrics] = useState<Metrics | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	const expanded = expandedProp ?? uncontrolled;

	const notify = useRef(onExpandedChange);
	notify.current = onExpandedChange;

	const setExpanded = useCallback(
		(next: boolean) => {
			if (expandedProp === undefined) setUncontrolled(next);
			notify.current?.(next);
		},
		[expandedProp],
	);

	const toggle = useCallback(() => setExpanded(!expanded), [setExpanded, expanded]);

	useLayoutEffect(() => {
		const el = contentRef.current;
		if (!el) return;

		const read = () => {
			const styles = getComputedStyle(el);
			const parsed = Number.parseFloat(styles.lineHeight);
			// `line-height: normal` does not parse; fall back to a sane ratio.
			const line = Number.isFinite(parsed) ? parsed : Number.parseFloat(styles.fontSize) * 1.5;
			const full = el.scrollHeight;

			setMetrics((prev) => (prev && prev.line === line && prev.full === full ? prev : { line, full }));
		};

		read();

		const observer = new ResizeObserver(read);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const clamped = metrics ? metrics.line * lines : 0;
	// Content that barely overflows should not offer a toggle that does nothing.
	const expandable = metrics ? metrics.full - clamped > 1 : true;
	const capped = metrics ? metrics.full > maxHeight : false;
	const collapsedHeight = metrics ? Math.min(clamped, metrics.full) : null;
	const fullHeight = metrics ? Math.min(metrics.full, maxHeight) : null;
	const open = expanded && expandable;

	return {
		contentRef,
		expanded,
		open,
		toggle,
		setExpanded,
		height: open ? fullHeight : collapsedHeight,
		collapsedHeight,
		fullHeight,
		expandable,
		capped,
		scrollable: open && capped,
	};
}
