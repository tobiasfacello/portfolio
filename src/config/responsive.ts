import { Breakpoint } from '../hooks/useBreakpoint';

interface AboutConfig {
	outerW: string;
	outerMaxW?: string;
	outerH?: string;
	outerMinH?: string;
	outerGap: string;
	paragraphGap: string;
	paragraphVariant: string;
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
		paragraphVariant: 'paragraph',
	},
	'mobile-lg': {
		outerW: '80%',
		outerGap: '24px',
		paragraphGap: '12px',
		paragraphVariant: 'paragraph',
	},
	tablet: {
		outerW: '80%',
		outerGap: '24px',
		paragraphGap: '12px',
		paragraphVariant: 'paragraph',
		titleAlign: 'left',
	},
	'desktop-sm': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '450px',
		outerGap: '36px',
		paragraphGap: '20px',
		paragraphVariant: 'paragraph',
		titleAlign: 'left',
	},
	'desktop-md': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '450px',
		outerGap: '36px',
		paragraphGap: '20px',
		paragraphVariant: 'paragraph',
	},
	'desktop-lg': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '490px',
		outerGap: '36px',
		paragraphGap: '20px',
		paragraphVariant: 'paragraph-desktop',
	},
	'desktop-xl': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '530px',
		outerGap: '36px',
		paragraphGap: '20px',
		paragraphVariant: 'paragraph-desktop',
		innerW: '80%',
	},
};

interface SkillsConfig {
	outerW: string;
	outerMaxW?: string;
	outerH: string;
	outerJustify: string;
	iconRowW?: string;
	iconRowJustify: string;
	iconWrapperH?: string;
	iconWrapperGap?: string;
	titleOutside: boolean;
	titleM?: string[];
	iconContainerP?: string[];
}

export const skillsConfig: Record<Breakpoint, SkillsConfig> = {
	'mobile-sm': {
		outerW: '100%',
		outerMaxW: '500px',
		outerH: '70%',
		outerJustify: 'center',
		iconRowJustify: 'space-between',
		titleOutside: false,
	},
	'mobile-lg': {
		outerW: '80%',
		outerH: '70%',
		outerJustify: 'center',
		iconRowW: '100%',
		iconRowJustify: 'space-evenly',
		iconWrapperH: '70%',
		iconWrapperGap: '36px',
		titleOutside: false,
	},
	tablet: {
		outerW: '80%',
		outerH: '100%',
		outerJustify: 'center',
		iconRowW: '70%',
		iconRowJustify: 'space-evenly',
		iconWrapperH: '70%',
		iconWrapperGap: '36px',
		titleOutside: false,
	},
	'desktop-sm': {
		outerW: '100%',
		outerH: 'auto',
		outerJustify: 'center',
		iconRowJustify: 'space-between',
		iconWrapperH: 'auto',
		iconWrapperGap: '36px',
		titleOutside: false,
	},
	'desktop-md': {
		outerW: '100%',
		outerH: 'auto',
		outerJustify: 'center',
		iconRowJustify: 'space-between',
		iconWrapperH: 'auto',
		iconWrapperGap: '36px',
		titleOutside: false,
	},
	'desktop-lg': {
		outerW: '80%',
		outerH: 'auto',
		outerJustify: 'center',
		iconRowJustify: 'space-between',
		iconWrapperH: 'auto',
		iconWrapperGap: '36px',
		titleOutside: false,
	},
	'desktop-xl': {
		outerW: '100%',
		outerH: '70%',
		outerJustify: 'center',
		iconRowJustify: 'space-between',
		titleOutside: true,
		titleM: ['48', '0', '36', '0'],
		iconContainerP: ['0', '72', '0', '72'],
	},
};

interface ProjectsConfig {
	outerW: string;
	outerMaxW?: string;
	outerH: string;
	outerMinH?: string;
	outerJustify: string;
	titleJustify: string;
	titleH?: string;
	cardGap: string;
}

export const projectsConfig: Record<Breakpoint, ProjectsConfig> = {
	'mobile-sm': {
		outerW: '100%',
		outerMaxW: '500px',
		outerH: '80%',
		outerJustify: 'center',
		titleJustify: 'flex-start',
		titleH: undefined,
		cardGap: '12px',
	},
	'mobile-lg': {
		outerW: '80%',
		outerH: '80%',
		outerJustify: 'center',
		titleJustify: 'flex-start',
		titleH: '100%',
		cardGap: '12px',
	},
	tablet: {
		outerW: '80%',
		outerH: '100%',
		outerJustify: 'center',
		titleJustify: 'flex-start',
		titleH: '100%',
		cardGap: '12px',
	},
	'desktop-sm': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '450px',
		outerJustify: 'space-between',
		titleJustify: 'space-between',
		titleH: '100%',
		cardGap: '20px',
	},
	'desktop-md': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '450px',
		outerJustify: 'space-between',
		titleJustify: 'space-between',
		titleH: '100%',
		cardGap: '20px',
	},
	'desktop-lg': {
		outerW: '100%',
		outerH: '100%',
		outerMinH: '490px',
		outerJustify: 'space-between',
		titleJustify: 'space-between',
		titleH: '100%',
		cardGap: '20px',
	},
	'desktop-xl': {
		outerW: '75%',
		outerH: '100%',
		outerMinH: '530px',
		outerJustify: 'space-between',
		titleJustify: 'flex-start',
		cardGap: '20px',
	},
};

interface WorksConfig {
	titleOutside: boolean;
	titleM?: string[];
	outerW: string;
	outerMaxW?: string;
	outerH: string;
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
	},
	'mobile-lg': {
		titleOutside: false,
		outerW: '80%',
		outerH: '100%',
	},
	tablet: {
		titleOutside: false,
		outerW: '80%',
		outerH: '100%',
		carouselCss: 'overflow: hidden;',
		carouselW: '100vw',
	},
	'desktop-sm': {
		titleOutside: true,
		titleM: ['36', '0', '0', '0'],
		outerW: '90%',
		outerH: 'auto',
		carouselCss: 'overflow: hidden;',
		carouselMinH: '402px',
		carouselW: '100%',
		carouselDirection: 'row',
	},
	'desktop-md': {
		titleOutside: true,
		titleM: ['36', '0', '0', '0'],
		outerW: '90%',
		outerH: 'auto',
		carouselCss: 'overflow: hidden;',
		carouselMinH: '402px',
		carouselW: '100%',
		carouselDirection: 'row',
	},
	'desktop-lg': {
		titleOutside: true,
		titleM: ['36', '0', '0', '0'],
		outerW: '90%',
		outerH: 'auto',
		carouselCss: 'overflow: hidden;',
		carouselMinH: '402px',
		carouselW: '100%',
		carouselDirection: 'row',
	},
	'desktop-xl': {
		titleOutside: true,
		titleM: ['48', '0', '0', '0'],
		outerW: '90%',
		outerH: 'auto',
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

