import { ReactNode } from 'react';

export type ThemeProviderProps = {
	children: ReactNode;
};

export type ThemeContextType = {
	isDarkMode: boolean;
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
	title: string;
	tags: string[];
	details: string;
	url: string;
	showcaseUrl?: string;
	src: string;
	p?: string[];
	m?: string[];
};

export type ProjectCardProps = {
	title: string;
	details: string;
	tag: string;
	url: string;
	src: string;
};

export type ButtonProps = {
	children?: ReactNode;
	title: string;
	url: string;
	p?: string[];
	m?: string[];
};

export type SocialButtonProps = {
	url: string;
	src: string;
	alt?: string;
};

export type PillProps = {
	tag: string;
	maxW?: string;
	m?: string[];
	p?: string[];
};

export type IconFrameProps = {
	src: string;
	alt?: string;
};

export type ImageFrameProps = {
	src: string;
	alt?: string;
	p?: string[];
	m?: string[];
};

export type SectionProps = {
	flex?: number;
};
