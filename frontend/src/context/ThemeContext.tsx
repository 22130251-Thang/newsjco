import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../lib/store/hooks';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;

    if (user?.theme) return user.theme;

    return 'light';
  });

  useEffect(() => {
    if (isAuthenticated && user?.theme) {
      setTheme(user.theme);
    }
  }, [user?.theme, isAuthenticated]);

  useEffect(() => {
    const html = document.documentElement;

    if (theme === 'dark') {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#e0e0e0';

    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f5f5f5';
      document.body.style.color = '#222222';

    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    const html = document.documentElement;


    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }


    localStorage.setItem('theme', newTheme);

    if (isAuthenticated) {
      fetch('/api/user/theme', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ theme: newTheme }),
      }).catch((error) => {
        console.error('Failed to update theme:', error);
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
