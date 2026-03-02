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

type BpOrPx = Breakpoint | number;
const resolve = (bp: BpOrPx): number => typeof bp === 'number' ? bp : BREAKPOINTS[bp];

export const mq = {
	up: (bp: BpOrPx) => `@media (min-width: ${resolve(bp)}px)`,
	down: (bp: BpOrPx) => `@media (max-width: ${resolve(bp) - 1}px)`,
	between: (min: BpOrPx, max: BpOrPx) =>
		`@media (min-width: ${resolve(min)}px) and (max-width: ${resolve(max) - 1}px)`,
};
