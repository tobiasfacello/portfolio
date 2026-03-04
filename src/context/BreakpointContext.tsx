import { createContext, useSyncExternalStore, ReactNode } from 'react';
import { BREAKPOINTS, type Breakpoint } from '../config/breakpoints';

const breakpointOrder: { key: Breakpoint; minWidth: number }[] = [
	{ key: 'desktop-xl', minWidth: BREAKPOINTS['desktop-xl'] },
	{ key: 'desktop-lg', minWidth: BREAKPOINTS['desktop-lg'] },
	{ key: 'desktop-md', minWidth: BREAKPOINTS['desktop-md'] },
	{ key: 'desktop-sm', minWidth: BREAKPOINTS['desktop-sm'] },
	{ key: 'tablet', minWidth: BREAKPOINTS.tablet },
	{ key: 'mobile-lg', minWidth: BREAKPOINTS['mobile-lg'] },
];

const mqls = typeof window !== 'undefined'
	? breakpointOrder.map(({ minWidth }) => window.matchMedia(`(min-width: ${minWidth}px)`))
	: [];

function computeBreakpoint(): Breakpoint {
	for (let i = 0; i < breakpointOrder.length; i++) {
		if (mqls[i].matches) return breakpointOrder[i].key;
	}
	return 'mobile-sm';
}

const listeners = new Set<() => void>();
let cachedBreakpoint = typeof window !== 'undefined' ? computeBreakpoint() : 'mobile-sm' as Breakpoint;

if (typeof window !== 'undefined') {
	for (const mql of mqls) {
		mql.addEventListener('change', () => {
			const next = computeBreakpoint();
			if (next !== cachedBreakpoint) {
				cachedBreakpoint = next;
				listeners.forEach((cb) => cb());
			}
		});
	}
}

function subscribe(callback: () => void) {
	listeners.add(callback);
	return () => { listeners.delete(callback); };
}

function getSnapshot() {
	return cachedBreakpoint;
}

function getServerSnapshot() {
	return 'mobile-sm' as Breakpoint;
}

export const BreakpointContext = createContext<Breakpoint>('mobile-sm');

export function BreakpointProvider({ children }: { children: ReactNode }) {
	const bp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	return <BreakpointContext.Provider value={bp}>{children}</BreakpointContext.Provider>;
}
