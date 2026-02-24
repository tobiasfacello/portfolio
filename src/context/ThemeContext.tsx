//! React Core
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

//! Types
import { ThemeContextType, ThemeMode, ThemeProviderProps } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getInitialMode);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('theme', mode);
  }, []);

  //? Apply data-theme attribute to <html> and derive isDarkMode
  useEffect(() => {
    const root = document.documentElement;
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (themeMode === 'system') {
      root.removeAttribute('data-theme');
      setIsDarkMode(darkModeMediaQuery.matches);
    } else {
      root.dataset.theme = themeMode;
      setIsDarkMode(themeMode === 'dark');
    }

    const handler = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, [themeMode]);

  const value = useMemo(
    () => ({ isDarkMode, themeMode, setThemeMode }),
    [isDarkMode, themeMode, setThemeMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
