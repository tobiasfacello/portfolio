import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

//! Lenis
import { useLenis } from 'lenis/react';

const FOCUSABLE = [
	'a[href]',
	'area[href]',
	"button:not([disabled])",
	"input:not([disabled]):not([type='hidden'])",
	'select:not([disabled])',
	'textarea:not([disabled])',
	'iframe',
	'summary',
	"[contenteditable='true']",
	"[tabindex]:not([tabindex='-1'])",
].join(',');

/** Focusable descendants, in DOM order, excluding anything not actually reachable. */
export function focusableWithin(root: HTMLElement): HTMLElement[] {
	return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
		(el) =>
			el.tabIndex !== -1 &&
			!el.hasAttribute('inert') &&
			el.getAttribute('aria-hidden') !== 'true' &&
			el.getClientRects().length > 0,
	);
}

/**
 * Scroll lock is reference-counted across every dialog on the page, so closing
 * one while another is still open does not hand scrolling back early.
 */
let locks = 0;
let releaseLock: (() => void) | null = null;

function lockDocumentScroll() {
	locks += 1;
	if (locks > 1) return;

	const body = document.body;
	// Compensate for the scrollbar the lock removes, or the page shifts sideways
	// the moment a dialog opens.
	const gap = window.innerWidth - document.documentElement.clientWidth;
	const overflow = body.style.overflow;
	const paddingRight = body.style.paddingRight;
	const base = Number.parseFloat(window.getComputedStyle(body).paddingRight);

	body.style.overflow = 'hidden';
	if (gap > 0) {
		body.style.paddingRight = `${(Number.isFinite(base) ? base : 0) + gap}px`;
	}

	releaseLock = () => {
		body.style.overflow = overflow;
		body.style.paddingRight = paddingRight;
	};
}

function unlockDocumentScroll() {
	locks = Math.max(0, locks - 1);
	if (locks > 0) return;
	releaseLock?.();
	releaseLock = null;
}

/**
 * Only the topmost dialog reacts to Escape, so closing a confirm dialog opened
 * from a modal does not dismiss both at once.
 */
const escapeStack: object[] = [];

export type UseDialogOptions = {
	open: boolean;
	onClose: () => void;
	closeOnEscape?: boolean;
	closeOnBackdrop?: boolean;
	lockScroll?: boolean;
	/** Focused on open instead of the first focusable descendant. */
	initialFocusRef?: React.RefObject<HTMLElement | null>;
	container?: HTMLElement | null;
	/** Hides siblings from assistive tech while open. */
	trapSiblings?: boolean;
};

/**
 * The shared behaviour behind every dialog-like overlay in the set: portal
 * target, focus trap and restore, Escape handling, backdrop dismissal and
 * scroll lock.
 */
export function useDialog({
	open,
	onClose,
	closeOnEscape = true,
	closeOnBackdrop = true,
	lockScroll = true,
	initialFocusRef,
	container,
	trapSiblings = true,
}: UseDialogOptions) {
	const [target, setTarget] = useState<HTMLElement | null>(null);

	const overlayRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const downedOutside = useRef(false);

	const baseId = useId();
	const titleId = `${baseId}-title`;
	const descriptionId = `${baseId}-description`;

	const lenis = useLenis();

	const latest = useRef({ onClose, closeOnEscape, closeOnBackdrop, initialFocusRef });
	latest.current = { onClose, closeOnEscape, closeOnBackdrop, initialFocusRef };

	const close = useCallback(() => latest.current.onClose(), []);

	useEffect(() => {
		setTarget(container === undefined ? document.body : container);
	}, [container]);

	// Lenis keeps its own scroll loop running, so the native overflow lock alone
	// would not stop smooth scrolling underneath the dialog.
	useLayoutEffect(() => {
		if (!open || !lockScroll) return;
		lockDocumentScroll();
		lenis?.stop();
		return () => {
			unlockDocumentScroll();
			lenis?.start();
		};
	}, [open, lockScroll, lenis]);

	useEffect(() => {
		if (!open || !target || !trapSiblings) return;
		const overlay = overlayRef.current;
		const parent = overlay?.parentElement;
		if (!overlay || !parent) return;

		const changed: Array<[Element, string | null]> = [];
		for (const child of Array.from(parent.children)) {
			if (child === overlay) continue;
			changed.push([child, child.getAttribute('inert')]);
			child.setAttribute('inert', '');
		}

		return () => {
			for (const [child, previous] of changed) {
				if (previous === null) child.removeAttribute('inert');
				else child.setAttribute('inert', previous);
			}
		};
	}, [open, target, trapSiblings]);

	useEffect(() => {
		if (!open) return;
		const token = {};
		escapeStack.push(token);

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			if (escapeStack[escapeStack.length - 1] !== token) return;
			if (!latest.current.closeOnEscape) return;
			event.preventDefault();
			event.stopPropagation();
			latest.current.onClose();
		};

		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			const index = escapeStack.indexOf(token);
			if (index > -1) escapeStack.splice(index, 1);
		};
	}, [open]);

	// A click on something outside can still move focus out of the panel; pull it
	// back rather than letting the tab order escape the dialog.
	useEffect(() => {
		if (!open || !target) return;
		const onFocusIn = (event: FocusEvent) => {
			const panel = panelRef.current;
			const node = event.target as Node | null;
			if (!panel || !node || panel.contains(node)) return;
			panel.focus({ preventScroll: true });
		};
		document.addEventListener('focusin', onFocusIn);
		return () => document.removeEventListener('focusin', onFocusIn);
	}, [open, target]);

	useEffect(() => {
		if (!open || !target) return;
		const panel = panelRef.current;
		if (!panel) return;

		const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		const preferred = latest.current.initialFocusRef?.current;
		(preferred ?? focusableWithin(panel)[0] ?? panel).focus({ preventScroll: true });

		return () => {
			if (previous && previous.isConnected) previous.focus({ preventScroll: true });
		};
	}, [open, target]);

	const onKeyDown = useCallback((event: React.KeyboardEvent) => {
		if (event.key !== 'Tab') return;
		const panel = panelRef.current;
		if (!panel) return;

		const items = focusableWithin(panel);
		if (items.length === 0) {
			event.preventDefault();
			panel.focus({ preventScroll: true });
			return;
		}

		const first = items[0];
		const last = items[items.length - 1];
		const active = document.activeElement;

		if (event.shiftKey && (active === first || active === panel)) {
			event.preventDefault();
			last.focus({ preventScroll: true });
			return;
		}
		if (!event.shiftKey && active === last) {
			event.preventDefault();
			first.focus({ preventScroll: true });
		}
	}, []);

	// A drag that starts inside the panel and ends on the backdrop — selecting
	// text, for instance — must not be read as a dismissal.
	const onPointerDown = useCallback((event: React.PointerEvent) => {
		const panel = panelRef.current;
		downedOutside.current = !panel?.contains(event.target as Node);
	}, []);

	const onClick = useCallback((event: React.MouseEvent) => {
		const panel = panelRef.current;
		if (!latest.current.closeOnBackdrop) return;
		if (panel?.contains(event.target as Node)) return;
		if (!downedOutside.current) return;
		downedOutside.current = false;
		latest.current.onClose();
	}, []);

	return {
		target,
		titleId,
		descriptionId,
		overlayRef,
		panelRef,
		overlayProps: { onPointerDown, onClick },
		panelProps: {
			role: 'dialog' as const,
			'aria-modal': true as const,
			'aria-labelledby': titleId,
			tabIndex: -1 as const,
			onKeyDown,
		},
		close,
	};
}
