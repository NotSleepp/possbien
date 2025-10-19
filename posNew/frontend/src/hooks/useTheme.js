import { useState, useEffect } from 'react';
import { themes } from '../styles/theme';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Try to get theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = themes.find(t => t.name === savedTheme);
      if (theme) return theme;
    }
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return themes.find(t => t.prefersdark === prefersDark) || themes.find(t => t.default) || themes[0];
  });

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme.name);
  }, [currentTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if no theme is saved in localStorage
      if (!localStorage.getItem('theme')) {
        const newTheme = themes.find(t => t.prefersdark === e.matches) || themes.find(t => t.default) || themes[0];
        setCurrentTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    // Apply all CSS variables from the theme
    Object.keys(theme).forEach(key => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, theme[key]);
      }
    });
    
    // Set color-scheme
    root.style.setProperty('color-scheme', theme['color-scheme']);
  };

  const switchTheme = (themeName) => {
    const theme = themes.find(t => t.name === themeName);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const toggleTheme = () => {
    const currentIndex = themes.findIndex(t => t.name === currentTheme.name);
    const nextIndex = (currentIndex + 1) % themes.length;
    setCurrentTheme(themes[nextIndex]);
  };

  const resetTheme = () => {
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const newTheme = themes.find(t => t.prefersdark === prefersDark) || themes.find(t => t.default) || themes[0];
    setCurrentTheme(newTheme);
  };

  return {
    currentTheme,
    switchTheme,
    toggleTheme,
    resetTheme,
    availableThemes: themes,
  };
};