import { ReactNode } from 'react';

export type ThemeProviderProps = {
	children: ReactNode;
};

export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemeContextType = {
	isDarkMode: boolean;
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
};

export type ContainerProps = {
	children?: ReactNode;
	w?: string;
	minW?: string;
	maxW?: string;
	h?: string;
	minH?: string;
	maxH?: string;
	m?: string[];
	p?: string[];
	direction?: string;
	justify?: string;
	align?: string;
	gap?: string;
	wrap?: string;
	display?: string;
	$css?: string;
	flex?: number;
	ref?: React.Ref<HTMLDivElement>;
};

export type TextProps = {
	children?: ReactNode;
	as?: React.ElementType;
	w?: string;
	h?: string;
	m?: string[];
	p?: string[];
	variant?: string;
	alignment?: string;
};

export type WorkCardProps = {
	slug: string;
	url: string;
	showcaseUrl?: string;
	Logo: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	p?: string[];
	m?: string[];
};

export type ProjectCardProps = {
	slug: string;
	url: string;
	src: string;
};

export type ButtonProps = {
	children?: ReactNode;
	title: string;
	url?: string;
	p?: string[];
	m?: string[];
	onClick?: (e: React.MouseEvent) => void;
};

export type SocialButtonProps = {
	url: string;
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	alt?: string;
	tooltipPosition?: 'top' | 'bottom';
};

export type PillProps = {
	tag: string;
	spinnerName?: 'braille' | 'diagswipe' | 'breathe';
	maxW?: string;
	m?: string[];
	p?: string[];
};

export type TooltipProps = {
	text: string;
	children: ReactNode;
	position?: 'top' | 'bottom';
	icon?: ReactNode;
	href?: string;
};

export type IconFrameProps = {
	Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type ImageFrameProps = {
	src: string;
	alt?: string;
	p?: string[];
	m?: string[];
};

export type LightboxImage = {
	src: string;
	alt: string;
};

export type LightboxContextType = {
	register: (images: LightboxImage[]) => () => void;
	open: (src: string) => void;
	close: () => void;
	prev: () => void;
	next: () => void;
	currentIndex: number;
	isOpen: boolean;
	images: LightboxImage[];
	direction: 1 | -1;
};
