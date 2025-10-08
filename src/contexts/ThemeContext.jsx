import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    // Sistem temasını yoxla
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDirection = localStorage.getItem('direction') || 'ltr';
    
    setTheme(savedTheme);
    setDirection(savedDirection);
    
    // HTML elementinə tətbiq et
    document.documentElement.className = `${savedTheme} ${savedDirection}`;
    document.documentElement.setAttribute('dir', savedDirection);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = document.documentElement.className.replace(
      /(light|dark)/, 
      newTheme
    );
  };

  const toggleDirection = () => {
    const newDirection = direction === 'ltr' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    localStorage.setItem('direction', newDirection);
    document.documentElement.setAttribute('dir', newDirection);
    document.documentElement.className = document.documentElement.className.replace(
      /(ltr|rtl)/, 
      newDirection
    );
  };

  const value = {
    theme,
    direction,
    toggleTheme,
    toggleDirection,
    isDark: theme === 'dark',
    isRTL: direction === 'rtl'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;