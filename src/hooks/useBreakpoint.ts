import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS } from '../config/breakpoints';

export type { Breakpoint } from '../config/breakpoints';
import type { Breakpoint } from '../config/breakpoints';

export function useBreakpoint(): Breakpoint {
	const isDesktopXl = useMediaQuery({ minWidth: BREAKPOINTS['desktop-xl'] });
	const isDesktopLg = useMediaQuery({ minWidth: BREAKPOINTS['desktop-lg'] });
	const isDesktopMd = useMediaQuery({ minWidth: BREAKPOINTS['desktop-md'] });
	const isDesktopSm = useMediaQuery({ minWidth: BREAKPOINTS['desktop-sm'] });
	const isTablet = useMediaQuery({ minWidth: BREAKPOINTS.tablet });
	const isMobileLg = useMediaQuery({ minWidth: BREAKPOINTS['mobile-lg'] });

	if (isDesktopXl) return 'desktop-xl';
	if (isDesktopLg) return 'desktop-lg';
	if (isDesktopMd) return 'desktop-md';
	if (isDesktopSm) return 'desktop-sm';
	if (isTablet) return 'tablet';
	if (isMobileLg) return 'mobile-lg';
	return 'mobile-sm';
}

export function isMobile(bp: Breakpoint): boolean {
	return bp === 'mobile-sm' || bp === 'mobile-lg';
}

export function isDesktop(bp: Breakpoint): boolean {
	return bp.startsWith('desktop');
}
