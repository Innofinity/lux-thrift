import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Default to dark mode as per requirements
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('luxthrift_theme');
        return savedTheme || 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove old theme
        root.classList.remove('light', 'dark');

        // Add new theme
        root.classList.add(theme);

        // Save to local storage
        localStorage.setItem('luxthrift_theme', theme);

    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
