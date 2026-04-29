import { useRef, useState, useLayoutEffect, useCallback } from 'react';

interface UseTechPillDegradationResult {
	techIconOnly: boolean;
	cardRef: React.RefObject<HTMLElement | null>;
	contentRef: React.RefObject<HTMLElement | null>;
	logoRef: React.RefObject<HTMLElement | null>;
}

// Watches the tech-pill row and collapses it to icon-only when it collides
// with the card's logo. Also flips back to full text when there's room again.
export function useTechPillDegradation(gap = 16): UseTechPillDegradationResult {
	const [techIconOnly, setTechIconOnly] = useState(false);

	const cardRef = useRef<HTMLElement | null>(null);
	const contentRef = useRef<HTMLElement | null>(null);
	const logoRef = useRef<HTMLElement | null>(null);

	const techIconOnlyRef = useRef(false);
	const techFullWidthRef = useRef(0);

	const recompute = useCallback(() => {
		if (!contentRef.current || !logoRef.current) return;

		const img = logoRef.current.querySelector('img');
		if (!img) return;
		const imgRect = img.getBoundingClientRect();
		if (imgRect.width === 0) return;

		const rows = contentRef.current.children;
		const techRow = rows[rows.length - 1] as HTMLElement | undefined;
		if (!techRow) return;

		const contentRect = contentRef.current.getBoundingClientRect();
		const availableWidth = imgRect.left - contentRect.left;
		const techRect = techRow.getBoundingClientRect();

		if (!techIconOnlyRef.current && techRect.width > 0) {
			techFullWidthRef.current = techRect.width;
		}

		let next: boolean;
		if (techRect.right + gap > imgRect.left) {
			next = true;
		} else if (techIconOnlyRef.current) {
			next = techFullWidthRef.current + gap > availableWidth;
		} else {
			next = false;
		}

		// Skip render when the collapse decision didn't change.
		if (next === techIconOnlyRef.current) return;
		techIconOnlyRef.current = next;
		setTechIconOnly(next);
	}, [gap]);

	useLayoutEffect(() => {
		const card = cardRef.current;
		if (!card) return;

		recompute();

		let lastWidth = card.getBoundingClientRect().width;
		const observer = new ResizeObserver((entries) => {
			const width = entries[0].contentRect.width;
			// Coarse debounce: only react to width deltas the layout would notice.
			if (Math.abs(width - lastWidth) < 1) return;
			lastWidth = width;
			recompute();
		});

		observer.observe(card);
		return () => observer.disconnect();
	}, [recompute]);

	return { techIconOnly, cardRef, contentRef, logoRef };
}
