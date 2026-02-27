import type { Breakpoint } from './breakpoints';
import type { TextVariant } from '../types';

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

export const aboutConfig: Record<Breakpoint, AboutConfig> = {
	'mobile-sm': {
		outerW: '100%',
		outerMaxW: '500px',
		outerH: '100%',
		outerGap: '24px',
		paragraphGap: '12px',
		paragraphVariant: 'body',
	},
	'mobile-lg': {
		outerW: '80%',
		outerGap: '24px',
		paragraphGap: '12px',
		paragraphVariant: 'body',
	},
	tablet: {
		outerW: '80%',
		outerGap: '24px',
		paragraphGap: '12px',
		paragraphVariant: 'body',
		titleAlign: 'left',
	},
	'desktop-sm': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '450px',
		outerGap: '36px',
		paragraphGap: '20px',
		paragraphVariant: 'body',
		titleAlign: 'left',
	},
	'desktop-md': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '450px',
		outerGap: '36px',
		paragraphGap: '20px',
		paragraphVariant: 'body',
	},
	'desktop-lg': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '490px',
		outerGap: '36px',
		paragraphGap: '20px',
		paragraphVariant: 'body-lg',
	},
	'desktop-xl': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '530px',
		outerGap: '36px',
		paragraphGap: '20px',
		paragraphVariant: 'body-lg',
		innerW: '80%',
	},
};

interface SkillsConfig {
	outerW: string;
	outerMaxW?: string;
	outerH: string;
	outerGap?: string;
	outerJustify: string;
	iconRowW?: string;
	iconRowJustify?: string;
	iconWrapperH?: string;
	iconWrapperGap?: string;
	useGrid?: boolean;
	gridGap?: string;
	titleOutside: boolean;
	iconContainerP?: string[];
}

export const skillsConfig: Record<Breakpoint, SkillsConfig> = {
	'mobile-sm': {
		outerW: '100%',
		outerMaxW: '500px',
		outerH: '100%',
		outerGap: '36px',
		outerJustify: 'space-between',
		iconRowJustify: 'space-between',
		titleOutside: false,
	},
	'mobile-lg': {
		outerW: '80%',
		outerH: '100%',
		outerGap: '36px',
		outerJustify: 'space-between',
		iconRowW: '100%',
		iconRowJustify: 'space-between',
		iconWrapperH: '70%',
		iconWrapperGap: '36px',
		titleOutside: false,
	},
	tablet: {
		outerW: '80%',
		outerH: '100%',
		outerGap: '36px',
		outerJustify: 'space-between',
		iconRowW: '70%',
		iconRowJustify: 'space-between',
		iconWrapperH: '70%',
		iconWrapperGap: '36px',
		titleOutside: false,
	},
	'desktop-sm': {
		outerW: '100%',
		outerH: '100%',
		outerJustify: 'space-between',
		useGrid: true,
		gridGap: '20px',
		titleOutside: false,
	},
	'desktop-md': {
		outerW: '100%',
		outerH: '100%',
		outerJustify: 'space-between',
		useGrid: true,
		gridGap: '20px',
		titleOutside: false,
	},
	'desktop-lg': {
		outerW: '100%',
		outerH: '100%',
		outerJustify: 'space-between',
		useGrid: true,
		gridGap: '20px',
		titleOutside: false,
	},
	'desktop-xl': {
		outerW: '100%',
		outerH: '100%',
		outerJustify: 'space-between',
		useGrid: true,
		gridGap: '24px',
		titleOutside: true,
	},
};

interface ProjectsConfig {
	outerW: string;
	outerMaxW?: string;
	outerH: string;
	outerMinH?: string;
	outerGap: string;
	outerJustify: string;
	cardGap: string;
}

export const projectsConfig: Record<Breakpoint, ProjectsConfig> = {
	'mobile-sm': {
		outerW: '100%',
		outerMaxW: '500px',
		outerH: '100%',
		outerGap: '36px',
		outerJustify: 'center',
		cardGap: '12px',
	},
	'mobile-lg': {
		outerW: '80%',
		outerH: '100%',
		outerGap: '36px',
		outerJustify: 'center',
		cardGap: '12px',
	},
	tablet: {
		outerW: '80%',
		outerH: '100%',
		outerGap: '36px',
		outerJustify: 'center',
		cardGap: '12px',
	},
	'desktop-sm': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '450px',
		outerGap: '36px',
		outerJustify: 'space-between',
		cardGap: '20px',
	},
	'desktop-md': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '450px',
		outerGap: '36px',
		outerJustify: 'space-between',
		cardGap: '20px',
	},
	'desktop-lg': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '490px',
		outerGap: '36px',
		outerJustify: 'space-between',
		cardGap: '20px',
	},
	'desktop-xl': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '530px',
		outerGap: '36px',
		outerJustify: 'space-between',
		cardGap: '20px',
	},
};

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
	carouselDirection?: string;
}

export const worksConfig: Record<Breakpoint, WorksConfig> = {
	'mobile-sm': {
		titleOutside: false,
		outerW: '100%',
		outerMaxW: '500px',
		outerH: '100%',
		outerGap: '36px',
	},
	'mobile-lg': {
		titleOutside: false,
		outerW: '80%',
		outerH: '100%',
		outerGap: '36px',
	},
	tablet: {
		titleOutside: false,
		outerW: '80%',
		outerH: '100%',
		outerGap: '36px',
		carouselCss: 'overflow: hidden;',
		carouselW: '100vw',
	},
	'desktop-sm': {
		titleOutside: true,
		titleM: ['36', '0', '0', '0'],
		outerW: '100%',
		outerH: 'auto',
		outerGap: '36px',
		carouselCss: 'overflow: hidden;',
		carouselMinH: '402px',
		carouselW: '100%',
		carouselDirection: 'row',
	},
	'desktop-md': {
		titleOutside: true,
		titleM: ['36', '0', '0', '0'],
		outerW: '100%',
		outerH: 'auto',
		outerGap: '36px',
		carouselCss: 'overflow: hidden;',
		carouselMinH: '402px',
		carouselW: '100%',
		carouselDirection: 'row',
	},
	'desktop-lg': {
		titleOutside: true,
		titleM: ['36', '0', '0', '0'],
		outerW: '100%',
		outerH: 'auto',
		outerGap: '36px',
		carouselCss: 'overflow: hidden;',
		carouselMinH: '402px',
		carouselW: '100%',
		carouselDirection: 'row',
	},
	'desktop-xl': {
		titleOutside: true,
		titleM: ['36', '0', '0', '0'],
		outerW: '100%',
		outerH: 'auto',
		outerGap: '36px',
		carouselCss: 'overflow: hidden;',
		carouselMinH: '402px',
		carouselW: '100%',
		carouselDirection: 'row',
	},
};

interface CarouselConfig {
	useSwiper: boolean;
	slidesPerView?: number;
	centeredSlides?: boolean;
	spaceBetween?: number;
}

export const carouselConfig: Record<Breakpoint, CarouselConfig> = {
	'mobile-sm': { useSwiper: false },
	'mobile-lg': { useSwiper: false },
	tablet: { useSwiper: true, slidesPerView: 1, centeredSlides: true, spaceBetween: 5 },
	'desktop-sm': { useSwiper: true, slidesPerView: 2, centeredSlides: false, spaceBetween: 10 },
	'desktop-md': { useSwiper: true, slidesPerView: 2, centeredSlides: false, spaceBetween: 10 },
	'desktop-lg': { useSwiper: true, slidesPerView: 2, centeredSlides: false, spaceBetween: 10 },
	'desktop-xl': { useSwiper: true, slidesPerView: 3, centeredSlides: false, spaceBetween: 10 },
};
