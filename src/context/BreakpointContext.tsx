import { createContext, useEffect, useSyncExternalStore, ReactNode } from 'react';
import type { Breakpoint } from '../config/breakpoints';
import {
	attachMqls,
	detachMqls,
	subscribeBreakpoint,
	getBreakpointSnapshot,
	getServerBreakpointSnapshot,
} from './breakpointStore';

export const BreakpointContext = createContext<Breakpoint>('mobile-sm');

export function BreakpointProvider({ children }: { children: ReactNode }) {
	const bp = useSyncExternalStore(subscribeBreakpoint, getBreakpointSnapshot, getServerBreakpointSnapshot);

	useEffect(() => {
		attachMqls();
		return detachMqls;
	}, []);

	return <BreakpointContext.Provider value={bp}>{children}</BreakpointContext.Provider>;
}
