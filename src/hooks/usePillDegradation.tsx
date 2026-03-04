import { useRef, useState, useLayoutEffect, useMemo } from 'react';
import { PillDisplay } from '../types';
import type { PillDisplayLevel } from '../types';
import type { AnimationName } from '../components/UnicodeAnimations/animations';

//* Components
import PillTag from '../components/Pill';
import { MeasureContainer } from '../components/ProjectCard/styled';

interface UsePillDegradationOptions {
	tag: string;
	animationName?: AnimationName;
	gap?: number;
}

interface UsePillDegradationResult {
	level: PillDisplayLevel;
	techIconOnly: boolean;
	ready: boolean;
	cardRef: React.RefObject<HTMLElement | null>;
	contentRef: React.RefObject<HTMLElement | null>;
	logoRef: React.RefObject<HTMLElement | null>;
	measureLayer: React.ReactElement;
}

function decidePillLevel(
	titleWidth: number,
	pillWidths: Record<PillDisplayLevel, number>,
	availableWidth: number,
	emergencyOverlap: boolean,
	gap: number,
): PillDisplayLevel {
	if (emergencyOverlap) return PillDisplay.HIDDEN;

	const rowGap = 8;
	const levels: PillDisplayLevel[] = [PillDisplay.FULL, PillDisplay.ICON_ONLY];

	for (const level of levels) {
		if (titleWidth + rowGap + pillWidths[level] + gap <= availableWidth) {
			return level;
		}
	}

	return PillDisplay.HIDDEN;
}

export function usePillDegradation(options: UsePillDegradationOptions): UsePillDegradationResult {
	const { tag, animationName, gap = 16 } = options;

	const [level, setLevel] = useState<PillDisplayLevel>(PillDisplay.FULL);
	const [techIconOnly, setTechIconOnly] = useState(false);
	const [ready, setReady] = useState(false);
	const [resizeTick, setResizeTick] = useState(0);

	const cardRef = useRef<HTMLElement | null>(null);
	const contentRef = useRef<HTMLElement | null>(null);
	const logoRef = useRef<HTMLElement | null>(null);

	const pillFullRef = useRef<HTMLElement | null>(null);
	const pillIconRef = useRef<HTMLElement | null>(null);

	const pillWidthsRef = useRef<Record<PillDisplayLevel, number>>({
		[PillDisplay.FULL]: 0,
		[PillDisplay.ICON_ONLY]: 0,
		[PillDisplay.HIDDEN]: 0,
	});
	const textKeyRef = useRef('');

	// Tech pill state: ref mirrors state for sync reads inside effect
	const techIconOnlyRef = useRef(false);
	const techFullWidthRef = useRef(0);

	// ResizeObserver setup — increments resizeTick on each resize
	useLayoutEffect(() => {
		const card = cardRef.current;
		if (!card) return;

		// Trigger initial measurement
		setResizeTick((t) => t + 1);

		const observer = new ResizeObserver(() => {
			setResizeTick((t) => t + 1);
		});

		observer.observe(card);
		return () => observer.disconnect();
	}, []);

	// Measurement + decision — runs before browser paint
	useLayoutEffect(() => {
		if (!contentRef.current || !logoRef.current) return;

		const img = logoRef.current.querySelector('img');
		if (!img) return;
		const imgRect = img.getBoundingClientRect();
		if (imgRect.width === 0) return;

		const rows = contentRef.current.children;
		if (rows.length === 0) return;

		const contentRect = contentRef.current.getBoundingClientRect();
		const availableWidth = imgRect.left - contentRect.left;

		// --- Title row: measure title text width ---
		const titleRow = rows[0] as HTMLElement;
		const titleEl = titleRow.children[0] as HTMLElement | undefined;
		const titleWidth = titleEl ? titleEl.getBoundingClientRect().width : 0;

		// Cache pill widths — invalidate when text changes
		const currentTextKey = tag;
		if (textKeyRef.current !== currentTextKey) {
			textKeyRef.current = currentTextKey;
			if (pillFullRef.current) {
				pillWidthsRef.current[PillDisplay.FULL] = pillFullRef.current.getBoundingClientRect().width;
			}
			if (pillIconRef.current) {
				pillWidthsRef.current[PillDisplay.ICON_ONLY] = pillIconRef.current.getBoundingClientRect().width;
			}
		}

		// --- Tech row: collision detection ---
		let newTechIconOnly = false;
		if (rows.length > 2) {
			const techRow = rows[2] as HTMLElement;
			const techRect = techRow.getBoundingClientRect();

			// Cache full-text width when showing full text
			if (!techIconOnlyRef.current && techRect.width > 0) {
				techFullWidthRef.current = techRect.width;
			}

			if (techRect.right + gap > imgRect.left) {
				// Current tech pills collide with logo
				newTechIconOnly = true;
			} else if (techIconOnlyRef.current) {
				// Currently icon-only — check if full text would fit again
				newTechIconOnly = techFullWidthRef.current + gap > availableWidth;
			}
		}

		// --- Emergency overlap: details row only (rows[1]) ---
		// Tech row handles its own degradation via techIconOnly
		let emergencyOverlap = false;
		if (rows.length > 1) {
			const detailsRow = rows[1] as HTMLElement;
			const detailsRect = detailsRow.getBoundingClientRect();
			if (detailsRect.width > 0) {
				const children = detailsRow.children;
				const maxRight = children.length === 0 ? detailsRect.right : 0;
				let right = maxRight;
				for (let j = 0; j < children.length; j++) {
					const rect = (children[j] as HTMLElement).getBoundingClientRect();
					if (rect.width > 0) right = Math.max(right, rect.right);
				}
				if (right > imgRect.left) {
					emergencyOverlap = true;
				}
			}
		}

		// --- Decide pill level ---
		const newLevel = decidePillLevel(
			titleWidth,
			pillWidthsRef.current,
			availableWidth,
			emergencyOverlap,
			gap,
		);

		setLevel(newLevel);
		setTechIconOnly(newTechIconOnly);
		techIconOnlyRef.current = newTechIconOnly;
		if (!ready) setReady(true);
	}, [resizeTick, gap, tag, ready]);

	// Hidden measurement layer — FULL (with tag) and ICON_ONLY (no tag)
	const defaultPadding = ['4', '8', '4', '6'];
	const iconOnlyPadding = ['4', '6', '4', '6'];

	const measureLayer = useMemo(
		() => (
			<MeasureContainer>
				<span ref={pillFullRef as React.Ref<HTMLSpanElement>}>
					<PillTag tag={tag} animationName={animationName} p={defaultPadding} />
				</span>
				<span ref={pillIconRef as React.Ref<HTMLSpanElement>}>
					<PillTag animationName={animationName} p={iconOnlyPadding} />
				</span>
			</MeasureContainer>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tag, animationName],
	);

	return { level, techIconOnly, ready, cardRef, contentRef, logoRef, measureLayer };
}
