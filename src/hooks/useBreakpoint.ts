import { useContext } from 'react';
import { BreakpointContext } from '../context/BreakpointContext';
import type { Breakpoint } from '../config/breakpoints';

export type { Breakpoint } from '../config/breakpoints';

export function useBreakpoint(): Breakpoint {
	return useContext(BreakpointContext);
}

export function isMobile(bp: Breakpoint): boolean {
	return bp === 'mobile-sm' || bp === 'mobile-lg';
}
