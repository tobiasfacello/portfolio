import { ReactNode } from 'react';

export type ThemeProviderProps = {
	children: ReactNode;
};

export type ThemeContextType = {
	isDarkMode: boolean;
};
