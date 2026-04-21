import { useRef, useState, useLayoutEffect } from 'react';

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
	const [resizeTick, setResizeTick] = useState(0);

	const cardRef = useRef<HTMLElement | null>(null);
	const contentRef = useRef<HTMLElement | null>(null);
	const logoRef = useRef<HTMLElement | null>(null);

	const techIconOnlyRef = useRef(false);
	const techFullWidthRef = useRef(0);

	useLayoutEffect(() => {
		const card = cardRef.current;
		if (!card) return;

		setResizeTick((t) => t + 1);

		const observer = new ResizeObserver(() => {
			setResizeTick((t) => t + 1);
		});

		observer.observe(card);
		return () => observer.disconnect();
	}, []);

	useLayoutEffect(() => {
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

		setTechIconOnly(next);
		techIconOnlyRef.current = next;
	}, [resizeTick, gap]);

	return { techIconOnly, cardRef, contentRef, logoRef };
}
