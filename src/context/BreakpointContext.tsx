import { createContext, useEffect, useSyncExternalStore, ReactNode } from 'react';
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
let cachedBreakpoint: Breakpoint =
	typeof window !== 'undefined' ? computeBreakpoint() : 'mobile-sm';

function handleMqlChange() {
	const next = computeBreakpoint();
	if (next !== cachedBreakpoint) {
		cachedBreakpoint = next;
		listeners.forEach((cb) => cb());
	}
}

let mqlSubscribers = 0;

function attachMqls() {
	mqlSubscribers += 1;
	if (mqlSubscribers === 1) {
		// Re-read before attaching in case the viewport changed between
		// module init and the first provider mount.
		cachedBreakpoint = computeBreakpoint();
		for (const mql of mqls) {
			mql.addEventListener('change', handleMqlChange);
		}
	}
}

function detachMqls() {
	mqlSubscribers -= 1;
	if (mqlSubscribers === 0) {
		for (const mql of mqls) {
			mql.removeEventListener('change', handleMqlChange);
		}
	}
}

function subscribe(callback: () => void) {
	listeners.add(callback);
	return () => {
		listeners.delete(callback);
	};
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

	useEffect(() => {
		attachMqls();
		return detachMqls;
	}, []);

	return <BreakpointContext.Provider value={bp}>{children}</BreakpointContext.Provider>;
}
