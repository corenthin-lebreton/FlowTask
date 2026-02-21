import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'flowtask_theme';

export function useTheme() {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        // Au chargement initial, on récupère le state depuis le localStorage ou les préréglages système
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme) {
                return savedTheme === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        // Appliquer la modification sur le document root <html> pour TailwindCSS (class="dark")
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem(THEME_STORAGE_KEY, 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem(THEME_STORAGE_KEY, 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return { isDarkMode, toggleTheme };
}
