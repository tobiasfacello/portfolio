export const BREAKPOINTS = {
	'mobile-sm': 0,
	'mobile-lg': 768,
	tablet: 960,
	'desktop-sm': 1280,
	'desktop-md': 1340,
	'desktop-lg': 1440,
	'desktop-xl': 1801,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
