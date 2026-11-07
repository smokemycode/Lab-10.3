// Instead of Prop drilling themes, will live here so any component can read and change without props.
import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from "react";
import type { Theme } from "../types"

// What the context provides
interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextValue | null>(null);

// The saved theme from localStorage 
function loadTheme(): Theme {
    const saved = localStorage.getItem("task-dashboard-theme");
    return saved === "dark" ? "dark" : "light";
}

// Makes the theme available everywhere
export function ThemeProvider({ children }: { children: ReactNode }) {
    // Only ran once on first render
    const [theme, setTheme] = useState<Theme>(loadTheme);

    // Whenever `theme` changes, save it and toggle the "dark" class on <html>
    useEffect(() => {
        localStorage.setItem("task-dashboard-theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    // Flip light <-> dark
    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }, []);

    // Everything together we want to share
    const value = useMemo(
  () => ({ theme, toggleTheme, setTheme }),
  [theme, toggleTheme, setTheme]
);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Custom hook
export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used inside a <ThemeProvider>");
    }
    return context;
}