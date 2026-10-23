import { BREAKPOINTS, type Breakpoint } from '../config/breakpoints';

// External store behind BreakpointProvider / useBreakpoint / useBreakpointValue.
// One set of matchMedia listeners for the whole app; subscribers are notified
// only when the resolved breakpoint actually changes.

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

export function attachMqls() {
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

export function detachMqls() {
	mqlSubscribers -= 1;
	if (mqlSubscribers === 0) {
		for (const mql of mqls) {
			mql.removeEventListener('change', handleMqlChange);
		}
	}
}

export function subscribeBreakpoint(callback: () => void) {
	listeners.add(callback);
	return () => {
		listeners.delete(callback);
	};
}

export function getBreakpointSnapshot() {
	return cachedBreakpoint;
}

export function getServerBreakpointSnapshot() {
	return 'mobile-sm' as Breakpoint;
}
