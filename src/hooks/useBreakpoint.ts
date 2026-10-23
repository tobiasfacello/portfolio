import { useContext, useSyncExternalStore } from 'react';
import { BreakpointContext } from '../context/BreakpointContext';
import { subscribeBreakpoint, getBreakpointSnapshot, getServerBreakpointSnapshot } from '../context/breakpointStore';
import type { Breakpoint } from '../config/breakpoints';

export type { Breakpoint } from '../config/breakpoints';

export function useBreakpoint(): Breakpoint {
	return useContext(BreakpointContext);
}

/**
 * Subscribes to a derived slice of the breakpoint — a responsive config entry,
 * a boolean — and re-renders only when that slice changes. Responsive configs
 * share one object across neighbouring breakpoints (see fillBreakpoints), so a
 * section reading `config[bp]` skips the re-render when a resize crosses into a
 * breakpoint with the same config. `select` must return a stable value
 * (a config entry or a primitive), never a fresh object.
 */
export function useBreakpointValue<T>(select: (bp: Breakpoint) => T): T {
	return useSyncExternalStore(
		subscribeBreakpoint,
		() => select(getBreakpointSnapshot()),
		() => select(getServerBreakpointSnapshot()),
	);
}

export function isMobile(bp: Breakpoint): boolean {
	return bp === 'mobile-sm' || bp === 'mobile-lg';
}

export function isDesktop(bp: Breakpoint): boolean {
	return bp.startsWith('desktop');
}
