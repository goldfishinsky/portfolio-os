'use client';

import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export function ThemeProvider() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return null;
}
