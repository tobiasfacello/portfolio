import type { Breakpoint } from './breakpoints';
import type { TextVariant, FlexJustify, FlexDirection } from '../types';

// Helper: fill all breakpoints from partial definitions, cascading from nearest smaller
function fillBreakpoints<T>(partial: Partial<Record<Breakpoint, T>>, fallback: T): Record<Breakpoint, T> {
	const order: Breakpoint[] = ['mobile-sm', 'mobile-lg', 'tablet', 'desktop-sm', 'desktop-md', 'desktop-lg', 'desktop-xl'];
	const result = {} as Record<Breakpoint, T>;
	let last = fallback;
	for (const bp of order) {
		if (partial[bp]) last = partial[bp];
		result[bp] = last;
	}
	return result;
}

// ── About ────────────────────────────────────────────────

interface AboutConfig {
	outerW: string;
	outerMaxW?: string;
	outerH?: string;
	outerMinH?: string;
	outerGap: string;
	paragraphGap: string;
	paragraphVariant: TextVariant;
	titleAlign?: string;
	innerW?: string;
}

const desktopAbout: AboutConfig = {
	outerW: '100%', outerH: '100%', outerMinH: '450px',
	outerGap: '36px', paragraphGap: '20px', paragraphVariant: 'body', titleAlign: 'left',
};

export const aboutConfig: Record<Breakpoint, AboutConfig> = fillBreakpoints({
	'mobile-sm': { outerW: '100%', outerMaxW: '500px', outerH: '100%', outerGap: '24px', paragraphGap: '12px', paragraphVariant: 'body' },
	'mobile-lg': { outerW: '80%', outerGap: '24px', paragraphGap: '12px', paragraphVariant: 'body' },
	tablet: { outerW: '80%', outerGap: '24px', paragraphGap: '12px', paragraphVariant: 'body', titleAlign: 'left' },
	'desktop-sm': { ...desktopAbout, titleAlign: 'left' },
	'desktop-md': desktopAbout,
	'desktop-lg': { ...desktopAbout, outerMinH: '490px', paragraphVariant: 'body-lg' },
	'desktop-xl': { ...desktopAbout, outerMinH: '530px', paragraphVariant: 'body-lg', innerW: '80%' },
}, { outerW: '100%', outerGap: '24px', paragraphGap: '12px', paragraphVariant: 'body' });

// ── Skills ───────────────────────────────────────────────

interface SkillsConfig {
	outerW: string;
	outerMaxW?: string;
	outerH: string;
	outerGap?: string;
	outerJustify: FlexJustify;
	iconRowW?: string;
	iconRowJustify?: FlexJustify;
	iconWrapperH?: string;
	iconWrapperGap?: string;
	useGrid?: boolean;
	gridGap?: string;
	titleOutside: boolean;
	iconContainerP?: string[];
}

const desktopSkills: SkillsConfig = {
	outerW: '100%', outerH: '100%', outerJustify: 'space-between',
	useGrid: true, gridGap: '20px', titleOutside: false,
};

export const skillsConfig: Record<Breakpoint, SkillsConfig> = fillBreakpoints({
	'mobile-sm': { outerW: '100%', outerMaxW: '500px', outerH: '100%', outerGap: '36px', outerJustify: 'space-between', iconRowJustify: 'space-between', titleOutside: false },
	'mobile-lg': { outerW: '80%', outerH: '100%', outerGap: '36px', outerJustify: 'space-between', iconRowW: '100%', iconRowJustify: 'space-between', iconWrapperH: '70%', iconWrapperGap: '36px', titleOutside: false },
	tablet: { outerW: '80%', outerH: '100%', outerGap: '36px', outerJustify: 'space-between', iconRowW: '70%', iconRowJustify: 'space-between', iconWrapperH: '70%', iconWrapperGap: '36px', titleOutside: false },
	'desktop-sm': desktopSkills,
	'desktop-xl': { ...desktopSkills, gridGap: '24px', titleOutside: true },
}, { outerW: '100%', outerH: '100%', outerJustify: 'space-between', titleOutside: false });

// ── Projects ─────────────────────────────────────────────

interface ProjectsConfig {
	outerW: string;
	outerMaxW?: string;
	outerH: string;
	outerMinH?: string;
	outerGap: string;
	outerJustify: FlexJustify;
	cardGap: string;
}

const desktopProjects: ProjectsConfig = {
	outerW: '100%', outerH: '100%', outerMinH: '450px',
	outerGap: '36px', outerJustify: 'space-between', cardGap: '20px',
};

export const projectsConfig: Record<Breakpoint, ProjectsConfig> = fillBreakpoints({
	'mobile-sm': { outerW: '100%', outerMaxW: '500px', outerH: '100%', outerGap: '36px', outerJustify: 'center', cardGap: '12px' },
	'mobile-lg': { outerW: '80%', outerH: '100%', outerGap: '36px', outerJustify: 'center', cardGap: '12px' },
	tablet: { outerW: '80%', outerH: '100%', outerGap: '36px', outerJustify: 'center', cardGap: '12px' },
	'desktop-sm': desktopProjects,
	'desktop-lg': { ...desktopProjects, outerMinH: '490px' },
	'desktop-xl': { ...desktopProjects, outerMinH: '530px' },
}, { outerW: '100%', outerH: '100%', outerGap: '36px', outerJustify: 'center', cardGap: '12px' });

// ── Works ────────────────────────────────────────────────

interface WorksConfig {
	titleOutside: boolean;
	titleM?: string[];
	outerW: string;
	outerMaxW?: string;
	outerH: string;
	outerGap: string;
	carouselCss?: string;
	carouselMinH?: string;
	carouselW?: string;
	carouselDirection?: FlexDirection;
}

const desktopWorks: WorksConfig = {
	titleOutside: true, titleM: ['36', '0', '0', '0'],
	outerW: '100%', outerH: 'auto', outerGap: '36px',
	carouselCss: 'overflow: hidden;', carouselMinH: '402px',
	carouselW: '100%', carouselDirection: 'row',
};

export const worksConfig: Record<Breakpoint, WorksConfig> = fillBreakpoints({
	'mobile-sm': { titleOutside: false, outerW: '100%', outerMaxW: '500px', outerH: '100%', outerGap: '36px' },
	'mobile-lg': { titleOutside: false, outerW: '80%', outerH: '100%', outerGap: '36px' },
	tablet: { titleOutside: false, outerW: '80%', outerH: '100%', outerGap: '36px', carouselCss: 'overflow: hidden;', carouselW: '100vw' },
	'desktop-sm': desktopWorks,
}, { titleOutside: false, outerW: '100%', outerH: '100%', outerGap: '36px' });

// ── Carousel ─────────────────────────────────────────────

interface CarouselConfig {
	useSwiper: boolean;
	slidesPerView?: number;
	centeredSlides?: boolean;
	spaceBetween?: number;
}

const desktopCarousel: CarouselConfig = { useSwiper: true, slidesPerView: 2, centeredSlides: false, spaceBetween: 10 };

export const carouselConfig: Record<Breakpoint, CarouselConfig> = fillBreakpoints({
	'mobile-sm': { useSwiper: false },
	tablet: { useSwiper: true, slidesPerView: 1, centeredSlides: true, spaceBetween: 5 },
	'desktop-sm': desktopCarousel,
	'desktop-xl': { useSwiper: true, slidesPerView: 3, centeredSlides: false, spaceBetween: 10 },
}, { useSwiper: false });

// ── Activity Feed ────────────────────────────────────────

interface ActivityFeedConfig {
	outerW: string;
	outerMaxW?: string;
	outerGap: string;
	gridColumns: number;
	gridGap: string;
}

const desktopActivity: ActivityFeedConfig = { outerW: '100%', outerGap: '24px', gridColumns: 3, gridGap: '12px' };

export const activityFeedConfig: Record<Breakpoint, ActivityFeedConfig> = fillBreakpoints({
	'mobile-sm': { outerW: '100%', outerMaxW: '500px', outerGap: '24px', gridColumns: 1, gridGap: '12px' },
	'mobile-lg': { outerW: '80%', outerGap: '24px', gridColumns: 1, gridGap: '12px' },
	tablet: { outerW: '80%', outerGap: '24px', gridColumns: 3, gridGap: '12px' },
	'desktop-sm': desktopActivity,
}, { outerW: '100%', outerGap: '24px', gridColumns: 1, gridGap: '12px' });

// ── GitHub Calendar ──────────────────────────────────────

interface GitHubCalendarConfig {
	squareGap: number;
	squareRadius: number;
	showDayLabels: boolean;
	showMonthLabels: boolean;
}

export const gitHubCalendarConfig: Record<Breakpoint, GitHubCalendarConfig> = fillBreakpoints({
	'mobile-sm': { squareGap: 3, squareRadius: 2, showDayLabels: false, showMonthLabels: true },
	tablet: { squareGap: 3, squareRadius: 3, showDayLabels: true, showMonthLabels: true },
	'desktop-md': { squareGap: 4, squareRadius: 3, showDayLabels: true, showMonthLabels: true },
}, { squareGap: 3, squareRadius: 2, showDayLabels: false, showMonthLabels: true });
