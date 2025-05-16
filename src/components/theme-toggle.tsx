
"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  // Initialize state from localStorage or default to 'dark'
  // For this implementation, we default to 'dark' and assume the layout.tsx sets the initial class.
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    const currentThemeIsDark = root.classList.contains('dark');
    
    // Initialize state based on the class already on <html> (set by RootLayout)
    // This helps ensure consistency if localStorage was to be added later or for SSR.
    setTheme(currentThemeIsDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      // localStorage.setItem('theme', 'light'); // Optional: persist theme
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      // localStorage.setItem('theme', 'dark'); // Optional: persist theme
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 h-9 w-9 rounded-full bg-background/50 hover:bg-accent/80 text-foreground"
      aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
