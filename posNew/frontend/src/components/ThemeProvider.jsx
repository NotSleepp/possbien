import React, { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Theme Context for providing theme state throughout the application
 */
const ThemeContext = createContext(null);

/**
 * ThemeProvider component that wraps the application and provides theme context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider = ({ children }) => {
  const themeState = useTheme();

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme context
 * Must be used within a ThemeProvider
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeProvider;