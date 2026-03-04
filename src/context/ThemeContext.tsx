//! React Core
import { createContext, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';

//! Types
import { ThemeContextType, ThemeMode, ThemeProviderProps } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

const darkMql = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null;

function subscribeSystemDark(callback: () => void) {
  darkMql?.addEventListener('change', callback);
  return () => { darkMql?.removeEventListener('change', callback); };
}

function getSystemDark() {
  return darkMql?.matches ?? false;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getInitialMode);
  const systemDark = useSyncExternalStore(subscribeSystemDark, getSystemDark, () => false);

  const isDarkMode = themeMode === 'system' ? systemDark : themeMode === 'dark';

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('theme', mode);
  }, []);

  //? Apply data-theme attribute to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.dataset.theme = themeMode;
    }
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
