import { useMediaQuery } from 'react-responsive';

export type Breakpoint =
	| 'mobile-sm'
	| 'mobile-lg'
	| 'tablet'
	| 'desktop-sm'
	| 'desktop-md'
	| 'desktop-lg'
	| 'desktop-xl';

export function useBreakpoint(): Breakpoint {
	const isDesktopXl = useMediaQuery({ minWidth: 1801 });
	const isDesktopLg = useMediaQuery({ minWidth: 1440 });
	const isDesktopMd = useMediaQuery({ minWidth: 1340 });
	const isDesktopSm = useMediaQuery({ minWidth: 1280 });
	const isTablet = useMediaQuery({ minWidth: 960 });
	const isMobileLg = useMediaQuery({ minWidth: 768 });

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
