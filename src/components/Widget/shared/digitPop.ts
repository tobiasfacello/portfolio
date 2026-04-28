import { useState, useRef, useCallback } from 'react';
import { css, keyframes } from 'styled-components';

export const POP_IN_DUR_MS = 500;
export const POP_IN_STAGGER_MS = 70;

// Shared "translateY 8px → 0 + blur 2px → 0 + opacity 0 → 1" entry.
// Used both per-character on numeric values (digit pop-in) and per-row on
// staggered list items across widgets.
export const popInFromBelow = keyframes`
	0%   { transform: translateY(8px); opacity: 0; filter: blur(2px); }
	100% { transform: translateY(0); opacity: 1; filter: blur(0); }
`;

export const popInAnimation = css`
	animation: ${popInFromBelow} ${POP_IN_DUR_MS}ms cubic-bezier(0.34, 1.45, 0.64, 1) both;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

// Per-field swap controller: tracks the displayed value and exposes a setter
// that updates state and ref atomically, so handlers can compare prev vs new
// synchronously without waiting for a render.
export function useTooltipSwap<T>() {
	const [displayed, setDisplayedState] = useState<T | null>(null);
	const valueRef = useRef<T | null>(null);

	const setValue = useCallback((next: T | null) => {
		setDisplayedState(next);
		valueRef.current = next;
	}, []);

	return { displayed, setValue, valueRef };
}
