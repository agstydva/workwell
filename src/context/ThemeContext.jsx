import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('workwell_theme') || 'system';
  });

  const [activeTheme, setActiveTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let resolved = 'dark';
      if (theme === 'dark') {
        resolved = 'dark';
      } else if (theme === 'light') {
        resolved = 'light';
      } else {
        // Fallback to system color scheme
        resolved = mediaQuery.matches ? 'dark' : 'light';
      }

      setActiveTheme(resolved);
      
      if (resolved === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('workwell_theme', theme);

    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, activeTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
