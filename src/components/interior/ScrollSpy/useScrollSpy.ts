import { useCallback, useEffect, useRef, useState } from 'react';

//? Hooks
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

/** Delay before an active section is announced, in ms. */
const SETTLE = 420;
/** How long a programmatic scroll keeps its target pinned, in ms. */
const RELEASE = 900;

export type ScrollSpySection = {
	id: string;
	label: string;
};

export type UseScrollSpyOptions = {
	sections: ScrollSpySection[];
	/** Distance from the top that counts as "reading here", in px. */
	offset?: number;
	root?: React.RefObject<HTMLElement | null>;
	onChange?: (id: string) => void;
};

/**
 * Tracks which section is being read.
 *
 * The detection line slides from the offset down to the bottom of the viewport
 * as the page scrolls. A fixed line can never select the last section — there
 * is not enough scroll left to push it past — so a short final section would be
 * permanently unreachable in the nav.
 *
 * Clicking a link pins its target until the smooth scroll arrives, otherwise
 * the sections passed on the way would each flash active in turn. Touching the
 * wheel or the screen abandons that pin immediately: the user has taken over.
 */
export function useScrollSpy({ sections, offset = 96, root, onChange }: UseScrollSpyOptions) {
	const prefersReducedMotion = usePrefersReducedMotion();

	const [activeId, setActiveId] = useState(() => sections[0]?.id ?? '');
	const [announce, setAnnounce] = useState('');

	const list = useRef(sections);
	list.current = sections;
	const emit = useRef(onChange);
	emit.current = onChange;

	const frame = useRef(0);
	const lock = useRef<string | null>(null);
	const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const started = useRef(false);

	const key = sections.map((s) => s.id).join('|');

	const measure = useCallback(() => {
		const items = list.current;
		if (items.length === 0) return '';

		const container = root?.current ?? null;

		const viewport = container ? container.clientHeight : window.innerHeight;
		const top = container ? container.scrollTop : window.scrollY;
		const max = container
			? container.scrollHeight - container.clientHeight
			: document.documentElement.scrollHeight - window.innerHeight;
		const ratio = max > 0 ? Math.min(1, Math.max(0, top / max)) : 1;

		const line =
			(container ? container.getBoundingClientRect().top : 0) +
			offset +
			ratio * Math.max(0, viewport - offset - 1);

		let current = '';
		let last = '';

		for (const item of items) {
			const node = document.getElementById(item.id);
			if (!node) continue;
			last = item.id;
			if (!current) current = item.id;
			if (node.getBoundingClientRect().top <= line + 1) current = item.id;
		}

		const atEnd = container
			? container.scrollTop + container.clientHeight >= container.scrollHeight - 2
			: window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

		return atEnd && last ? last : current;
	}, [offset, root]);

	const release = useCallback(() => {
		lock.current = null;
		if (lockTimer.current) {
			clearTimeout(lockTimer.current);
			lockTimer.current = null;
		}
	}, []);

	const sync = useCallback(() => {
		if (frame.current) return;
		frame.current = requestAnimationFrame(() => {
			frame.current = 0;
			const next = measure();
			if (!next) return;
			if (lock.current) {
				if (lock.current === next) release();
				return;
			}
			setActiveId((prev) => (prev === next ? prev : next));
		});
	}, [measure, release]);

	useEffect(() => {
		const container = root?.current ?? null;
		const scroller: EventTarget = container ?? window;
		const abandon = () => {
			if (lock.current) release();
		};

		scroller.addEventListener('scroll', sync, { passive: true });
		window.addEventListener('resize', sync);
		window.addEventListener('wheel', abandon, { passive: true });
		window.addEventListener('touchstart', abandon, { passive: true });

		const observer = new ResizeObserver(sync);
		observer.observe(container ?? document.documentElement);
		for (const id of key ? key.split('|') : []) {
			const node = document.getElementById(id);
			if (node) observer.observe(node);
		}

		sync();

		return () => {
			scroller.removeEventListener('scroll', sync);
			window.removeEventListener('resize', sync);
			window.removeEventListener('wheel', abandon);
			window.removeEventListener('touchstart', abandon);
			observer.disconnect();
			cancelAnimationFrame(frame.current);
			frame.current = 0;
			if (lockTimer.current) clearTimeout(lockTimer.current);
		};
	}, [sync, release, key, root]);

	useEffect(() => {
		if (!activeId) return;
		emit.current?.(activeId);

		// Scrolling past several sections would otherwise queue an announcement
		// for each; only the one you stop on is read out. The first is skipped
		// entirely — arriving on a page is not a navigation event.
		if (!started.current) {
			started.current = true;
			return;
		}

		settleTimer.current = setTimeout(() => {
			const item = list.current.find((s) => s.id === activeId);
			setAnnounce(item ? item.label : '');
		}, SETTLE);

		return () => {
			if (settleTimer.current) clearTimeout(settleTimer.current);
		};
	}, [activeId]);

	const scrollTo = useCallback(
		(id: string) => {
			const node = document.getElementById(id);
			if (!node) return;

			lock.current = id;
			setActiveId(id);

			const container = root?.current ?? null;
			const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
			const rect = node.getBoundingClientRect();

			const viewport = container ? container.clientHeight : window.innerHeight;
			const max = container
				? Math.max(0, container.scrollHeight - container.clientHeight)
				: Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
			const distance = container
				? rect.top - container.getBoundingClientRect().top + container.scrollTop
				: rect.top + window.scrollY;
			// Solve for the scroll position at which the sliding line lands on this
			// section, rather than assuming the line is fixed at the offset.
			const usable = Math.max(0, viewport - offset - 1);
			const top = max > 0 ? Math.min(max, Math.max(0, (distance - offset) / (1 + usable / max))) : 0;

			if (container) container.scrollTo({ top, behavior });
			else window.scrollTo({ top, behavior });

			// Move focus to the section, so a keyboard user continues from there
			// rather than from the nav they just left.
			if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
			node.focus({ preventScroll: true });

			if (lockTimer.current) clearTimeout(lockTimer.current);
			lockTimer.current = setTimeout(() => {
				lock.current = null;
				lockTimer.current = null;
				sync();
			}, RELEASE);
		},
		[offset, prefersReducedMotion, root, sync],
	);

	const getLinkProps = useCallback(
		(id: string) => ({
			href: `#${id}`,
			'aria-current': id === activeId ? ('location' as const) : undefined,
			onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
				// Leave modified clicks to the browser — they mean "open elsewhere".
				if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
				e.preventDefault();
				scrollTo(id);
			},
		}),
		[activeId, scrollTo],
	);

	return {
		activeId,
		activeIndex: sections.findIndex((s) => s.id === activeId),
		scrollTo,
		getLinkProps,
		announce,
	};
}
