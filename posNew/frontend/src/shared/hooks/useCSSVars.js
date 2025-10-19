import { useCallback } from 'react';
import { useThemeContext } from '../../providers/ThemeProvider';

/**
 * useCSSVars
 * Helper hook to read CSS variables from :root and react to theme changes.
 *
 * Usage:
 * const { getVar } = useCSSVars();
 * const color = getVar('--color-primary', '#3b82f6');
 */
export const useCSSVars = () => {
  const { currentTheme } = useThemeContext();

  const getVar = useCallback((name, fallback) => {
    if (typeof document === 'undefined') return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    const trimmed = value ? value.trim() : '';
    return trimmed || fallback;
  }, [currentTheme?.name]);

  return { getVar };
};

export default useCSSVars;